
"use client";

import type { Supplier } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Trash2, X } from 'lucide-react';

interface SupplierFormProps {
  supplier: Supplier | null;
  formState: Partial<Supplier>;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

export default function SupplierForm({ supplier, formState, onFormChange, onSave, onDelete, onCancel }: SupplierFormProps) {
  if (!supplier) {
      return (
         <Card className="h-full flex flex-col items-center justify-center">
            <CardContent>
                <p className="text-muted-foreground">Selecione um fornecedor para ver os detalhes ou crie um novo.</p>
            </CardContent>
        </Card>
      );
  }

  const formKey = supplier ? supplier.id : 'new';
  
  return (
    <Card key={formKey} className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Detalhes do Fornecedor
        </CardTitle>
        <CardDescription>
          {`Editando informações de ${formState.companyName || ''}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da Empresa</Label>
            <Input id="companyName" type="text" value={formState.companyName || ''} onChange={onFormChange} placeholder="Ex: Acme Inc." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactName">Nome do Contato</Label>
            <Input id="contactName" type="text" value={formState.contactName || ''} onChange={onFormChange} placeholder="Ex: João da Silva" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formState.email || ''} onChange={onFormChange} placeholder="contato@empresa.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" type="tel" value={formState.phone || ''} onChange={onFormChange} placeholder="(00) 12345-6789" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="products">Produtos Fornecidos</Label>
          <Input id="products" type="text" value={formState.products || ''} onChange={onFormChange} placeholder="Separe os produtos por vírgula" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notas Importantes</Label>
          <Textarea id="notes" value={formState.notes || ''} onChange={onFormChange} rows={4} placeholder="Detalhes de negociação, prazos, etc." />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-3 border-t pt-6 mt-4">
        <Button variant="destructive" className="mr-auto" onClick={onDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Deletar
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={onSave}>
          <Save className="mr-2 h-4 w-4" />
          Salvar
        </Button>
      </CardFooter>
    </Card>
  );
}

    