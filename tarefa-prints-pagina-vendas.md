# Tarefa: prints para a página de vendas (fabricados via GPT/imagem)

> Este arquivo substitui a versão anterior por completo. A versão anterior
> descrevia uma página com scroll storytelling (Lenis/Framer Motion/zoom) que
> foi **abandonada** — a página atual (`src/app/page.tsx`) é estática, densa,
> mobile-first, sem scroll-jacking. Os 10 prints antigos em
> `public/marketing/prints/` também foram **descartados**: saíram presos
> demais na paleta bordô do BalletPro (até elementos que na vida real nunca
> seriam bordô, como botões do Google, saíram bordô), o que faz a tela
> parecer montagem em vez de produto real. Esta tarefa gera o conjunto novo.

## Objetivo da página (`/`, `src/app/page.tsx`)

Página única, longa, que o lead vê ao entrar por um anúncio. Estrutura atual
(estática, sem scroll-jacking): header → hero → grid "o que o app faz" (4
cards com ícone) → 3 blocos de destaque (texto + print, alternando lado e
fundo claro/escuro) → seção de confiança/segurança → planos → FAQ → CTA final
→ footer. Público: dona de studio de ballet pequeno/médio, não-técnica,
cansada de caderno/planilha/WhatsApp.

## Regra mais importante desta rodada: PARE DE PRENDER TUDO NO BORDÔ

O erro da rodada anterior foi tratar a paleta da marca (bordô `#7A1F3D` /
dourado `#A9834F`) como se **todo elemento de UI** tivesse que usar essas
cores — inclusive coisas que na vida real nunca seriam bordô: botão de login
do Google, ícone de nuvem de um provedor de e-mail, elementos de sistema
operacional, etc. Isso faz o print parecer artificial/montado em vez de uma
tela real de produto.

**A partir de agora: quem decide a paleta de cada tela é o próprio GPT ao
gerar a imagem, não este arquivo.** Este documento dá o contexto (o que é o
produto, quem usa, que dado aparece), mas **não prescreve uma tabela de hex
obrigatória por elemento**. Cabe ao gerador de imagem:
- Usar bordô/dourado com moderação, só onde uma marca real faria sentido
  (ex.: o logo do BalletPro, um botão de ação principal do próprio sistema).
- Deixar elementos de terceiros (Google, WhatsApp, provedores de e-mail) nas
  cores reais/genéricas deles, nunca repintados de bordô.
- Escrever, tela por tela, o próprio prompt de geração — a lista abaixo dá a
  cena e o conteúdo, não um prompt pronto para copiar e colar sem pensar.
- Variar a paleta de fundo/acento entre as telas conforme o contexto de cada
  uma (um e-mail parece um e-mail de verdade, um chat de WhatsApp parece
  WhatsApp de verdade), em vez de repetir a mesma paleta de marca em tudo.

## Formato técnico obrigatório (mudou nesta rodada)

- **Proporção 9:16**, sempre — não é mais 16:10.
- **Com moldura de iPhone real** (o contorno físico do aparelho: bordas,
  notch/dynamic island, botões laterais) — a imagem gerada já inclui o
  celular, não é só o conteúdo da tela solta. Antes pedíamos "sem moldura de
  hardware"; agora é o oposto: **com moldura**, porque o objetivo é parecer
  um print de celular de verdade, tirado por uma pessoa real.
- **Resolução mínima**: 1200×2133px (ou proporção equivalente a 9:16) em boa
  nitidez — vai aparecer em telas retina.
- **Tela do app ocupando o visor do iPhone**, com status bar do iOS real no
  topo (hora, sinal, bateria) — reforça o realismo de "print tirado agora".
- **Conteúdo em português do Brasil, sem erro de ortografia, sem
  "lorem ipsum"**.
- **Consistência de dados entre telas**: nomes, valores e turmas que
  aparecem em mais de uma tela devem bater (ex.: se "Marina Souza" aparece
  em duas telas, mesma turma e mesmo valor de mensalidade nas duas).

## Contexto do produto (para o GPT entender a cena, não copiar cor por cor)

BalletPro é um sistema de gestão para studios de ballet — não é app genérico
de academia. Interface real do produto: fundo claro/branco, tipografia
serifada nos títulos grandes e sans-serif no corpo, bordô como cor de marca
usada com moderação (ex.: no logo, num botão principal), tom editorial/limpo,
nunca infantil (nada de sapatilha/tutu cartoon) nem corporativo genérico
(nada de azul/roxo tech). Isso é referência de tom, não camisa de força de
paleta.

## Lista de prints a gerar (mesmo conjunto de telas de antes, formato novo)

Para cada item: onde a imagem é usada na página hoje, e o que precisa
aparecer na tela — o GPT escreve o prompt final e escolhe a paleta.

### 1. Dashboard — "Visão geral do studio"
- **Usado em**: Hero (`page.tsx`, seção inicial, componente `ScreenShot`).
- **Conteúdo**: tela inicial do app depois do login. Saudação ("Olá, Studio
  Arabesque"), 3 números em destaque (Alunas ativas: 46 · Recebido no mês:
  R$ 5.280,00 · Pendente: R$ 720,00), lista curta de turmas de hoje com
  horário, indício de gráfico simples de recebido x pendente.

### 2. Mensalidades — "Mensalidades de setembro"
- **Usado em**: bloco de destaque "Mensalidades" (`page.tsx`).
- **Conteúdo**: lista de mensalidades do mês com nome da aluna, valor,
  vencimento e status (Pago/Pendente/Atrasado — misturar os três). Resumo no
  topo com total previsto e recebido.

### 3. Central de Cobrança — "Fila de cobrança"
- **Usado em**: bloco de destaque "Central de cobrança" (`page.tsx`).
- **Conteúdo**: lista de alunas com mensalidade pendente/atrasada, valor,
  dias de atraso, botão de enviar cobrança pelo WhatsApp em cada card.

### 4. Central de Cobrança — "Mensagem no WhatsApp"
- **Usado em**: alternativa/apoio da seção de cobrança, se fizer sentido no
  layout atual (conferir com o usuário antes de usar as duas).
- **Conteúdo**: tela de conversa do WhatsApp de verdade (interface real do
  app, não reinventada) com uma mensagem de cobrança educada já escrita,
  indicando que foi sugerida pelo sistema.

### 5. Automação — "Resumo diário por e-mail"
- **Usado em**: bloco de destaque "Automação" (`page.tsx`).
- **Conteúdo**: tela de um app de e-mail real (Gmail ou similar, na
  interface genuína dele — **não repintar a UI do Gmail de bordô**) mostrando
  o e-mail de resumo diário do BalletPro aberto: recebido hoje, pendente no
  mês, atrasado, e um alerta de faltas seguidas de uma aluna.

## O que evitar (reforçado nesta rodada)

- **Não pintar de bordô elementos que pertencem a outra marca/sistema**
  (botões do Google, chrome do WhatsApp, chrome do Gmail, ícones do iOS).
  Essas coisas têm cor própria reconhecível — use a cor real delas.
- Nada de logotipo de terceiro copiado pixel a pixel indevidamente, mas o
  *estilo visual genérico* de WhatsApp/Gmail pode e deve ser reconhecível.
- Nada de rosto de pessoa real ou foto de bailarina — são só telas de
  software.
- Nada de inglês na interface do BalletPro em si (WhatsApp/Gmail mantêm o
  idioma que tiverem de fábrica no aparelho, normalmente português BR).
- Nada de dado inconsistente entre telas (ver seção de formato acima).

## Onde salvar

`public/marketing/prints/`, substituindo os arquivos antigos:
- `dashboard-hero.png`
- `mensalidades-lista.png`
- `cobranca-fila.png`
- `cobranca-whatsapp.png`
- `resumo-diario.png`

## Próximo passo depois de gerar

1. Apagar os prints antigos (16:10) que ficarem obsoletos.
2. Atualizar o componente `ScreenShot` em `src/app/page.tsx` — hoje ele
   assume proporção `aspect-[16/10]` e desenha sua própria barra de janela
   (bolinhas + label); com o novo formato 9:16 com moldura de iPhone real
   dentro da própria imagem, essa barra de janela deixa de fazer sentido e
   deve ser removida do componente (a imagem já vem com "moldura" própria).
3. Ajustar o layout das 3 seções de destaque que usam `ScreenShot`, já que a
   proporção muda de paisagem (16:10) para retrato (9:16) — vai precisar de
   menos largura e mais altura no grid dessas seções.
