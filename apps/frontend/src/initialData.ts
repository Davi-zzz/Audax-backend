import { Product } from "./types";

// Self-contained elegant SVG Data URLs for mock product images
export const IMAGE_PRESETS = [
  {
    id: "preset-keyboard",
    name: "Teclado Mecânico RGB",
    color: "from-violet-500 to-indigo-600",
    svgUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%238B5CF6;stop-opacity:1" /><stop offset="100%" style="stop-color:%234F46E5;stop-opacity:1" /></linearGradient></defs><rect width="100" height="100" fill="url(%23grad1)"/><rect x="15" y="30" width="70" height="40" rx="4" fill="%23FFFFFF" fill-opacity="0.15" stroke="%23FFFFFF" stroke-width="2"/><line x1="20" y1="40" x2="80" y2="40" stroke="%23FFFFFF" stroke-width="2" stroke-dasharray="2 3"/><line x1="20" y1="50" x2="80" y2="50" stroke="%23FFFFFF" stroke-width="2" stroke-dasharray="2 3"/><line x1="20" y1="60" x2="80" y2="60" stroke="%23FFFFFF" stroke-width="2" stroke-dasharray="4 2"/><circle cx="50" cy="50" r="10" fill="%23FFFFFF" fill-opacity="0.2"/></svg>',
  },
  {
    id: "preset-mouse",
    name: "Mouse Gamer Premium",
    color: "from-cyan-500 to-blue-600",
    svgUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><defs><linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%2306B6D4;stop-opacity:1" /><stop offset="100%" style="stop-color:%232563EB;stop-opacity:1" /></linearGradient></defs><rect width="100" height="100" fill="url(%23grad2)"/><path d="M50,20 C40,20 35,35 35,55 C35,70 42,80 50,80 C58,80 65,70 65,55 C65,35 60,20 50,20 Z" fill="none" stroke="%23FFFFFF" stroke-width="3"/><path d="M50,20 L50,50" stroke="%23FFFFFF" stroke-width="2"/><line x1="35" y1="48" x2="65" y2="48" stroke="%23FFFFFF" stroke-width="2"/><circle cx="50" cy="35" r="4" fill="%23FFFFFF"/></svg>',
  },
  {
    id: "preset-monitor",
    name: 'Monitor UltraWide 34"',
    color: "from-amber-500 to-rose-600",
    svgUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><defs><linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23F59E0B;stop-opacity:1" /><stop offset="100%" style="stop-color:%23E11D48;stop-opacity:1" /></linearGradient></defs><rect width="100" height="100" fill="url(%23grad3)"/><rect x="10" y="25" width="80" height="40" rx="3" fill="none" stroke="%23FFFFFF" stroke-width="3"/><path d="M40,65 L60,65 L55,80 L45,80 Z" fill="%23FFFFFF" fill-opacity="0.8"/><line x1="45" y1="80" x2="55" y2="80" stroke="%23FFFFFF" stroke-width="2"/></svg>',
  },
  {
    id: "preset-headphone",
    name: "Headphone Noise Cancelling",
    color: "from-emerald-500 to-teal-600",
    svgUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><defs><linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%2310B981;stop-opacity:1" /><stop offset="100%" style="stop-color:%230D9488;stop-opacity:1" /></linearGradient></defs><rect width="100" height="100" fill="url(%23grad4)"/><path d="M25,55 C25,30 75,30 75,55" fill="none" stroke="%23FFFFFF" stroke-width="4" stroke-linecap="round"/><rect x="20" y="50" width="12" height="22" rx="4" fill="%23FFFFFF"/><rect x="68" y="50" width="12" height="22" rx="4" fill="%23FFFFFF"/><path d="M32,60 L68,60" stroke="%23FFFFFF" stroke-width="1" stroke-opacity="0.5"/></svg>',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    sku: "TEC-MECH-01",
    name: "Teclado Mecânico RGB",
    description:
      "Teclado mecânico com switches azuis táteis, iluminação RGB customizável e layout ABNT2.",
    stock: 45,
    image: IMAGE_PRESETS[0].svgUrl,
    createdAt: new Date(2026, 6, 10).toISOString(),
    price: 199.9,
  },
  {
    id: "prod-2",
    sku: "MOU-GAME-02",
    name: "Mouse Gamer Premium",
    description:
      "Mouse gamer ergonômico com sensor de 16.000 DPI, 8 botões programáveis e pesos ajustáveis.",
    stock: 120,
    image: IMAGE_PRESETS[1].svgUrl,
    createdAt: new Date(2026, 6, 12).toISOString(),
    price: 199.9,
  },
  {
    id: "prod-3",
    sku: "MON-CURV-03",
    name: 'Monitor UltraWide 34"',
    description:
      "Monitor curvo de 34 polegadas com taxa de atualização de 144Hz, HDR400 e painel IPS de alta fidelidade cromática.",
    stock: 12,
    image: IMAGE_PRESETS[2].svgUrl,
    createdAt: new Date(2026, 6, 14).toISOString(),
    price: 199.9,
  },
];

export interface DocSection {
  title: string;
  subtitle: string;
  content: string;
  bullets?: string[];
}

export const DOCUMENTATION_DATA = {
  header: {
    title: "Documentação do Teste Técnico",
    description:
      "Este documento detalha as decisões de design, escolhas arquiteturais, ferramentas utilizadas e estratégias de validação adotadas para o desenvolvimento deste projeto de cadastro de produtos.",
  },
  sections: [
    {
      id: "architecture",
      title: "🏗️ Arquitetura e Decisões de Design",
      description:
        "O projeto foi estruturado com base nas melhores práticas do React moderno utilizando TypeScript e Tailwind CSS para garantir máxima manutenibilidade, extensibilidade e desempenho.",
      items: [
        {
          title: "Organização Modular",
          text: "Separação lógica clara de responsabilidades: tipos de dados em arquivo próprio (`src/types.ts`), mock de dados iniciais e presets em (`src/initialData.ts`), e componentes ricos para formulários, listas e documentação extraídos individualmente de modo a evitar arquivos gigantescos (evitando gargalos de renderização e facilitando a legibilidade).",
        },
        {
          title: "Estética Visual Minimalista e Profissional",
          text: "Utilização de uma paleta de cores equilibrada baseada em tons de ardósia (Slate/Charcoal) e detalhes em azul índigo vibrante. Emprego de espaços negativos generosos, cantos arredondados sutis, tipografia limpa (Inter + Space Grotesk) e transições suaves alimentadas pela biblioteca `motion` para criar uma atmosfera de aplicação SaaS premium.",
        },
        {
          title: "Acessibilidade e Usabilidade de Teste",
          text: "Para facilitar a avaliação técnica sem exigir recursos externos pesados ou upload obrigatório de imagens locais, o sistema disponibiliza uma galeria de presets de imagens vetorizadas internas (SVG inline no formato Data URL). Adicionalmente, permite o upload convencional de arquivos de imagem locais.",
        },
      ],
    },
    {
      id: "state",
      title: "⚡ Gerenciamento de Estado e Persistência",
      description:
        "Como se trata de um teste de interface cliente-side responsivo, as escolhas de estado priorizaram a reatividade e a persistência sem infraestrutura complexa.",
      items: [
        {
          title: "Sincronização com LocalStorage",
          text: "Os produtos cadastrados e editados são persistidos em tempo de execução no `localStorage` do navegador. Isso garante que as ações de adição, exclusão e alteração sobrevivam a recarregamentos de página (F5), simulando o comportamento de um banco de dados real.",
        },
        {
          title: "Fluxo de Dados Unidirecional Claro",
          text: "O componente pai centraliza as operações de mutação (create, update, delete, search) e distribui as ações para os componentes filhos através de propriedades e callbacks bem tipados no TypeScript, mantendo a previsibilidade do estado.",
        },
        {
          title: "Estados Inteligentes de Edição",
          text: "O formulário de cadastro assume dinamicamente o modo de edição quando um produto da lista é selecionado, preenchendo todos os campos, habilitando validações correspondentes e alterando o rótulo do botão principal de forma fluida.",
        },
      ],
    },
    {
      id: "validation",
      title: "🔍 Validação em Tempo Real",
      description:
        "A validação em tempo real é um dos pilares de UX deste projeto, prevenindo erros de entrada antes mesmo que o usuário tente submeter o formulário.",
      items: [
        {
          title: "Validação Dinâmica por Campo (On-Change / On-Blur)",
          text: "As regras são avaliadas instantaneamente conforme o usuário digita. O sistema disponibiliza alertas táteis visuais em vermelho (erros) e verde (confirmações), além de desabilitar o botão de submissão caso haja qualquer inconsistência ativa.",
        },
        {
          title: "Regras de Validação Implementadas",
          text: "• SKU: Deve seguir o padrão alfanumérico com hifens (ex: TEC-102), ter no mínimo 4 caracteres, e ser globalmente único (caso o SKU já exista em outro produto, um aviso de duplicidade impede a submissão).\n• Nome do Produto: Requer no mínimo 3 caracteres para evitar nomes vagos, limitado a 50 caracteres.\n• Descrição: Mínimo de 10 caracteres para encorajar descrições ricas e informativas.\n• Estoque: Deve ser obrigatoriamente um número inteiro não negativo (maior ou igual a 0). Caracteres não numéricos ou decimais são rejeitados em tempo real.",
        },
        {
          title: "Feedback Tátil de Validação",
          text: "Elementos visuais interativos como ícones de checkmark (✓) e de alerta (⚠), textos de ajuda descritivos e bordas coloridas dinâmicas guiam o usuário intuitivamente pelo preenchimento perfeito.",
        },
      ],
    },
    {
      id: "ux_ui",
      title: "✨ Tecnologias e Bibliotecas Utilizadas",
      description:
        "As tecnologias foram selecionadas para fornecer uma experiência de desenvolvimento rápida e um produto final de alto desempenho.",
      items: [
        {
          title: "React 19 + TypeScript",
          text: "Uso da última versão do ecossistema React com tipagem estática rigorosa para garantir segurança e autocompletar no desenvolvimento de componentes baseados em funções e hooks hooks (useState, useEffect, useMemo).",
        },
        {
          title: "Tailwind CSS v4",
          text: "Desenvolvimento rápido de interface responsiva e utilitária, garantindo carregamento extremamente veloz e fidelidade milimétrica nos espaçamentos, sombras e transições.",
        },
        {
          title: "Motion (framer-motion)",
          text: "Utilizado para as micro-interações do painel, surgimento suave de cartões de produto, transição de abas (menu) e alertas de validação, conferindo fluidez de nível profissional à aplicação.",
        },
        {
          title: "Lucide React",
          text: "Uma biblioteca de ícones vetoriais modernos e consistentes que enriquecem a navbar, os campos de formulário e as listas de forma leve e esteticamente agradável.",
        },
      ],
    },
  ],
};
