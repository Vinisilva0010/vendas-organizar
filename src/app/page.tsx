"use client";

import { useState, useEffect } from 'react';
import type { Supplier } from '@/lib/types';
import SupplierList from '@/components/supplier-list';
import SupplierForm from '@/components/supplier-form';

export default function Home() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [formState, setFormState] = useState<Partial<Supplier>>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Load suppliers from localStorage on initial render
  useEffect(() => {
    try {
      const savedSuppliers = localStorage.getItem('zanvexis_suppliers');
      if (savedSuppliers) {
        const parsedSuppliers = JSON.parse(savedSuppliers);
        setSuppliers(parsedSuppliers);
        // If there are suppliers, select the first one by default
        if (parsedSuppliers.length > 0 && !selectedSupplierId) {
          setSelectedSupplierId(parsedSuppliers[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to parse suppliers from localStorage", error);
    }
  }, []);

  // Save suppliers to localStorage whenever the list changes
  useEffect(() => {
    localStorage.setItem('zanvexis_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);
  
  // Update form state when a supplier is selected
  useEffect(() => {
    if (selectedSupplierId) {
      const selected = suppliers.find(s => s.id === selectedSupplierId);
      setFormState(selected || {});
    } else {
      // Clear form when no supplier is selected (i.e., adding a new one)
      setFormState({});
    }
  }, [selectedSupplierId, suppliers]);


  const handleSelectSupplier = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
  };
  
  const handleAddNew = () => {
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
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSaveSupplier = () => {
    if (!selectedSupplierId) return;
    setSuppliers(prev => 
      prev.map(s => s.id === selectedSupplierId ? { ...s, ...formState } as Supplier : s)
    );
    // Optionally, add a toast notification for success
  };
  
  const handleDeleteSupplier = () => {
    if (!selectedSupplierId) return;
    setSuppliers(prev => prev.filter(s => s.id !== selectedSupplierId));
    // Select the first supplier in the list, or null if the list is empty
    const remainingSuppliers = suppliers.filter(s => s.id !== selectedSupplierId);
    setSelectedSupplierId(remainingSuppliers.length > 0 ? remainingSuppliers[0].id : null);
  };
  
  const handleCancel = () => {
    // Re-fetch the original data for the selected supplier to discard changes
    if(selectedSupplierId) {
        const selected = suppliers.find(s => s.id === selectedSupplierId);
        setFormState(selected || {});
    }
  };

  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId) ?? null;

  const filteredSuppliers = suppliers.filter(supplier =>
    (supplier.companyName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (supplier.contactName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-background min-h-screen text-foreground">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">
          Central de Compras Inteligente
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <SupplierList 
              suppliers={filteredSuppliers}
              selectedSupplierId={selectedSupplierId}
              onSelectSupplier={handleSelectSupplier}
              onAddNew={handleAddNew}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
          <div className="lg:col-span-2">
            <SupplierForm 
              supplier={selectedSupplier} 
              formState={formState}
              onFormChange={handleFormChange}
              onSave={handleSaveSupplier}
              onDelete={handleDeleteSupplier}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
