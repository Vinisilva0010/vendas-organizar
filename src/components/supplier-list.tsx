"use client";

import type { Supplier } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import SupplierCard from './supplier-card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SupplierListProps {
  suppliers: Supplier[];
  selectedSupplierId: string | null;
  onSelectSupplier: (id: string) => void;
  onAddNew: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function SupplierList({ suppliers, selectedSupplierId, onSelectSupplier, onAddNew, searchTerm, setSearchTerm }: SupplierListProps) {
  return (
    <aside className="flex flex-col gap-4 h-full">
      <Button onClick={onAddNew} size="lg" className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Novo Fornecedor
      </Button>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          type="search"
          placeholder="Buscar fornecedor..."
          className="pl-10 h-11"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ScrollArea className="flex-grow border rounded-lg h-[calc(100vh-250px)] lg:h-auto lg:max-h-[calc(100vh-220px)]">
        <div className="p-2 sm:p-4 flex flex-col gap-3">
          {suppliers.map(supplier => (
            <SupplierCard 
              key={supplier.id}
              supplier={supplier}
              isSelected={selectedSupplierId === supplier.id}
              onSelect={() => onSelectSupplier(supplier.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
