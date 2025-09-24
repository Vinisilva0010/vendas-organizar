
"use client";

import { useState, useEffect } from 'react';
import type { Supplier, Quote, QuoteProposal } from '@/lib/types';
import SupplierList from '@/components/supplier-list';
import SupplierForm from '@/components/supplier-form';
import QuoteList from '@/components/quote-list';
import QuoteComparison from '@/components/quote-comparison';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export default function Home() {
  // Supplier State
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [supplierFormState, setSupplierFormState] = useState<Partial<Supplier>>({});
  const [supplierSearchTerm, setSupplierSearchTerm] = useState('');

  // Quote State
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);


  // --- Supplier Logic ---
  // Load suppliers from localStorage
  useEffect(() => {
    try {
      const savedSuppliers = localStorage.getItem('zanvexis_suppliers');
      if (savedSuppliers) {
        const parsedSuppliers = JSON.parse(savedSuppliers);
        setSuppliers(parsedSuppliers);
        if (parsedSuppliers.length > 0 && !selectedSupplierId) {
          setSelectedSupplierId(parsedSuppliers[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to parse suppliers from localStorage", error);
    }
  }, []);

  // Save suppliers to localStorage
  useEffect(() => {
    // Check to prevent overwriting on initial empty state
    if (suppliers.length > 0 || localStorage.getItem('zanvexis_suppliers')) {
      localStorage.setItem('zanvexis_suppliers', JSON.stringify(suppliers));
    }
  }, [suppliers]);
  
  // Update form when a supplier is selected
  useEffect(() => {
    if (selectedSupplierId) {
      const selected = suppliers.find(s => s.id === selectedSupplierId);
      setSupplierFormState(selected || {});
    } else {
      setSupplierFormState({});
    }
  }, [selectedSupplierId, suppliers]);


  const handleSelectSupplier = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
  };
  
  const handleAddNewSupplier = () => {
    const newSupplier: Supplier = {
      id: Date.now().toString(),
      companyName: 'Novo Fornecedor',
      contactName: '',
      email: '',
      phone: '',
      products: '',
      notes: ''
    };
    setSuppliers(prev => [newSupplier, ...prev]);
    setSelectedSupplierId(newSupplier.id);
  };
  
  const handleSupplierFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setSupplierFormState(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSaveSupplier = () => {
    if (!selectedSupplierId) return;
    setSuppliers(prev => 
      prev.map(s => s.id === selectedSupplierId ? { ...s, ...supplierFormState } as Supplier : s)
    );
  };
  
  const handleDeleteSupplier = () => {
    if (!selectedSupplierId) return;
    const isConfirmed = window.confirm("Tem certeza que deseja deletar este fornecedor? Esta ação não pode ser desfeita.");
    if (isConfirmed) {
      const remainingSuppliers = suppliers.filter(s => s.id !== selectedSupplierId);
      setSuppliers(remainingSuppliers);
      setSelectedSupplierId(remainingSuppliers.length > 0 ? remainingSuppliers[0].id : null);
    }
  };
  
  const handleCancelSupplierChanges = () => {
    if(selectedSupplierId) {
        const selected = suppliers.find(s => s.id === selectedSupplierId);
        setSupplierFormState(selected || {});
    }
  };

  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId) ?? null;

  const filteredSuppliers = suppliers.filter(supplier =>
    (supplier.companyName?.toLowerCase() || '').includes(supplierSearchTerm.toLowerCase()) ||
    (supplier.contactName?.toLowerCase() || '').includes(supplierSearchTerm.toLowerCase())
  );
  
  // --- Quote Logic ---
  // Load quotes from localStorage
  useEffect(() => {
    try {
      const savedQuotes = localStorage.getItem('zanvexis_quotes');
      if (savedQuotes) {
        const parsedQuotes = JSON.parse(savedQuotes);
        setQuotes(parsedQuotes);
        if (parsedQuotes.length > 0 && !selectedQuoteId) {
          setSelectedQuoteId(parsedQuotes[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to parse quotes from localStorage", error);
    }
  }, []);

  // Save quotes to localStorage
  useEffect(() => {
    if (quotes.length > 0 || localStorage.getItem('zanvexis_quotes')) {
      localStorage.setItem('zanvexis_quotes', JSON.stringify(quotes));
    }
  }, [quotes]);

  const handleAddNewQuote = () => {
    const quoteName = prompt("Qual o nome do item para a nova cotação?");
    if (quoteName) {
      const newQuote: Quote = {
        id: Date.now().toString(),
        title: quoteName,
        proposals: []
      };
      setQuotes(prev => [newQuote, ...prev]);
      setSelectedQuoteId(newQuote.id);
    }
  };

  const calculateRealCost = (proposal: QuoteProposal) => {
    if (proposal.minPurchaseQuantity <= 0) return Infinity; // Avoid division by zero
    return proposal.pricePerUnit + (proposal.shippingCost / proposal.minPurchaseQuantity);
  };

  const getUpdatedQuotesWithBestOption = (currentQuotes: Quote[]) => {
    return currentQuotes.map(quote => {
      if (!quote.proposals || quote.proposals.length === 0) {
        return { ...quote, proposals: quote.proposals.map(p => ({...p, isBestOption: false})) };
      }

      let bestProposalId: string | null = null;
      let minCost = Infinity;

      quote.proposals.forEach(proposal => {
        const realCost = calculateRealCost(proposal);
        if (realCost < minCost) {
          minCost = realCost;
          bestProposalId = proposal.id;
        }
      });
      
      const updatedProposals = quote.proposals.map(p => ({
        ...p,
        isBestOption: p.id === bestProposalId
      }));

      return { ...quote, proposals: updatedProposals };
    });
  };

  useEffect(() => {
    setQuotes(prevQuotes => getUpdatedQuotesWithBestOption(prevQuotes));
  }, [quotes.length, selectedQuoteId]); // Re-calculate when quotes change

  const handleUpdateQuote = (updatedQuote: Quote) => {
      const updatedQuotes = quotes.map(q => q.id === updatedQuote.id ? updatedQuote : q);
      const quotesWithBestOption = getUpdatedQuotesWithBestOption(updatedQuotes);
      setQuotes(quotesWithBestOption);
  }

  const selectedQuote = quotes.find(q => q.id === selectedQuoteId) ?? null;

  return (
    <div className="bg-background min-h-screen text-foreground">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">
          Central de Compras Inteligente
        </h1>
        
        <Tabs defaultValue="suppliers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="suppliers">Fornecedores</TabsTrigger>
            <TabsTrigger value="quotes">Cotações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="suppliers" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <SupplierList 
                  suppliers={filteredSuppliers}
                  selectedSupplierId={selectedSupplierId}
                  onSelectSupplier={handleSelectSupplier}
                  onAddNew={handleAddNewSupplier}
                  searchTerm={supplierSearchTerm}
                  setSearchTerm={setSupplierSearchTerm}
                />
              </div>
              <div className="lg:col-span-2">
                <SupplierForm 
                  supplier={selectedSupplier} 
                  formState={supplierFormState}
                  onFormChange={handleSupplierFormChange}
                  onSave={handleSaveSupplier}
                  onDelete={handleDeleteSupplier}
                  onCancel={handleCancelSupplierChanges}
                />
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
                />
              </div>
              <div className="lg:col-span-2">
                <QuoteComparison 
                  quote={selectedQuote}
                  suppliers={suppliers}
                  onUpdateQuote={handleUpdateQuote}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
