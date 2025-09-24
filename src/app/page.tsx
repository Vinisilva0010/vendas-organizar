"use client";

import { useState } from 'react';
import type { Supplier } from '@/lib/types';
import SupplierList from '@/components/supplier-list';
import SupplierForm from '@/components/supplier-form';

// Static data for suppliers as requested
const initialSuppliers: Supplier[] = [
  {
    id: 1,
    companyName: 'TechNova Solutions',
    contactName: 'Alice Johnson',
    email: 'alice.j@technova.com',
    phone: '(11) 98765-4321',
    products: 'Placas de Circuito, Microchips, Sensores',
    notes: 'Fornecedor principal para componentes eletrônicos. Pagamento em 30 dias.'
  },
  {
    id: 2,
    companyName: 'MetalWorks Inc.',
    contactName: 'Bob Williams',
    email: 'bob.w@metalworks.com',
    phone: '(21) 91234-5678',
    products: 'Gabinetes de Metal, Peças usinadas',
    notes: 'Ótima qualidade, mas os prazos de entrega podem ser longos.'
  },
  {
    id: 3,
    companyName: 'PlasticCorp',
    contactName: 'Charlie Brown',
    email: 'charlie.b@plasticcorp.com',
    phone: '(31) 95555-4444',
    products: 'Componentes Plásticos, Impressão 3D',
    notes: 'Bom para prototipagem rápida.'
  }
];

export default function Home() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(initialSuppliers[1]); // Pre-select one as requested

  const handleSelectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
  };
  
  const handleAddNew = () => {
    setSelectedSupplier(null);
  };

  return (
    <div className="bg-background min-h-screen text-foreground">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">
          Central de Compras Inteligente
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <SupplierList 
              suppliers={suppliers}
              selectedSupplier={selectedSupplier}
              onSelectSupplier={handleSelectSupplier}
              onAddNew={handleAddNew}
            />
          </div>
          <div className="lg:col-span-2">
            <SupplierForm supplier={selectedSupplier} />
          </div>
        </div>
      </main>
    </div>
  );
}
