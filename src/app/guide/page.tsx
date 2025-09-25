'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, FileText, Truck } from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="bg-background min-h-screen text-foreground">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-mono tracking-tighter text-primary">
                Guia Rápido
            </h1>
             <Link href="/" passHref>
                <Button variant="outline">
                    <ArrowLeft className="mr-2" /> Voltar para a Aplicação
                </Button>
            </Link>
        </div>
        
        <p className="text-lg text-muted-foreground mb-10 max-w-3xl">
            Bem-vindo à Zanvexis Buyer Central! Este guia foi feito para te ajudar a dominar todas as funcionalidades da ferramenta e otimizar seu processo de compras.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <Card className="bg-card/50 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-mono text-xl">
                <div className="bg-primary/10 p-2 rounded-lg">
                    <Users className="text-primary"/>
                </div>
                Módulo 1: Fornecedores
              </CardTitle>
            </CardHeader>
            <CardContent>
               <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Como adicionar um novo fornecedor?</AccordionTrigger>
                    <AccordionContent>
                    Na aba "Fornecedores", clique no botão "+ Novo Fornecedor". Um novo card aparecerá na lista e o formulário à direita será habilitado para você preencher os dados. Não se esqueça de salvar!
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Como editar ou deletar?</AccordionTrigger>
                    <AccordionContent>
                    Simplesmente clique no fornecedor que deseja editar na lista da esquerda. Os detalhes aparecerão no formulário para edição. Para deletar, use o botão "Deletar" no rodapé do formulário.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Como encontrar um fornecedor?</AccordionTrigger>
                    <AccordionContent>
                    Use a barra de busca acima da lista. Você pode buscar tanto pelo nome da empresa quanto pelo nome do contato para encontrar rapidamente o que precisa.
                    </AccordionContent>
                </AccordionItem>
                </Accordion>
            </CardContent>
          </Card>

           <Card className="bg-card/50 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-mono text-xl">
                <div className="bg-accent/10 p-2 rounded-lg">
                    <FileText className="text-accent"/>
                </div>
                Módulo 2: Cotações
              </CardTitle>
            </CardHeader>
            <CardContent>
               <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Como iniciar uma cotação?</AccordionTrigger>
                    <AccordionContent>
                    Vá para a aba "Cotações" e clique em "Criar Nova Cotação". Dê um nome para o item que você está cotando (ex: "Monitores 24 polegadas"). A nova cotação aparecerá na lista.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Como adicionar propostas?</AccordionTrigger>
                    <AccordionContent>
                    Com a cotação selecionada, clique em "Adicionar Proposta". Um modal abrirá para você selecionar um de seus fornecedores já cadastrados e preencher os detalhes da oferta dele (preço, frete, etc).
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Como funciona a "Melhor Opção"?</AccordionTrigger>
                    <AccordionContent>
                    A ferramenta calcula automaticamente o "Custo Real por Unidade" (Preço + Frete/QMP). A proposta com o menor custo real é destacada com um selo e uma cor diferente, te ajudando a decidir rapidamente.
                    </AccordionContent>
                </AccordionItem>
                </Accordion>
            </CardContent>
          </Card>

           <Card className="bg-card/50 border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-mono text-xl">
                <div className="bg-secondary/10 p-2 rounded-lg">
                    <Truck className="text-secondary-foreground"/>
                </div>
                Módulo 3: Pedidos
              </CardTitle>
            </CardHeader>
            <CardContent>
               <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Como criar um pedido?</AccordionTrigger>
                    <AccordionContent>
                    Na aba "Pedidos de Compra", clique em "Criar Novo Pedido". Preencha o modal com o fornecedor, datas e os itens do pedido. Ao salvar, o pedido aparecerá na coluna "Pedidos Realizados".
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Como atualizar o status?</AccordionTrigger>
                    <AccordionContent>
                    É aqui que a mágica acontece! Simplesmente clique, segure e arraste o card do pedido de uma coluna para a outra (ex: de "Realizados" para "Aguardando Envio"). A mudança é salva automaticamente.
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-3">
                    <AccordionTrigger>Posso deletar um pedido?</AccordionTrigger>
                    <AccordionContent>
                    Sim. Passe o mouse sobre o card do pedido e um ícone de lixeira aparecerá. Clique nele para deletar o pedido. Esta ação é permanente.
                    </AccordionContent>
                </AccordionItem>
                </Accordion>
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
}
