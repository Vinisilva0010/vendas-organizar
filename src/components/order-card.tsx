"use client";

import React from 'react';
import type { PurchaseOrder } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OrderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  order: PurchaseOrder;
  isDragging?: boolean;
}

const OrderCard = React.forwardRef<HTMLDivElement, OrderCardProps>(
  ({ order, isDragging, ...props }, ref) => {
    // Adiciona a correção de fuso horário para garantir que a data não mude
    const orderDate = new Date(order.orderDate);
    const correctedOrderDate = new Date(orderDate.valueOf() + orderDate.getTimezoneOffset() * 60 * 1000);

    return (
      <div ref={ref} {...props}>
        <Card 
          className={cn(
            "cursor-grab transition-all duration-200 hover:shadow-md hover:border-primary/50 bg-card",
            isDragging && "ring-2 ring-accent shadow-xl rotate-3"
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
      </div>
    );
  }
);

OrderCard.displayName = "OrderCard";

export default OrderCard;
