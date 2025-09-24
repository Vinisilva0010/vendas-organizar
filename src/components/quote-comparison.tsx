
"use client";

import type { Quote, QuoteProposal } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';

interface QuoteComparisonProps {
  quote: Quote | null;
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export default function QuoteComparison({ quote }: QuoteComparisonProps) {
  if (!quote) {
    return (
      <Card className="h-full flex flex-col items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground">Selecione uma cotação para ver os detalhes ou crie uma nova.</p>
        </CardContent>
      </Card>
    );
  }

  const calculateRealCost = (proposal: QuoteProposal) => {
    if (proposal.minPurchaseQuantity === 0) return proposal.pricePerUnit;
    return proposal.pricePerUnit + (proposal.shippingCost / proposal.minPurchaseQuantity);
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <Input 
            id="quoteTitle" 
            type="text" 
            value={quote.title} 
            onChange={() => {}} // Will be implemented later
            className="text-2xl font-headline font-bold border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
        />
      </CardHeader>
      <CardContent className="space-y-6 flex-grow">
        <div className="flex justify-start">
            <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Proposta de Fornecedor
            </Button>
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
                {quote.proposals.map(proposal => (
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
                ))}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
