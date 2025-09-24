'use client';

import { useState, useEffect } from 'react';
import type { Supplier } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface SupplierFormProps {
  supplier: Supplier;
  onSave: (formState: Partial<Supplier>) => void;
  onDelete: () => void;
}

export default function SupplierForm({ supplier, onSave, onDelete }: SupplierFormProps) {
  const [formData, setFormData] = useState(supplier);

  useEffect(() => {
    setFormData(supplier);
  }, [supplier]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev!, [id]: value }));
  };

  const handleSaveClick = () => {
    onSave(formData);
  };

  const handleDeleteClick = () => {
    if (window.confirm(`Tem certeza que deseja deletar o fornecedor "${supplier.companyName}"?`)) {
        onDelete();
    }
  }

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="font-mono text-2xl">Detalhes do Fornecedor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da Empresa</Label>
            <Input id="companyName" value={formData.companyName || ''} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactName">Nome do Contato</Label>
            <Input id="contactName" value={formData.contactName || ''} onChange={handleChange} />
          </div>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email || ''} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" type="tel" value={formData.phone || ''} onChange={handleChange} />
          </div>
        </div>
         <div className="space-y-2">
          <Label htmlFor="products">Produtos Fornecidos</Label>
          <Input id="products" value={formData.products || ''} onChange={handleChange} placeholder="Separe por vírgulas"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notas</Label>
          <Textarea id="notes" value={formData.notes || ''} onChange={handleChange} rows={4} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 mt-4">
        <Button variant="destructive" onClick={handleDeleteClick}>Deletar</Button>
        <Button onClick={handleSaveClick}>Salvar Alterações</Button>
      </CardFooter>
    </Card>
  );
}
