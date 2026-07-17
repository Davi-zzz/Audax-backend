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
      "Este documento detalha as principais decisões arquiteturais, tecnologias adotadas, desafios encontrados durante o desenvolvimento e as estratégias utilizadas para garantir uma aplicação organizada, de fácil manutenção e simples de executar em qualquer ambiente.",
  },

  sections: [
    {
      id: "architecture",
      title: "🏗️ Arquitetura e Decisões de Design",
      description:
        "O projeto foi estruturado buscando reproduzir práticas utilizadas em aplicações reais, priorizando organização do código, reprodutibilidade do ambiente e facilidade de manutenção.",

      items: [
        {
          title: "Organização Modular",
          text:
            "A aplicação foi organizada de forma modular, separando responsabilidades entre componentes, tipos, dados iniciais e regras de negócio. Arquivos como `src/types.ts` concentram as definições de tipos, enquanto `src/initialData.ts` centraliza dados estáticos utilizados pela aplicação. Essa divisão reduz o acoplamento entre funcionalidades, melhora a legibilidade e facilita futuras expansões do projeto.",
        },

        {
          title: "Desenvolvimento Assistido por IA",
          text:
            "O Google AI Studio foi utilizado como ferramenta de apoio durante o desenvolvimento do frontend, acelerando a criação inicial da interface e de alguns componentes visuais. Apesar desse auxílio, toda a arquitetura da aplicação, organização dos componentes, modelagem dos dados, integrações, regras de negócio e refinamentos finais foram implementados manualmente, utilizando a IA apenas como acelerador de produtividade.",
        },

        {
          title: "Ambiente Totalmente Containerizado",
          text:
            "Todo o projeto foi desenvolvido para ser executado através de Docker. Essa decisão elimina diferenças entre ambientes de desenvolvimento, garante que todos utilizem exatamente as mesmas versões das dependências e simplifica a execução do projeto, permitindo inicializar toda a aplicação com poucos comandos, independentemente do sistema operacional.",
        },

        {
          title: "Maior Desafio Técnico",
          text:
            "O maior desafio durante o desenvolvimento não foi a implementação das funcionalidades, mas sim o alinhamento da infraestrutura entre frontend e backend. Foi necessário configurar corretamente Docker, PNPM, compartilhamento de dependências, comunicação entre containers, variáveis de ambiente e scripts de execução para que todo o ecossistema funcionasse de forma consistente.",
        },
      ],
    },

    {
      id: "state",
      title: "⚡ Gerenciamento de Estado e Persistência",
      description:
        "Como se trata de um teste focado na experiência do usuário e na camada cliente, as escolhas priorizaram simplicidade, previsibilidade e persistência sem depender de infraestrutura adicional.",

      items: [
        {
          title: "Persistência utilizando LocalStorage",
          text:
            "Os produtos cadastrados são armazenados no `localStorage`, permitindo que todas as alterações permaneçam disponíveis mesmo após recarregar a página. Essa abordagem simula uma persistência simples sem exigir banco de dados para execução do projeto.",
        },

        {
          title: "Fluxo de Dados Unidirecional",
          text:
            "As operações de criação, edição, remoção e pesquisa permanecem centralizadas no componente principal, enquanto os componentes filhos recebem apenas as propriedades necessárias e callbacks tipados, mantendo previsibilidade e reduzindo efeitos colaterais.",
        },

        {
          title: "Estados Inteligentes de Edição",
          text:
            "Ao selecionar um produto, o formulário alterna automaticamente para modo de edição, preenchendo todos os campos, preservando as validações existentes e adaptando dinamicamente a interface para refletir o contexto da operação.",
        },
      ],
    },

    {
      id: "validation",
      title: "🔍 Validação em Tempo Real",
      description:
        "A validação foi implementada para fornecer feedback imediato ao usuário, reduzindo erros antes mesmo do envio do formulário.",

      items: [
        {
          title: "Validação Dinâmica",
          text:
            "Todas as regras são executadas durante a digitação (onChange) e ao perder o foco do campo (onBlur), permitindo identificar inconsistências imediatamente. Enquanto existir qualquer erro de validação, o envio do formulário permanece bloqueado.",
        },

        {
          title: "Regras Implementadas",
          text:
            "• SKU: formato alfanumérico com hífen (ex.: TEC-102), mínimo de quatro caracteres e unicidade entre produtos.\n\n• Nome: mínimo de três caracteres e máximo de cinquenta.\n\n• Descrição: mínimo de dez caracteres.\n\n• Estoque: apenas números inteiros maiores ou iguais a zero.",
        },

        {
          title: "Feedback Visual",
          text:
            "Campos inválidos recebem destaque visual através de alteração de cores, mensagens explicativas e ícones de confirmação ou alerta, permitindo que o usuário compreenda rapidamente como corrigir cada informação.",
        },
      ],
    },

    {
      id: "ux_ui",
      title: "✨ Tecnologias e Bibliotecas Utilizadas",
      description:
        "A stack foi escolhida considerando desempenho, produtividade, familiaridade com as ferramentas e facilidade de manutenção do projeto.",

      items: [
        {
          title: "React 19 + TypeScript",
          text:
            "O frontend foi desenvolvido utilizando React 19 juntamente com TypeScript para aproveitar um ecossistema consolidado aliado à segurança da tipagem estática. Essa combinação reduz erros durante o desenvolvimento, melhora a experiência com autocompletar e facilita a manutenção conforme a aplicação cresce.",
        },

        {
          title: "Docker",
          text:
            "Toda a aplicação é executada em containers Docker. Essa abordagem garante um ambiente consistente entre diferentes máquinas, elimina problemas relacionados à instalação manual de dependências e aproxima o fluxo de desenvolvimento de um ambiente de produção.",
        },

        {
          title: "PNPM",
          text:
            "O PNPM foi escolhido como gerenciador de pacotes devido à sua velocidade de instalação, menor consumo de espaço em disco e gerenciamento mais rigoroso das dependências. Soluções como Nx ou Turborepo foram consideradas, porém adicionariam uma camada de complexidade voltada principalmente para monorepositórios maiores, enquanto o PNPM oferece uma solução mais simples e adequada ao porte deste projeto.",
        },

        {
          title: "Jest",
          text:
            "Os testes automatizados utilizam Jest. Apesar da existência de alternativas como o Vitest, a escolha foi motivada principalmente pela familiaridade adquirida utilizando NestJS, que possui integração nativa com essa ferramenta. Isso reduz o tempo de configuração e permite maior foco na implementação dos testes propriamente ditos.",
        },

        {
          title: "Tailwind CSS v4",
          text:
            "Responsável pela construção da interface através de classes utilitárias, permitindo desenvolvimento rápido, consistência visual, fácil manutenção e excelente desempenho sem necessidade de grandes folhas de estilo customizadas.",
        },

        {
          title: "Motion",
          text:
            "Utilizado para implementar microinterações e animações suaves durante a navegação, tornando a experiência do usuário mais fluida sem impactar significativamente o desempenho da aplicação.",
        },

        {
          title: "Lucide React",
          text:
            "Biblioteca de ícones SVG utilizada para manter uma identidade visual consistente em toda a aplicação, oferecendo componentes leves, modernos e facilmente customizáveis.",
        },
      ],
    },
  ],
};
