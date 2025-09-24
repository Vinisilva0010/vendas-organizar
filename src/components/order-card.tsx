"use client";

import React from 'react';
import type { PurchaseOrder } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OrderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  order: PurchaseOrder;
  isDragging?: boolean;
  onDelete: () => void;
}

const OrderCard = React.forwardRef<HTMLDivElement, OrderCardProps>(
  ({ order, isDragging, onDelete, ...props }, ref) => {
    const orderDate = new Date(order.orderDate);
    const correctedOrderDate = new Date(orderDate.valueOf() + orderDate.getTimezoneOffset() * 60 * 1000);

    return (
      <div ref={ref} {...props}>
        <Card 
          className={cn(
            "cursor-grab transition-all duration-200 hover:shadow-lg hover:border-primary/50 bg-card group border",
            isDragging && "ring-2 ring-primary shadow-2xl rotate-3"
          )}
        >
          <CardHeader className="p-3 pb-2 relative">
            <CardTitle className="text-base font-semibold truncate pr-8">{order.supplierName}</CardTitle>
            <CardDescription className="text-xs font-mono">{order.displayId}</CardDescription>
             <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-3 pt-0 text-xs text-muted-foreground space-y-1">
            <p>
                Data: {format(correctedOrderDate, "dd/MM/yy", { locale: ptBR })}
            </p>
            <p className="text-lg font-bold text-foreground font-mono">
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
