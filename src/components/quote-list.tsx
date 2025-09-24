'use client';

import type { Quote } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuoteListProps {
  quotes: Quote[];
  selectedQuoteId: string | null;
  onSelectQuote: (id: string) => void;
  onAddNew: () => void;
  onDeleteQuote: (id: string) => void;
}

export default function QuoteList({
  quotes,
  selectedQuoteId,
  onSelectQuote,
  onAddNew,
  onDeleteQuote,
}: QuoteListProps) {
  return (
    <Card className="h-full bg-card/50">
      <CardContent className="p-4 flex flex-col h-full">
        <Button className="w-full" onClick={onAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Nova Cotação
        </Button>
        <ScrollArea className="flex-grow mt-4 h-[calc(100vh-250px)] lg:h-auto lg:max-h-[calc(100vh-220px)]">
           <div className="space-y-2 pr-2">
            {quotes.length > 0 ? quotes.map((quote) => (
              <div
                key={quote.id}
                onClick={() => onSelectQuote(quote.id)}
                className={`p-3 rounded-md cursor-pointer border flex justify-between items-center transition-colors group ${
                  selectedQuoteId === quote.id
                    ? 'bg-primary text-primary-foreground border-primary/50'
                    : 'hover:bg-muted/50'
                }`}
              >
                <span className="font-medium flex-grow truncate pr-2">{quote.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 shrink-0 ${selectedQuoteId === quote.id ? 'text-primary-foreground/70 hover:text-destructive hover:bg-destructive/20' : 'text-muted-foreground hover:text-destructive'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Tem certeza que deseja deletar a cotação "${quote.name}"?`)) {
                      onDeleteQuote(quote.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )) : (
              <div className="text-center text-muted-foreground pt-10">
                Nenhuma cotação criada.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
