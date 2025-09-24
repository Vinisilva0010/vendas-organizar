"use client";

import type { PurchaseOrder } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OrderCardProps {
  order: PurchaseOrder;
}

export default function OrderCard({ order }: OrderCardProps) {
  const orderDate = new Date(order.orderDate);
  // Adiciona a correção de fuso horário para garantir que a data não mude
  const correctedOrderDate = new Date(orderDate.valueOf() + orderDate.getTimezoneOffset() * 60 * 1000);

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 bg-card"
      )}
    >
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-sm font-semibold truncate">{order.supplierName}</CardTitle>
        <CardDescription className="text-xs">{order.displayId}</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0 text-xs text-muted-foreground space-y-1">
         <p>
            Data: {format(correctedOrderDate, "dd/MM/yyyy", { locale: ptBR })}
        </p>
         <p className="text-base font-bold text-foreground">
            {order.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
      </CardContent>
    </Card>
  );
}
