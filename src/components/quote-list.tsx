
"use client";

import type { Quote } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QuoteListProps {
  quotes: Quote[];
  selectedQuoteId: string | null;
  onSelectQuote: (id: string) => void;
  onAddNew: () => void;
}

function QuoteCard({ quote, isSelected, onSelect }: { quote: Quote, isSelected: boolean, onSelect: () => void }) {
  return (
    <Card
      onClick={onSelect}
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50",
        isSelected ? "border-accent ring-1 ring-accent/80 shadow-accent/10 shadow-lg" : "border-card"
      )}
    >
      <CardHeader className="p-4">
        <CardTitle className="text-base font-semibold">{quote.title}</CardTitle>
      </CardHeader>
    </Card>
  )
}

export default function QuoteList({ quotes, selectedQuoteId, onSelectQuote, onAddNew }: QuoteListProps) {
  return (
    <aside className="flex flex-col gap-4 h-full">
      <Button onClick={onAddNew} size="lg" className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Criar Nova Cotação
      </Button>
      
      <ScrollArea className="flex-grow border rounded-lg h-[calc(100vh-250px)] lg:h-auto lg:max-h-[calc(100vh-220px)]">
        <div className="p-2 sm:p-4 flex flex-col gap-3">
          {quotes.map(quote => (
            <QuoteCard 
              key={quote.id}
              quote={quote}
              isSelected={selectedQuoteId === quote.id}
              onSelect={() => onSelectQuote(quote.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
