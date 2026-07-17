import React from 'react';
import '../index.css';

export const metadata = {
  title: 'Cadastro de Produtos',
  description: 'Sistema de cadastro de produtos com SKU, nome, descrição, estoque, imagem, validação em tempo real e documentação de teste técnico integrada.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
