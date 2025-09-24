"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import type { Supplier, Quote, PurchaseOrder, OrderStatus, OrderItem } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SupplierList from '@/components/supplier-list'; 
import SupplierForm from '@/components/supplier-form';
import QuoteList from '@/components/quote-list';
import QuoteComparison from '@/components/quote-comparison';
import OrderCard from '@/components/order-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const KANBAN_COLUMNS: { id: OrderStatus; title: string }[] = [
  { id: 'placed', title: 'Pedidos Realizados' },
  { id: 'shipped', title: 'Aguardando Envio' },
  { id: 'in-transit', title: 'Em Trânsito' },
  { id: 'received', title: 'Recebido' },
];

const initialNewOrderState = {
  supplierId: '',
  orderDate: format(new Date(), 'yyyy-MM-dd'),
  expectedDeliveryDate: '',
  items: [{ id: new Date().toISOString(), productName: '', quantity: 1, unitPrice: 0 }],
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<'suppliers' | 'quotes' | 'orders'>('suppliers');
  const { toast } = useToast();

  // Estado dos Fornecedores
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState('');

  // Estado das Cotações
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);

  // Estado dos Pedidos de Compra
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState<Omit<PurchaseOrder, 'id' | 'displayId' | 'totalValue' | 'status' | 'supplierName'>>(initialNewOrderState);
  
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
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('zanvexis_suppliers', JSON.stringify(suppliers));
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
     toast({ title: "Fornecedor salvo!", description: "Os dados foram atualizados." });
  };

  const handleDeleteSupplier = (supplierId: string) => {
    setSuppliers(prev => {
      const remaining = prev.filter(s => s.id !== supplierId);
      if (selectedSupplierId === supplierId) {
        setSelectedSupplierId(remaining.length > 0 ? remaining[0].id : null);
      }
      return remaining;
    });
     toast({ title: "Fornecedor deletado.", variant: "destructive" });
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
        }
      } catch (error) {
        console.error("Failed to parse quotes from localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
     localStorage.setItem('zanvexis_quotes', JSON.stringify(quotes));
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
     toast({ title: "Proposta adicionada!", description: "A cotação foi atualizada." });
  };
  
  const handleDeleteQuote = (quoteId: string) => {
    setQuotes(prev => {
      const remaining = prev.filter(q => q.id !== quoteId);
      if (selectedQuoteId === quoteId) {
        setSelectedQuoteId(remaining.length > 0 ? remaining[0].id : null);
      }
       toast({ title: "Cotação deletada.", variant: "destructive" });
      return remaining;
    });
  };

  const selectedQuote = useMemo(() => {
    if (!selectedQuoteId) return null;
    const quote = quotes.find(q => q.id === selectedQuoteId);
    if (!quote) return null;

    let bestProposalId: string | null = null;
    if (quote.proposals.length > 0) {
        let minCost = Infinity;
        quote.proposals.forEach(proposal => {
            const realCost = proposal.moq > 0 ? (proposal.unitPrice * proposal.moq + proposal.shippingCost) / proposal.moq : Infinity;
            if (realCost < minCost) {
                minCost = realCost;
                bestProposalId = proposal.id;
            }
        });
    }

    return {
      ...quote,
      proposals: quote.proposals.map(p => ({
        ...p,
        isBestOption: p.id === bestProposalId,
      })),
    };
  }, [selectedQuoteId, quotes]);

  // --- LÓGICA DE PEDIDOS ---
  useEffect(() => {
    const savedOrders = localStorage.getItem('zanvexis_orders');
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed)) {
          setOrders(parsed);
        }
      } catch (error) {
        console.error("Failed to parse orders from localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('zanvexis_orders', JSON.stringify(orders));
  }, [orders]);

  const handleNewOrderItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    const updatedItems = [...newOrder.items];
    const item = { ...updatedItems[index], [field]: value };
    updatedItems[index] = item;
    setNewOrder(prev => ({ ...prev, items: updatedItems }));
  };

  const handleAddNewItem = () => {
    setNewOrder(prev => ({
      ...prev,
      items: [...prev.items, { id: new Date().toISOString(), productName: '', quantity: 1, unitPrice: 0 }],
    }));
  };

  const handleRemoveNewOrderItem = (index: number) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSaveOrder = () => {
    const supplier = suppliers.find(s => s.id === newOrder.supplierId);
    if (!supplier || !newOrder.orderDate || !newOrder.expectedDeliveryDate) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha Fornecedor, Data do Pedido e Previsão de Entrega.",
      });
      return;
    }
    const totalValue = newOrder.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0);

    const orderToSave: PurchaseOrder = {
      id: new Date().toISOString(),
      displayId: `#PEDIDO-${String(orders.length + 1).padStart(4, '0')}`,
      supplierId: supplier.id,
      supplierName: supplier.companyName,
      orderDate: newOrder.orderDate,
      expectedDeliveryDate: newOrder.expectedDeliveryDate,
      items: newOrder.items.filter(item => item.productName),
      totalValue,
      status: 'placed',
    };
    
    setOrders(prev => [orderToSave, ...prev]);
    setIsOrderModalOpen(false);
    setNewOrder(initialNewOrderState);
    toast({ title: "Pedido criado!", description: "Seu novo pedido foi adicionado ao Kanban." });
  };
  
  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm("Tem certeza que deseja deletar este pedido? Esta ação não pode ser desfeita.")) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
      toast({ title: "Pedido deletado.", variant: "destructive" });
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      return;
    }
  
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === draggableId
          ? { ...order, status: destination.droppableId as OrderStatus }
          : order
      )
    );
     toast({ title: "Status do pedido atualizado!" });
  };

  const newOrderTotal = useMemo(() => {
    return newOrder.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0);
  }, [newOrder.items]);

  const ordersByStatus = useMemo(() => {
    return KANBAN_COLUMNS.reduce((acc, column) => {
      acc[column.id] = orders.filter(o => o.status === column.id);
      return acc;
    }, {} as Record<OrderStatus, PurchaseOrder[]>);
  }, [orders]);


  return (
    <div className="bg-background min-h-screen text-foreground">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-mono tracking-tighter">
            Zanvexis Buyer Central
          </h1>
          <Link href="/guide" passHref>
             <Button variant="outline" asChild>
                <a><BookOpen className="mr-2"/> Ver Guia</a>
             </Button>
          </Link>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[600px] bg-card border">
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
                  <Card className="flex items-center justify-center h-full min-h-[400px] border-dashed">
                    <div className="text-center text-muted-foreground">
                      <p>Selecione um fornecedor na lista</p>
                      <p className="text-sm">ou crie um novo para começar.</p>
                    </div>
                  </Card>
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
                  <Card className="flex items-center justify-center h-full min-h-[400px] border-dashed">
                    <div className="text-center text-muted-foreground">
                      <p>Selecione uma cotação na lista</p>
                      <p className="text-sm">ou crie uma nova para comparar.</p>
                    </div>
                  </Card>
                )}
               </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-mono">Painel de Pedidos</h2>
              <Button size="lg" onClick={() => setIsOrderModalOpen(true)}>Criar Novo Pedido</Button>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {KANBAN_COLUMNS.map((column) => (
                  <Droppable key={column.id} droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`bg-card/50 rounded-lg p-4 transition-colors ${snapshot.isDraggingOver ? 'bg-accent/10' : ''}`}
                      >
                        <h3 className="text-lg font-semibold mb-4 text-center font-mono tracking-tight">{column.title} ({ordersByStatus[column.id].length})</h3>
                        <div className="space-y-4 min-h-[60vh]">
                           {ordersByStatus[column.id].map((order, index) => (
                             <Draggable key={order.id} draggableId={order.id} index={index}>
                               {(provided, snapshot) => (
                                 <OrderCard
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    order={order}
                                    isDragging={snapshot.isDragging}
                                    onDelete={() => handleDeleteOrder(order.id)}
                                 />
                               )}
                             </Draggable>
                           ))}
                           {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          </TabsContent>
        </Tabs>
      </main>

      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-card border-primary/50">
            <CardHeader><CardTitle className='font-mono'>Criar Novo Pedido de Compra</CardTitle></CardHeader>
            <CardContent className="flex-grow overflow-y-auto space-y-4 pr-6 pl-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                      <Label>Fornecedor *</Label>
                      <Select value={newOrder.supplierId} onValueChange={value => setNewOrder(p => ({ ...p, supplierId: value }))}>
                          <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                          <SelectContent>
                              {suppliers.map(s => (
                                <SelectItem key={s.id} value={s.id}>{s.companyName}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="orderDate">Data do Pedido *</Label>
                      <Input id="orderDate" type="date" value={newOrder.orderDate} onChange={e => setNewOrder(p => ({...p, orderDate: e.target.value}))}/>
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="expectedDeliveryDate">Previsão de Entrega *</Label>
                      <Input id="expectedDeliveryDate" type="date" value={newOrder.expectedDeliveryDate} onChange={e => setNewOrder(p => ({...p, expectedDeliveryDate: e.target.value}))}/>
                  </div>
                </div>
                
                <h3 className="font-semibold pt-4 border-t font-mono">Itens do Pedido</h3>
                <div className="space-y-3">
                  {newOrder.items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-[1fr,90px,130px,40px] gap-2 items-center">
                      <Input placeholder="Nome do Produto" value={item.productName} onChange={e => handleNewOrderItemChange(index, 'productName', e.target.value)} />
                      <Input type="number" placeholder="Qtd." value={item.quantity} onChange={e => handleNewOrderItemChange(index, 'quantity', Number(e.target.value))} min="1" />
                      <Input type="number" placeholder="Preço Unit. (R$)" value={item.unitPrice} onChange={e => handleNewOrderItemChange(index, 'unitPrice', Number(e.target.value))} min="0" step="0.01"/>
                      <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => handleRemoveNewOrderItem(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                   <Button variant="outline" size="sm" onClick={handleAddNewItem}>+ Adicionar Item</Button>
                </div>

                <div className="pt-4 border-t text-right">
                    <Label className="text-muted-foreground font-mono">VALOR TOTAL</Label>
                    <p className="text-3xl font-bold font-mono text-primary">
                      {newOrderTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                </div>

            </CardContent>
            <CardFooter className="justify-end space-x-2 border-t pt-4">
                <Button variant="ghost" onClick={() => setIsOrderModalOpen(false)}>Cancelar</Button>
                <Button onClick={handleSaveOrder}>Salvar Pedido</Button>
            </CardFooter>
          </Card>
        </div>
      )}

    </div>
  );
}
