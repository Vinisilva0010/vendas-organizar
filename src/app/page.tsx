"use client";

import { useState, useEffect, useMemo } from 'react';
// Tipos atualizados
import type { Supplier, Quote, Proposal as QuoteProposal, PurchaseOrder, OrderStatus, OrderItem } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SupplierList from '@/components/supplier-list'; 
import SupplierForm from '@/components/supplier-form';
import QuoteList from '@/components/quote-list';
import QuoteComparison from '@/components/quote-comparison';
import OrderCard from '@/components/order-card'; // Importando o novo card de pedido
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Colunas do Kanban
const KANBAN_COLUMNS: { id: OrderStatus; title: string }[] = [
  { id: 'placed', title: 'Pedidos Realizados' },
  { id: 'shipped', title: 'Aguardando Envio' },
  { id: 'in-transit', title: 'Em Trânsito' },
  { id: 'received', title: 'Recebido' },
];

export default function Home() {
  // --- Estados da Aplicação ---
  const [activeTab, setActiveTab] = useState<'suppliers' | 'quotes' | 'orders'>('suppliers');
  
  // Estado dos Fornecedores
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState('');

  // Estado das Cotações
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);

  // Estado dos Pedidos de Compra (Módulo 3)
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);


  // --- LÓGICA DE FORNECEDORES ---
  useEffect(() => {
    const savedSuppliers = localStorage.getItem('zanvexis_suppliers');
    if (savedSuppliers) {
      try {
        const parsed = JSON.parse(savedSuppliers);
        if (Array.isArray(parsed)) {
          setSuppliers(parsed);
          if (parsed.length > 0 && !selectedSupplierId) {
            setSelectedSupplierId(parsed[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to parse suppliers from localStorage", error);
        setSuppliers([]); // Reseta em caso de erro
      }
    }
  }, []);

  useEffect(() => {
    if (suppliers.length > 0) {
      localStorage.setItem('zanvexis_suppliers', JSON.stringify(suppliers));
    }
  }, [suppliers]);

  const handleAddNewSupplier = () => {
    const newSupplier: Supplier = {
      id: new Date().toISOString(),
      companyName: 'Novo Fornecedor',
      contactName: '', email: '', phone: '', products: '', notes: ''
    };
    setSuppliers(prev => [newSupplier, ...prev]);
    setSelectedSupplierId(newSupplier.id);
  };
  
  const handleSaveSupplier = (formState: Partial<Supplier>) => {
    if (!selectedSupplierId) return;
    setSuppliers(prev =>
      prev.map(s => s.id === selectedSupplierId ? { ...s, ...formState } as Supplier : s)
    );
  };

  const handleDeleteSupplier = (supplierId: string) => {
    setSuppliers(prev => {
      const remaining = prev.filter(s => s.id !== supplierId);
      if (selectedSupplierId === supplierId) {
        setSelectedSupplierId(remaining.length > 0 ? remaining[0].id : null);
      }
      return remaining;
    });
  };

  const filteredSuppliers = useMemo(() =>
    suppliers.filter(s =>
      s.companyName.toLowerCase().includes(supplierSearchTerm.toLowerCase()) ||
      s.contactName.toLowerCase().includes(supplierSearchTerm.toLowerCase())
    ), [suppliers, supplierSearchTerm]);

  const selectedSupplier = useMemo(() =>
    suppliers.find(s => s.id === selectedSupplierId) ?? null,
    [selectedSupplierId, suppliers]);


  // --- LÓGICA DE COTAÇÕES ---
  useEffect(() => {
    const savedQuotes = localStorage.getItem('zanvexis_quotes');
    if (savedQuotes) {
      try {
        const parsed = JSON.parse(savedQuotes);
        if (Array.isArray(parsed)) {
          setQuotes(parsed);
          if (parsed.length > 0 && !selectedQuoteId) {
            setSelectedQuoteId(parsed[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to parse quotes from localStorage", error);
        setQuotes([]);
      }
    }
  }, []);

  useEffect(() => {
     if (quotes.length > 0) {
        localStorage.setItem('zanvexis_quotes', JSON.stringify(quotes));
     }
  }, [quotes]);

  const handleAddNewQuote = () => {
    const name = prompt("Qual o nome do item para a nova cotação?");
    if (name) {
      const newQuote: Quote = { id: new Date().toISOString(), name, proposals: [] };
      setQuotes(prev => [newQuote, ...prev]);
      setSelectedQuoteId(newQuote.id);
    }
  };

  const handleUpdateQuote = (updatedQuote: Quote) => {
    setQuotes(prevQuotes =>
      prevQuotes.map(q => q.id === updatedQuote.id ? updatedQuote : q)
    );
  };
  
  const handleDeleteQuote = (quoteId: string) => {
    setQuotes(prev => {
      const remaining = prev.filter(q => q.id !== quoteId);
      if (selectedQuoteId === quoteId) {
        setSelectedQuoteId(remaining.length > 0 ? remaining[0].id : null);
      }
      return remaining;
    });
  };

  const selectedQuote = useMemo(() => {
    if (!selectedQuoteId) return null;
    
    const quote = quotes.find(q => q.id === selectedQuoteId);
    if (!quote) return null;

    if (quote.proposals.length === 0) return quote;

    let bestProposalId: string | null = null;
    let minCost = Infinity;

    quote.proposals.forEach(proposal => {
      const realCost = (proposal.unitPrice * proposal.moq + proposal.shippingCost) / proposal.moq;
      if (realCost < minCost) {
        minCost = realCost;
        bestProposalId = proposal.id;
      }
    });

    return {
      ...quote,
      proposals: quote.proposals.map(p => ({
        ...p,
        isBestOption: p.id === bestProposalId,
      })),
    };
  }, [selectedQuoteId, quotes]);

  // Exemplo de dados estáticos para o Kanban
  const staticOrders: PurchaseOrder[] = [
    { id: '1', displayId: '#PEDIDO-001', supplierName: 'Fornecedor Alpha', orderDate: '2025-09-24', expectedDeliveryDate: '2025-10-10', totalValue: 1250.00, status: 'placed', items: [] , supplierId: '1' },
    { id: '2', displayId: '#PEDIDO-002', supplierName: 'Indústrias Beta', orderDate: '2025-09-22', expectedDeliveryDate: '2025-10-05', totalValue: 800.50, status: 'shipped', items: [], supplierId: '2'  },
    { id: '3', displayId: '#PEDIDO-003', supplierName: 'Fornecedor Gamma', orderDate: '2025-09-20', expectedDeliveryDate: '2025-09-30', totalValue: 3450.00, status: 'in-transit', items: [], supplierId: '3'  },
  ];


  return (
    <div className="bg-background min-h-screen text-foreground">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 font-headline">
          Central de Compras Inteligente
        </h1>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
            <TabsTrigger value="suppliers">Fornecedores</TabsTrigger>
            <TabsTrigger value="quotes">Cotações</TabsTrigger>
            <TabsTrigger value="orders">Pedidos de Compra</TabsTrigger>
          </TabsList>
          
          <TabsContent value="suppliers" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <SupplierList 
                  suppliers={filteredSuppliers}
                  selectedSupplierId={selectedSupplierId}
                  onSelectSupplier={setSelectedSupplierId}
                  onAddNew={handleAddNewSupplier}
                  searchTerm={supplierSearchTerm}
                  setSearchTerm={setSupplierSearchTerm}
                />
              </div>
              <div className="lg:col-span-2">
                {selectedSupplier ? (
                  <SupplierForm 
                    key={selectedSupplier.id}
                    supplier={selectedSupplier}
                    onSave={handleSaveSupplier}
                    onDelete={() => handleDeleteSupplier(selectedSupplier.id)}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">Selecione ou crie um fornecedor.</div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quotes" className="mt-6">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-1">
                 <QuoteList 
                   quotes={quotes}
                   selectedQuoteId={selectedQuoteId}
                   onSelectQuote={setSelectedQuoteId}
                   onAddNew={handleAddNewQuote}
                   onDeleteQuote={handleDeleteQuote}
                 />
               </div>
               <div className="lg:col-span-2">
                {selectedQuote ? (
                  <QuoteComparison
                    key={selectedQuote.id}
                    quote={selectedQuote}
                    suppliers={suppliers} 
                    onUpdateQuote={handleUpdateQuote}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">Selecione ou crie uma cotação.</div>
                )}
               </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <div className="mb-6">
              <Button size="lg" onClick={() => setIsOrderModalOpen(true)}>Criar Novo Pedido</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {KANBAN_COLUMNS.map(column => (
                <div key={column.id} className="bg-muted/30 rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-4 text-center">{column.title}</h2>
                  <div className="space-y-4 min-h-[50vh]">
                     {/* Renderização dinâmica dos pedidos virá aqui */}
                     {staticOrders.filter(o => o.status === column.id).map(order => (
                       <OrderCard key={order.id} order={order} />
                     ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

        </Tabs>
      </main>

      {/* Modal para Adicionar Pedido */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
            <CardHeader><CardTitle>Criar Novo Pedido de Compra</CardTitle></CardHeader>
            <CardContent className="flex-grow overflow-y-auto space-y-4 pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label>Fornecedor</Label>
                      <Select>
                          <SelectTrigger><SelectValue placeholder="Selecione um fornecedor..." /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="1">Fornecedor Alpha</SelectItem>
                              <SelectItem value="2">Indústrias Beta</SelectItem>
                              {/* Será populado com a lista de fornecedores */}
                          </SelectContent>
                      </Select>
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="orderDate">Data do Pedido</Label>
                      <Input id="orderDate" type="date" />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="expectedDeliveryDate">Previsão de Entrega</Label>
                      <Input id="expectedDeliveryDate" type="date" />
                  </div>
                </div>
                
                <h3 className="font-semibold pt-4 border-t">Itens do Pedido</h3>
                <div className="space-y-2">
                  {/* Linha de item estática */}
                  <div className="grid grid-cols-[1fr,80px,120px,40px] gap-2 items-center">
                    <Input placeholder="Nome do Produto" />
                    <Input type="number" placeholder="Qtd." />
                    <Input type="number" placeholder="Preço Unit." />
                    <Button variant="ghost" size="sm" className="text-destructive">X</Button>
                  </div>
                   <Button variant="outline" size="sm">+ Adicionar Item</Button>
                </div>

                <div className="pt-4 border-t text-right">
                    <Label className="text-muted-foreground">Valor Total</Label>
                    <p className="text-2xl font-bold">R$ 0,00</p>
                    <small className="text-muted-foreground">Total será calculado aqui</small>
                </div>

            </CardContent>
            <CardFooter className="justify-end space-x-2 border-t pt-4">
                <Button variant="ghost" onClick={() => setIsOrderModalOpen(false)}>Cancelar</Button>
                <Button>Salvar Pedido</Button>
            </CardFooter>
          </Card>
        </div>
      )}

    </div>
  );
}
