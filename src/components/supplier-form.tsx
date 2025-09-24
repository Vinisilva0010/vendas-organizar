"use client";

import type { Supplier } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Trash2 } from 'lucide-react';

interface SupplierFormProps {
  supplier: Supplier | null;
}

export default function SupplierForm({ supplier }: SupplierFormProps) {
  // Use a key to force re-render when supplier changes, clearing the form's uncontrolled inputs
  const formKey = supplier ? supplier.id : 'new';
  
  return (
    <Card key={formKey} className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Detalhes do Fornecedor
        </CardTitle>
        <CardDescription>
          {supplier ? `Editando informações de ${supplier.companyName}` : 'Preencha os campos para adicionar um novo fornecedor.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da Empresa</Label>
            <Input id="companyName" type="text" defaultValue={supplier?.companyName || ''} placeholder="Ex: Acme Inc." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactName">Nome do Contato</Label>
            <Input id="contactName" type="text" defaultValue={supplier?.contactName || ''} placeholder="Ex: João da Silva" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={supplier?.email || ''} placeholder="contato@empresa.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" type="tel" defaultValue={supplier?.phone || ''} placeholder="(00) 12345-6789" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="products">Produtos Fornecidos</Label>
          <Input id="products" type="text" defaultValue={supplier?.products || ''} placeholder="Separe os produtos por vírgula" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notas Importantes</Label>
          <Textarea id="notes" defaultValue={supplier?.notes || ''} rows={4} placeholder="Detalhes de negociação, prazos, etc." />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-3 border-t pt-6 mt-4">
        {supplier && (
          <Button variant="destructive" className="mr-auto">
            <Trash2 className="mr-2 h-4 w-4" />
            Deletar
          </Button>
        )}
        <Button variant="outline">Cancelar</Button>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Save className="mr-2 h-4 w-4" />
          Salvar
        </Button>
      </CardFooter>
    </Card>
  );
}
