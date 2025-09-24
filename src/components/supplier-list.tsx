"use client";

import type { Supplier } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';


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
      <Button onClick={onAddNew} size="lg" className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Novo Fornecedor
      </Button>
      <ScrollArea className="flex-grow border rounded-lg h-[calc(100vh-250px)] lg:h-auto lg:max-h-[calc(100vh-220px)] bg-card/50">
        <div className="p-2 sm:p-2 flex flex-col gap-2">
          {suppliers.length > 0 ? suppliers.map(supplier => (
             <Card 
              key={supplier.id}
              onClick={() => onSelectSupplier(supplier.id)}
              className={cn(
                "cursor-pointer transition-colors duration-200 hover:bg-muted/50",
                selectedSupplierId === supplier.id ? "bg-primary text-primary-foreground border-primary/50" : "border-transparent"
              )}
            >
              <CardHeader className="p-3">
                <CardTitle className="text-base font-semibold">{supplier.companyName}</CardTitle>
                <CardDescription className={cn("text-sm", selectedSupplierId === supplier.id && "text-primary-foreground/70")}>{supplier.contactName}</CardDescription>
              </CardHeader>
            </Card>
          )) : (
             <div className="text-center text-muted-foreground pt-10">
                Nenhum fornecedor cadastrado.
              </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
