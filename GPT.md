# BalletPro — briefing de identidade visual e imagens

## O que é o BalletPro

Um micro-SaaS de gestão para **studios de ballet, pequenas escolas de dança e professoras com várias turmas**. Não é um sistema genérico para academias — a especificidade é o ponto central da oferta. Quando a dona de um studio abre o sistema, ela precisa pensar "isso foi feito para o meu studio de ballet".

O sistema resolve um problema concreto: hoje essas profissionais controlam alunas, presença e mensalidades espalhadas entre WhatsApp, caderno e planilhas. O BalletPro centraliza tudo em: **alunas → turmas → presenças → mensalidades → cobrança**.

Existem duas frentes do produto:
1. **Página de vendas** (pública, pré-compra) — foco em converter.
2. **O sistema em si** (`/app`, pós-login) — dashboard operacional que a dona do studio usa todo dia, no celular principalmente.

Este briefing é sobre a **identidade visual do sistema (frente 2)**, não da página de vendas.

## O problema que estamos resolvendo agora

O sistema já está funcional — cadastro, turmas, alunas, presença, mensalidades, cobrança por WhatsApp, tudo funcionando. Mas o visual atual está **genérico**: cards brancos com borda cinza fina, tipografia sem hierarquia forte, quase nenhuma cor, e nada que remeta ao universo do ballet. Poderia ser um dashboard de barbearia ou oficina mecânica — nada ancora visualmente no produto certo.

Já validamos uma direção de paleta e tipografia (documento interno completo, reproduzido abaixo). **Sua parte é criar as peças de imagem** que vão dar corpo a essa identidade dentro do sistema. A implementação de código, componentes e telas fica com outra IA (Claude) — você não precisa se preocupar com isso, só com as imagens.

## Paleta aprovada (já validada, não mude)

| Nome | Hex | Papel |
|---|---|---|
| Bordô | `#7A1F3D` | Acento primário — ações, destaques, estados de atenção |
| Bordô profundo | `#5A1730` | Fundos de destaque, cards hero, superfícies escuras |
| Dourado envelhecido | `#A9834F` | Segundo acento — detalhes, ícones, assinatura visual da marca |
| Papel (fundo base) | `#FAF7F3` | Off-white quente — nunca branco puro |
| Tinta (texto) | `#2A1B22` | Preto com viés bordô — nunca `#000` puro |
| Sálvia (semântico "ok/pago") | `#6B7B5E` | Só para status, nunca como acento de marca |

**Regra de uso:** bordô e dourado carregam a identidade da marca. Verde/vermelho de status (pago, atrasado) são cores semânticas separadas — nunca use o bordô da marca para significar "erro".

## Tipografia aprovada

- **Display (títulos, logo, números grandes):** Fraunces — serifada com curvas, o tipo de fonte de programa de teatro/convite de recital, sem ser rebuscada.
- **Corpo/interface:** Inter — sans neutra, para todo dado operacional.

Ambas disponíveis no Google Fonts.

## Referência de tom (muito importante)

**Evite o clichê óbvio de ballet**: sem sapatilha de ponta desenhada, sem tutu, sem bailarina em silhueta, sem rosa-bebê/pastel infantil. A dona do studio está comprando uma **ferramenta de gestão profissional**, não decorando o quarto de uma criança. O ballet aqui deve aparecer como *sofisticação discreta* — a mesma linguagem visual de um programa de espetáculo, um convite de recital, um teatro clássico: tipografia elegante, dourado como metal, bordô profundo, muito papel/branco quente.

Pense em referências como: Cash App (números grandes com calor visual sem infantilizar), Linear (disciplina de cor, hierarquia tipográfica clara), Oura (dados pessoais recorrentes com curvas suaves mas operacional), programas de teatro impressos (serifada + dourado + papel).

## O que você precisa criar

### 1. Logo / wordmark do BalletPro
- Versão principal: wordmark "BalletPro" em Fraunces semibold, cor bordô (`#7A1F3D`) sobre fundo transparente/papel.
- Versão ícone isolado (sem texto): precisa funcionar legível em 32px (vai virar favicon e ícone de app no celular). Pense em algo abstrato ligado ao motivo do "arco dourado" descrito abaixo, não em sapatilha/bailarina literal.
- Versão monocromática (branco puro), para uso sobre fundos escuros/bordô.
- Formato: SVG se possível, ou PNG em alta resolução com fundo transparente.

### 2. Banner do aplicativo (dentro do sistema)
Precisamos de uma imagem de banner/capa para deixar visualmente bonita uma área de destaque dentro do sistema (ex: topo do dashboard ou tela de início) — hoje essa área é só texto plano ("Olá, [nome]. Este é o seu studio hoje"), sem nenhum elemento visual.
- Deve usar a paleta acima (fundo bordô profundo `#5A1730` ou papel `#FAF7F3`, com dourado como detalhe).
- Formato horizontal, tipo banner/capa de app — pense em proporção ampla (algo como 1200×400px ou similar, para um cabeçalho de card).
- Pode ter um elemento gráfico discreto e elegante (o "motivo de arco" dourado, uma textura sutil, linhas que remetam a movimento de dança sem literalidade) — nunca deve competir com o texto que vai por cima dele.
- Precisamos de pelo menos uma variação clara (para uso com texto escuro por cima) e uma escura (para uso com texto claro por cima).

### 3. Motivo gráfico de apoio (opcional, mas desejável)
Um elemento visual simples e repetível — como um arco fino dourado — que possa aparecer em pequenos detalhes pela interface (cantos de card, divisores, ícone de carregamento) como assinatura recorrente da marca, sem virar ilustração literal de ballet.

## O que NÃO fazer

- Não crie novas telas, componentes de interface ou fluxos — isso é responsabilidade do Claude, que está implementando o sistema em paralelo.
- Não proponha uma paleta ou tipografia diferente da aprovada acima — já foi validada com o cliente.
- Não use imagens de bailarinas, sapatilhas ou tutus de forma literal/clichê.
- Não use rosa pastel ou qualquer coisa que leia como infantil — o público é adulto (donas de studio administrando um negócio).

## Entrega esperada

Para cada peça (logo principal, ícone isolado, versão monocromática, banner claro, banner escuro), gere a imagem e descreva brevemente as variações que produziu, para que possamos revisar antes de implementar no código do sistema.
