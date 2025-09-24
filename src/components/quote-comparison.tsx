
"use client";

import { useState } from 'react';
import type { Quote, QuoteProposal, Supplier } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QuoteComparisonProps {
  quote: Quote | null;
  suppliers: Supplier[];
  onUpdateQuote: (quote: Quote) => void;
}

const formatCurrency = (value: number) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'R$ 0,00';
  }
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};


const ProposalModal = ({ quote, suppliers, onUpdateQuote }: { quote: Quote, suppliers: Supplier[], onUpdateQuote: (quote: Quote) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newProposal, setNewProposal] = useState<Partial<Omit<QuoteProposal, 'id' | 'supplierName'>>>({
    pricePerUnit: 0,
    shippingCost: 0,
    minPurchaseQuantity: 1,
    deliveryTimeInDays: 1,
    supplierId: '',
  });

  const handleSave = () => {
    if (!newProposal.supplierId) {
      alert("Por favor, selecione um fornecedor.");
      return;
    }
    const supplier = suppliers.find(s => s.id === newProposal.supplierId);
    if (!supplier) return;

    const proposal: QuoteProposal = {
      id: Date.now().toString(),
      supplierId: supplier.id,
      supplierName: supplier.companyName,
      pricePerUnit: Number(newProposal.pricePerUnit) || 0,
      shippingCost: Number(newProposal.shippingCost) || 0,
      minPurchaseQuantity: Number(newProposal.minPurchaseQuantity) || 1,
      deliveryTimeInDays: Number(newProposal.deliveryTimeInDays) || 1,
    };
    
    const updatedQuote = {
      ...quote,
      proposals: [...quote.proposals, proposal]
    };

    onUpdateQuote(updatedQuote);
    setIsOpen(false);
    // Reset form
    setNewProposal({
        pricePerUnit: 0,
        shippingCost: 0,
        minPurchaseQuantity: 1,
        deliveryTimeInDays: 1,
        supplierId: '',
    });
  };
  
  return (
     <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Proposta de Fornecedor
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Adicionar Nova Proposta para {quote.title}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="supplier" className="text-right">Fornecedor</Label>
                    <Select onValueChange={(value) => setNewProposal({...newProposal, supplierId: value})} value={newProposal.supplierId || ''}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione um fornecedor" />
                        </SelectTrigger>
                        <SelectContent>
                            {suppliers.map(supplier => (
                                <SelectItem key={supplier.id} value={supplier.id}>{supplier.companyName}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="pricePerUnit" className="text-right">Preço/Unid.</Label>
                    <Input id="pricePerUnit" type="number" value={newProposal.pricePerUnit} onChange={e => setNewProposal({...newProposal, pricePerUnit: parseFloat(e.target.value)})} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="shippingCost" className="text-right">Frete</Label>
                    <Input id="shippingCost" type="number" value={newProposal.shippingCost} onChange={e => setNewProposal({...newProposal, shippingCost: parseFloat(e.target.value)})} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="minPurchaseQuantity" className="text-right">QMP</Label>
                    <Input id="minPurchaseQuantity" type="number" min={1} value={newProposal.minPurchaseQuantity} onChange={e => setNewProposal({...newProposal, minPurchaseQuantity: parseInt(e.target.value, 10) || 1})} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="deliveryTimeInDays" className="text-right">Entrega (dias)</Label>
                    <Input id="deliveryTimeInDays" type="number" min={1} value={newProposal.deliveryTimeInDays} onChange={e => setNewProposal({...newProposal, deliveryTimeInDays: parseInt(e.target.value, 10) || 1})} className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button onClick={handleSave}>Salvar Proposta</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}


export default function QuoteComparison({ quote, suppliers, onUpdateQuote }: QuoteComparisonProps) {
  if (!quote) {
    return (
      <Card className="h-full flex flex-col items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground">Selecione uma cotação para ver os detalhes ou crie uma nova.</p>
        </CardContent>
      </Card>
    );
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateQuote({ ...quote, title: e.target.value });
  };

  const calculateRealCost = (proposal: QuoteProposal) => {
    if (!proposal.minPurchaseQuantity || proposal.minPurchaseQuantity <= 0) return Infinity;
    return proposal.pricePerUnit + (proposal.shippingCost / proposal.minPurchaseQuantity);
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <Input 
            id="quoteTitle" 
            type="text" 
            value={quote.title} 
            onChange={handleTitleChange}
            onBlur={() => onUpdateQuote(quote)}
            className="text-2xl font-headline font-bold border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
        />
      </CardHeader>
      <CardContent className="space-y-6 flex-grow">
        <div className="flex justify-start">
            <ProposalModal quote={quote} suppliers={suppliers} onUpdateQuote={onUpdateQuote} />
        </div>
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead>Fornecedor</TableHead>
                    <TableHead className="text-right">Preço/Unid.</TableHead>
                    <TableHead className="text-right">Frete</TableHead>
                    <TableHead className="text-right">QMP (unid.)</TableHead>
                    <TableHead className="text-right">Entrega (dias)</TableHead>
                    <TableHead className="text-right font-bold">Custo Real/Unid.</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {quote.proposals.length > 0 ? (
                    quote.proposals.map(proposal => (
                        <TableRow key={proposal.id} className={proposal.isBestOption ? 'bg-green-500/10' : ''}>
                            <TableCell className="font-medium">
                                {proposal.supplierName}
                                {proposal.isBestOption && (
                                    <Badge variant="secondary" className="ml-2 bg-green-200 text-green-900">Melhor Opção</Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(proposal.pricePerUnit)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(proposal.shippingCost)}</TableCell>
                            <TableCell className="text-right">{proposal.minPurchaseQuantity}</TableCell>
                            <TableCell className="text-right">{proposal.deliveryTimeInDays}</TableCell>
                            <TableCell className="text-right font-bold text-accent-foreground">{formatCurrency(calculateRealCost(proposal))}</TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                            <p>Nenhuma proposta adicionada a esta cotação ainda.</p>
                            <p className="text-sm">Clique em "Adicionar Proposta de Fornecedor" para começar.</p>
                        </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
