"use client";

import type { PurchaseOrder } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OrderCardProps {
  order: PurchaseOrder;
  // onClick?: () => void;
}

export default function OrderCard({ order }: OrderCardProps) {
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
            Data: {format(new Date(order.orderDate), "dd/MM/yyyy", { locale: ptBR })}
        </p>
         <p className="text-base font-bold text-foreground">
            {order.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
      </CardContent>
    </Card>
  );
}
