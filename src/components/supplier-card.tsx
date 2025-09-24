"use client";

import type { Supplier } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SupplierCardProps {
  supplier: Supplier;
  isSelected: boolean;
  onSelect: () => void;
}

export default function SupplierCard({ supplier, isSelected, onSelect }: SupplierCardProps) {
  return (
    <Card 
      onClick={onSelect}
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50",
        isSelected ? "border-accent ring-1 ring-accent/80 shadow-accent/10 shadow-lg" : "border-card"
      )}
    >
      <CardHeader className="p-4">
        <CardTitle className="text-base font-semibold">{supplier.companyName}</CardTitle>
        <CardDescription className="text-sm">{supplier.contactName}</CardDescription>
      </CardHeader>
    </Card>
  );
}
