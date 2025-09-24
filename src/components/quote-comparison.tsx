'use client';

import { useState } from 'react';
import type { Quote, Proposal, Supplier } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';

interface QuoteComparisonProps {
  quote: Quote;
  suppliers: Supplier[];
  onUpdateQuote: (updatedQuote: Quote) => void;
}

export default function QuoteComparison({ quote, suppliers, onUpdateQuote }: QuoteComparisonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProposal, setNewProposal] = useState<Partial<Omit<Proposal, 'id' | 'supplierName' | 'isBestOption'>>>({
    supplierId: '',
    unitPrice: 0,
    shippingCost: 0,
    moq: 1,
    leadTime: 0
  });

  const handleAddProposal = () => {
    if (!newProposal.supplierId || newProposal.unitPrice === undefined) return;
    
    const supplier = suppliers.find(s => s.id === newProposal.supplierId);
    if (!supplier) return;

    const proposalToAdd: Proposal = {
      id: new Date().toISOString(),
      supplierId: supplier.id,
      supplierName: supplier.companyName,
      unitPrice: Number(newProposal.unitPrice || 0),
      shippingCost: Number(newProposal.shippingCost || 0),
      moq: Number(newProposal.moq || 1),
      leadTime: Number(newProposal.leadTime || 0),
      isBestOption: false,
    };
    
    const updatedQuote = {
      ...quote,
      proposals: [...quote.proposals, proposalToAdd]
    };
    onUpdateQuote(updatedQuote);
    setIsModalOpen(false);
    setNewProposal({ unitPrice: 0, shippingCost: 0, moq: 1, leadTime: 0 });
  };

  const handleRemoveProposal = (proposalId: string) => {
    const updatedQuote = {
        ...quote,
        proposals: quote.proposals.filter(p => p.id !== proposalId)
    };
    onUpdateQuote(updatedQuote);
  }
  
  const calculateRealCost = (proposal: Proposal) => {
    if (!proposal.moq || proposal.moq <= 0) return Infinity;
    return (proposal.unitPrice * proposal.moq + proposal.shippingCost) / proposal.moq;
  };

  return (
    <>
      <Card className="h-full bg-card/50">
        <CardHeader>
          <CardTitle className="font-mono text-2xl">{quote.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Fornecedor</TableHead>
                <TableHead>Preço/Unid.</TableHead>
                <TableHead>Frete</TableHead>
                <TableHead>QMP</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead className='text-primary'>Custo Real/Unid.</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quote.proposals.length > 0 ? quote.proposals.map((p) => (
                <TableRow key={p.id} className={p.isBestOption ? 'bg-accent/10 hover:bg-accent/20' : 'hover:bg-muted/30'}>
                  <TableCell className="font-medium">
                    {p.supplierName}
                    {p.isBestOption && <Badge className="ml-2 bg-accent text-accent-foreground border-accent-foreground/50">Melhor Opção</Badge>}
                  </TableCell>
                  <TableCell>{p.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                  <TableCell>{p.shippingCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                  <TableCell>{p.moq} unid.</TableCell>
                  <TableCell>{p.leadTime} dias</TableCell>
                  <TableCell className="font-bold text-lg">{calculateRealCost(p).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveProposal(p.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                    Nenhuma proposta adicionada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setIsModalOpen(true)}>Adicionar Proposta</Button>
        </CardFooter>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-card border-primary/50">
            <CardHeader><CardTitle className="font-mono">Adicionar Nova Proposta</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Fornecedor</Label>
                    <Select onValueChange={(value) => setNewProposal(p => ({...p, supplierId: value}))}>
                        <SelectTrigger><SelectValue placeholder="Selecione um fornecedor..." /></SelectTrigger>
                        <SelectContent>
                            {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.companyName}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="unitPrice">Preço/Unidade (R$)</Label>
                      <Input id="unitPrice" type="number" value={newProposal.unitPrice} onChange={e => setNewProposal(p => ({...p, unitPrice: Number(e.target.value)}))} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="shippingCost">Custo do Frete (R$)</Label>
                      <Input id="shippingCost" type="number" value={newProposal.shippingCost} onChange={e => setNewProposal(p => ({...p, shippingCost: Number(e.target.value)}))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="moq">Qtd. Mínima (QMP)</Label>
                      <Input id="moq" type="number" value={newProposal.moq} onChange={e => setNewProposal(p => ({...p, moq: Number(e.target.value)}))} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="leadTime">Prazo Entrega (dias)</Label>
                      <Input id="leadTime" type="number" value={newProposal.leadTime} onChange={e => setNewProposal(p => ({...p, leadTime: Number(e.target.value)}))} />
                  </div>
                </div>
            </CardContent>
            <CardFooter className="justify-end space-x-2">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddProposal}>Salvar Proposta</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
