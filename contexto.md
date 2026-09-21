# Contexto do projeto BalletPro

> Leia este arquivo inteiro antes de fazer qualquer alteração. Ele existe para
> que uma nova sessão recupere o estado real do projeto sem precisar re-perguntar
> o que já foi decidido. Atualize-o sempre que fechar uma etapa importante.
> Reescrito do zero em 2026-09-21 — a versão anterior estava desatualizada em
> vários pontos (preços antigos, IDs de oferta antigos, header com "Entrar",
> descrição de uma landing com scroll-jacking que foi abandonada).

## O que é o produto

Micro-SaaS de gestão para **studios de ballet e escolas de dança pequenas/médias**
(não é sistema genérico de academia — a especificidade é o diferencial de venda).
Resolve: alunas, turmas, presença e mensalidades hoje espalhadas em WhatsApp +
caderno + planilha, centralizando em um único sistema com cobrança assistida por
WhatsApp e automações diárias.

Duas frentes dentro do **mesmo projeto Next.js**, não dois sites separados:
- `/` — página de vendas (pública)
- `/login`, `/cadastro` — autenticação
- `/app/*` — o sistema em si, protegido por auth

## ⚠️ Pendências críticas (ler primeiro)

1. **`SUPABASE_SERVICE_ROLE_KEY` pode não estar configurada na Vercel.**
   Está em `.env.local` localmente e o fluxo funciona em dev. Em produção
   (`balletpro.vercel.app`), sem essa env var o cadastro falha com Internal
   Server Error. Confirmar em
   `vercel.com/estevaobr23s-projects/balletpro/settings/environment-variables`
   → se ausente, adicionar `SUPABASE_SERVICE_ROLE_KEY` (pegar em
   `supabase.com/dashboard/project/lflvnagijahniywrjdhq/settings/api-keys`)
   → marcar Production+Preview+Development → salvar → redeploy. Sem isso,
   ninguém completa cadastro em produção depois de comprar.

2. **O login está com um modelo de autenticação quebrado no meio da troca.**
   A tela `/login` (`src/app/(auth)/login/page.tsx`) já foi simplificada pra
   pedir **só e-mail** (sem campo de senha) — decisão do usuário: login deve
   funcionar por e-mail de quem já comprou, não por senha. **Mas a função
   `signIn` em `src/app/(auth)/actions.ts` ainda chama
   `supabase.auth.signInWithPassword({ email, password })`**, com `password`
   sempre vazio agora — ou seja, **login sempre falha hoje**. Falta
   implementar a lógica real (provavelmente magic link / OTP por e-mail do
   Supabase Auth, verificando que o e-mail corresponde a uma compra
   aprovada). O usuário disse que "implementa depois" — não mexer nisso sem
   pedido explícito, mas é bom lembrar que login está inoperante em produção
   até essa lógica existir.

3. **Checkout da Cakto**: as ofertas atuais (ver seção Cakto) usam o
   checkout padrão do produto, que já está estilizado com a paleta da marca
   (bordô/off-white/verde) via API e verificado sem erro de renderização.
   Ainda não configurado manualmente no painel: imagem do produto, PIX como
   método padrão, opção de entrega de conteúdo. **O produto foi recriado do
   zero em 2026-09-21** — ver seção Cakto para o incidente completo.

4. **Fluxo de compra→cadastro não testado com uma compra real** (cartão/PIX
   de verdade), e **o teste com webhook simulado também precisa ser
   refeito** — o produto BalletPro foi excluído e recriado em 2026-09-21
   (checkout quebrado, ver seção Cakto), então os IDs de oferta mudaram de
   novo depois do teste de 2026-09-20. Nunca houve uma transação real
   processada pela Cakto em produção.

5. **Preço do produto na Cakto está em R$5,00 (placeholder)** — campo
   `price` do produto em si (não confundir com o preço de cada oferta, que
   estão corretos: Iniciante R$37,90, Profissional R$67,90). Esse campo do
   produto não aparece no checkout normalmente, mas vale corrigir no painel
   pra não ficar errado em nenhum relatório/e-mail que o use.

5. **Duas (ou mais) IAs trabalham neste repositório em paralelo** — esta
   sessão (Claude) e o Codex/ChatGPT, ambos mexendo em `src/app/page.tsx`
   (landing) e assets de marketing. Arquivos mudam fora das próprias
   edições; isso é esperado, não é conflito — sempre reler o arquivo antes
   de editar, e nunca presumir que o que está descrito aqui bate pixel a
   pixel com o código atual.

## Infraestrutura

| Serviço | Detalhe |
|---|---|
| **Supabase** | Projeto `balletpro`, id `lflvnagijahniywrjdhq`, região `sa-east-1`. Banco Postgres com RLS por studio. Acessível nesta sessão via MCP quando conectado (`mcp__claude_ai_Supabase__*`) — checar se está disponível antes de tentar. |
| **Vercel** | Projeto `balletpro`, produção em **https://balletpro.vercel.app**. Deploy automático a cada push em `main`. Acessível nesta sessão via MCP quando conectado (`mcp__claude_ai_Vercel__*`). |
| **GitHub** | `https://github.com/estevaobr23/Balletpro.git`, branch `main`. |
| **Resend** | Conta criada, `RESEND_API_KEY` em `.env.local`. Modo de teste — só envia para `micaelestevao735@gmail.com` até verificar um domínio próprio. Usado pelo resumo diário. |
| **Cakto** | Conta de produção do usuário (sem sandbox, 75+ produtos, a maioria de outros projetos do usuário — cuidado ao listar/excluir). Acessível nesta sessão via MCP `mcp__cakto__*`. Produto `BalletPro` (`e0fb3a1d-92bb-4faf-93cc-6d69e05b0db5`, **recriado em 2026-09-21**, o id antigo `b585f136...` não existe mais) — ver seção dedicada abaixo para as ofertas atuais. |
| **UTMify** | Pixel de rastreio de conversão instalado na landing (`page.tsx`), pixelId `6ab08b4c25e2526abd386109`, script de `cdn.utmify.com.br/scripts/pixel/pixel.js`. Repasse de UTM para os links de checkout **ainda não implementado** — o pixel sozinho não faz isso. |

Credenciais completas ficam em `.env.local` (nunca commitado, protegido por
`.gitignore`). Se uma nova sessão precisar de uma chave que já foi configurada
antes, **verifique o `.env.local` primeiro** — não peça de novo sem checar.

Os MCPs de Supabase/Vercel/Cakto **conectam e desconectam entre sessões** —
não presumir que estão disponíveis; testar com uma chamada simples primeiro
(ex. `list_projects`) e, se não estiver carregado, avisar o usuário em vez de
tentar contornar com CLI local (que também pode não estar autenticado).

## Schema do banco (Supabase, schema `public`)

Todas as tabelas de dados do studio têm RLS: `studio_id in (select id from
studios where owner_id = auth.uid())`. Isolamento garantido no banco, não só
na aplicação.

- **`studios`** — um studio por dono. Campos-chave: `owner_id` (→ `auth.users`),
  `nome`, `responsavel_nome`, `telefone`, `cidade`, `logo_url`,
  `onboarding_completo`, `mensagem_cobranca_template` (texto com variáveis tipo
  `{aluna}`, editável em Meu Perfil), `receber_resumo_diario` (bool),
  **`plano`** (`'basico'` | `'completo'`, default `'completo'`),
  **`limite_alunas`** (int ou null — `30` se básico, `null` = ilimitado).
- **`classes`** — turmas. `nome`, `modalidade`, `professor`, `nivel`,
  `faixa_etaria`, `dias_semana` (array de strings tipo `'segunda'`), `horario`,
  `ativo`.
- **`students`** — alunas. `class_id` (nullable), `nome`, `data_nascimento`,
  `responsavel_nome`, `telefone_responsavel`, `mensalidade_valor`,
  `dia_vencimento`, `observacoes`, `ativo`.
- **`attendance`** — presença. `class_id`, `student_id`, `data`, `status`
  (`'presente'` | `'faltou'` | `'justificada'`). UNIQUE em
  `(class_id, student_id, data)`.
- **`payments`** — mensalidades. `student_id`, `referencia_mes` (primeiro dia
  do mês), `valor`, `vencimento`, `status` (`'pago'` | `'pendente'` |
  `'atrasado'`), `data_pagamento`. UNIQUE em `(student_id, referencia_mes)`.
- **`billing_log`** — trilha de cobranças enviadas pelo WhatsApp (quando/pra
  quem), usada pra mostrar "última cobrança há X dias" e evitar cobrar 2x.
- **`leads`** — e-mails capturados na tela de Novidades.
- **`updates`** — posts do feed de Novidades (globais, não por studio).
- **`purchases`** — compras aprovadas na Cakto. `email`, `plano`,
  `transaction_id` (UNIQUE, idempotência), `valor`, `status`, `usado_em`
  (marcado quando um cadastro consome a compra). **RLS deny-all** — só
  `service_role` acessa (webhook grava, `admin.ts` lê no cadastro).

Automação via `pg_cron` (extensão habilitada):
- `balletpro-gerar-mensalidades-diario` — todo dia 06:00 UTC, roda
  `gerar_mensalidades_automaticas()`: gera mensalidades do mês pra alunas
  ativas e marca atrasadas. Função é `SECURITY DEFINER` com `EXECUTE`
  revogado de `anon`/`authenticated` (só o cron chama).
- `balletpro-daily-digest-email` — todo dia 11:30 UTC, chama via `pg_net` a
  Edge Function `daily-digest`.

Edge Functions publicadas:
- **`daily-digest`** — para cada studio com `receber_resumo_diario = true`,
  calcula previsto/recebido/atrasado do mês e detecta alunas com 3+ faltas
  nas últimas 4 aulas registradas; envia e-mail via Resend só se houver algo
  a reportar. Protegida por `CRON_SECRET` no header `Authorization`.
- **`cakto-webhook`** (versão 3, deployada em 2026-09-21) — recebe
  `purchase_approved` da Cakto, valida `body.secret` contra
  `CAKTO_WEBHOOK_SECRET`, mapeia `data.offer.id` pro plano usando **listas**
  de IDs (não mais um único ID fixo por plano — ver seção Cakto), grava em
  `purchases` com upsert por `transaction_id` (idempotente). Testada
  manualmente com payloads simulados em 2026-09-20 (todos os casos passaram).
  **Ainda não testada com uma compra real de cartão/PIX na Cakto.**

## Estrutura de rotas (`src/app`)

```
/                           landing page (pública) — ver seção dedicada
/login, /cadastro           auth — grupo (auth)
/auth/callback              callback do Supabase Auth

/app/onboarding             3 passos: studio → turma → aluna (obrigatório
                             logo após cadastro; exige compra aprovada
                             — ver seção Cakto)
/app/dashboard               visão geral: financeiro do mês, turmas de hoje,
                             ações rápidas, primeiros passos
/app/alunas, /nova, /[id]    CRUD de alunas + ficha completa (pagamentos,
                             presença, alerta cruzado atraso+falta, botão
                             WhatsApp "Perguntar" em cada falta)
/app/turmas, /nova, /[id]    CRUD de turmas
/app/presenca                fazer chamada (turma + data, toggle por aluna)
/app/presenca/historico      resumo mensal de frequência por turma (tabs
                             compartilhadas com /app/presenca)
/app/mensalidades            lista com filtros, gerar mês, marcar pago,
                             exportar CSV (/exportar route)
/app/cobranca                Central de Cobrança: fila de pendentes/atrasadas
                             do mês, mensagem editável por card, WhatsApp,
                             registra em billing_log, mostra "última cobrança"
/app/perfil                  dados do studio, upload de logo, editor do
                             template de cobrança (com preview ao vivo),
                             toggle do resumo diário
/app/novidades                feed de updates + captura de e-mail (leads)
/app/instalar                 tutorial de instalar como PWA (manifest.json
                              + ícones já gerados a partir da marca)
```

Layout `/app/*` (`src/app/app/layout.tsx`) monta sidebar (desktop) +
bottom nav (mobile, 5 itens fixos: Início/Alunas/Turmas/Presenças/
Mensalidades) + `AccountMenu` no topo (Perfil/Novidades/Instalar/Sair).
`getCurrentStudio()` (`src/lib/supabase/get-studio.ts`) é o guard usado em
quase toda página server — redireciona pra onboarding se studio não existe
ou não terminou onboarding.

## Página de vendas (`src/app/page.tsx`) — estado atual

**A landing NÃO usa mais scroll storytelling.** Um experimento anterior com
Lenis + Framer Motion (zoom no scroll, color-wipe, sticky-scroll) foi
**totalmente abandonado e removido do código** por pedido explícito do
usuário ("ficou horrível, muito seco, abandonar completamente"). A página
hoje é **estática, densa, mobile-first** (o usuário reforçou várias vezes
que o tráfego é 100% mobile — anúncios não rodam para desktop).

Estrutura de seções, em ordem, todas dentro de `Home()`:

1. **Header** — `sticky top-0`, só logo (`BrandLogo compact`) + nav
   (Recursos/Planos/Dúvidas), sem nenhum CTA de conta. Os antigos botões
   "Entrar"/"Já comprei"/"Começar" foram removidos do header — o usuário
   decidiu que login não deve ser promovido ali (é só para quem já comprou,
   e o cliente novo não deve ser tentado a clicar num link de login).
2. **Hero** — headline + sub, um `PhoneMockup` com o print real do dashboard
   (`/marketing/prints/dashboard-hero.png`), com 3 elementos flutuantes
   estilo notificação iOS (**liquid glass**: `bg-white/75` + `backdrop-blur-xl`
   + sombra) **sobrepostos à própria tela do celular** (não ao lado — não há
   espaço em mobile): `FloatingStatCard` ("Recebido no mês") no canto
   superior direito, duas `FloatingNotification` ("Alerta de faltas",
   "Pagamento pendente") coladas na parte inferior. CTA "QUERO ORGANIZAR MEU
   STUDIO" rola até `#planos` (não é mais link direto pro checkout).
3. **`#recursos`** — grid de 4 `FeatureCard` (ícone + título + texto) sobre
   fundo rosé `#f6e9ec`, cada um com ícone próprio do kit em
   `src/components/ui/icons.tsx` (`Icons.students`, `.attendance`,
   `.payments`, `.whatsapp`).
4. **Bloco "Mensalidades"** — texto + `StoryVisual` (composição: uma foto
   lifestyle de fundo + 1 ou mais `PhoneMockup` sobrepostos, com efeito de
   profundidade/sombra — ver componente). CTA "Ver como funciona" → `#planos`.
5. **Bloco "Central de cobrança"** (fundo escuro, gradiente
   `#24101a→#381522→#160a10`, `reverse` de lado) — `StoryVisual` com 2
   telefones (fila de cobrança + mensagem WhatsApp). CTA "Conhecer os
   planos" → `#planos`.
6. **Bloco "Automação"** (presença + resumo diário, fundo claro
   `#fbf8f4`) — `StoryVisual` com 1 telefone (resumo diário por e-mail).
   CTA → `#planos`.
7. **`#`Confiança/Segurança** — grid de 4 `TrustCard`, fundo dourado claro
   `#fbeedd`. Sem CTA.
8. **`#planos`** — fundo escuro em gradiente (mesma paleta do bloco de
   cobrança). Dois cards, ver seção "Modelo comercial" abaixo pros detalhes
   de preço/conteúdo. Só os botões **dentro** desses dois cards
   (`plan.checkoutHref`) apontam direto pro link de checkout externo da
   Cakto — é a única parte da página com link de compra direta.
9. **Garantia** — selo `.webp` padronizado da skill `padrao-lowticket`
   (`/marketing/garantia-15-dias.webp`), headline + texto de garantia
   incondicional de 15 dias.
10. **`#duvidas`** — FAQ em `<details>`/`<summary>`, 6 perguntas.
11. **CTA final** — fundo escuro, CTA → `#planos`.
12. **Footer** — logo + tagline.

**Regra importante de UX consolidada nesta sessão**: nenhum CTA "de
apresentação" espalhado pela página (Hero, blocos de destaque, CTA final)
deve ir direto para o link de checkout externo. Clicar neles rola a página
até `#planos`; só depois de ver os dois planos lado a lado é que a pessoa
decide e clica no botão de dentro do card, que aí sim abre o checkout. Isso
foi corrigido depois que o usuário reportou "não consigo entrar no checkout
de 67" — o problema real era CTAs de navegação levando direto a uma tela de
pagamento sem a pessoa ter escolhido nada, o que parecia quebrado/abrupto.

**Componentes auxiliares em `page.tsx`** (não extraídos pra arquivos
separados, todos no topo do arquivo): `SectionHead`, `FeatureCard`,
`FloatingNotification`, `FloatingStatCard`, `PhoneMockup`, `StoryVisual`,
`TrustCard`, `FaqItem`.

## Modelo comercial — Cakto

Definido com o usuário: **pagamento único vitalício**, dois planos.

| | Iniciante — R$37,90 | Profissional — R$67,90 |
|---|---|---|
| Alunas | até 30 (`limite_alunas`) | ilimitadas |
| Core (alunas/turmas/presença/mensalidades, cobrança manual WhatsApp) | ✓ | ✓ |
| Central de Cobrança, resumo diário, automações, suporte prioritário | — | ✓ |
| Parcelamento exibido | 12x de R$3,16 | 12x de R$5,66 |

**Os nomes dos planos mudaram** de "Básico/Completo" para
**"Iniciante/Profissional"** — decisão do usuário, "algo mais interessante".
**Os preços também mudaram** de R$67/R$97 para **R$37,90/R$67,90**.

**⚠️ Produto recriado do zero em 2026-09-21.** O produto antigo
(`b585f136-6944-4c42-9fde-10d61e830c7d`) foi **excluído** depois que um `PUT`
no checkout (para aplicar a paleta da marca) gravou um `config` incompleto —
faltava a chave `extra` (chat/exitPopup/notification) — e isso quebrava a
inicialização do app do checkout com `TypeError: Cannot read properties of
undefined (reading 'exitPopup')`. Ninguém conseguia comprar. Diagnosticado
com Playwright (`page.on('pageerror')`), confirmado que produto/oferta
estavam `active` do lado da Cakto e que o bug era só no `config` gravado.
Por pedido do usuário, o produto foi excluído e recriado do zero em vez de
tentar consertar o `config` por API. **Essa causa raiz e como evitar
repetição estão documentadas na skill `criar-produto-cakto`
(`references/checkout-visual.md`)** — sempre `GET` o `config` existente
antes de sobrescrever, nunca escrever um `config` novo mentalmente sem as
três chaves de `extra`.

Produto na Cakto (novo): **`e0fb3a1d-92bb-4faf-93cc-6d69e05b0db5`**, short id
`B3knnsb`.

**Ofertas ATUAIS (ativas, usadas na landing hoje)**, recriadas em 2026-09-21:
- Profissional (R$67,90): `6sugp8e` — link `pay.cakto.com.br/6sugp8e` (é a
  oferta `default` do produto, gerada automaticamente na criação; só foi
  renomeada/reprecificada via `PUT offers/{id}/`)
- Iniciante (R$37,90): `6uut7rg` — link `pay.cakto.com.br/6uut7rg` (criada
  via `POST offers/`)

**Ofertas ANTIGAS (produto excluído, portanto essas ofertas não existem
mais — não usar, não redirecionar)**:
- `3dcqzeb` / `3cwhu9v` (as de antes desta recriação)
- `366vvu9` / `36yqnbm` (já estavam desativadas desde antes)
Os IDs antigos continuam na lista de mapeamento do webhook (ver abaixo) só
por segurança de tráfego residual de links antigos já divulgados — eles não
geram vendas novas, mas se alguém clicar num link salvo antigo, o produto já
não existe mais na Cakto (404).

O checkout usado por essas ofertas é o **checkout padrão único do produto**
(id `1126482`, nome "Checkout Principal", gerado automaticamente na criação
do produto) — as duas ofertas foram vinculadas a ele **automaticamente pela
Cakto** ao serem criadas, sem precisar de nenhum PUT manual no checkout para
isso.

**Checkout estilizado via API** (`config.desktop` e `config.mobile`,
`PUT products_checkouts_update`) com a paleta da marca: fundo `#FAF7F3`,
cartão branco, bordô `#7A1F3D` em cabeçalho/seleção/botão de pagamento
selecionado, texto `#2A1B22`/`#746C70`, botão de pagar em verde de conversão
`#06a742` com o texto "QUERO ORGANIZAR MEU STUDIO", fonte `Roboto` (única
que a Cakto aceita — `Inter` é ignorada). Desta vez o `config` foi gravado
**completo** (checklist da skill): `rows` com o componente `checkout`,
`extra` com as 3 chaves desabilitadas, as 8 chaves de `settings` — nos dois
lados (mobile/desktop). Verificado com Playwright real (viewport mobile,
`page.on('pageerror')`) sem nenhum erro de inicialização, cor aplicada
corretamente (`getComputedStyle` conferido), texto do botão certo.

**Aprendizado técnico (ainda válido)**: o endpoint `PATCH`
(`products_checkouts_partial_update`) retornava 400 mesmo com payloads
idênticos ao exemplo oficial da documentação; o que funciona é `PUT`
(`products_checkouts_update`) enviando `name`, `default` e `offers`
explícitos junto com `config` — esses campos são exigidos mesmo numa
atualização que deveria ser parcial, e `offers` precisa ser sempre
reenviado com o array atual para não desvincular o checkout das ofertas.

**Fluxo de compra decidido**: compra primeiro, cadastro depois.
1. Cliente compra na Cakto com seu e-mail (sem precisar ter conta no BalletPro
   ainda). Todos os CTAs da landing rolam até `#planos` primeiro; só os
   botões dentro dos cards de plano vão direto pro checkout.
2. Webhook `cakto-webhook` grava `email + plano` em `purchases`. O mapeamento
   de oferta→plano é por **lista de IDs** (`OFFER_IDS_BASICO = ["6uut7rg",
   "3cwhu9v", "36yqnbm"]`, `OFFER_IDS_COMPLETO = ["6sugp8e", "3dcqzeb",
   "366vvu9"]` no código da function), incluindo os IDs atuais e os antigos
   (de produtos já excluídos) por segurança de tráfego residual — mesmo que
   os links antigos deem 404 na Cakto agora, nenhuma venda que porventura já
   tenha passado por eles fica sem mapeamento. **Function publicada em
   produção em 2026-09-21 (versão 4)** via `npx supabase functions deploy
   cakto-webhook`, depois de `supabase login` (CLI não vinha autenticado
   nesta máquina; resolvido chamando `npx.cmd` em vez de `npx` — a política
   de execução do PowerShell bloqueava o `.ps1` do `npx`).
3. Cliente acessa `/cadastro`, cria conta com **o mesmo e-mail** da compra.
4. Ao criar o studio (`createStudio` em `onboarding/actions.ts`), o sistema
   usa `createAdminClient()` (service_role) pra buscar compra aprovada com
   aquele e-mail. Sem compra → bloqueia com mensagem clara. Com compra →
   grava `plano` e `limite_alunas` no studio e marca `usado_em` na compra.
5. Plano básico é enforced em `createStudent` (`alunas/actions.ts`): conta
   alunas ativas antes de inserir, bloqueia acima do limite.

**Testado de ponta a ponta em 2026-09-20** (antes da recriação do produto e
da mudança de IDs) com webhook simulado + Playwright: compra gravada →
cadastro reconheceu o e-mail → studio criado com `plano: 'basico'`,
`limite_alunas: 30` → compra marcada `usado_em`. Dados de teste já removidos
do banco. **Esse teste precisa ser refeito** com os IDs de oferta atuais
(`6uut7rg`/`6sugp8e`) — o produto e as ofertas mudaram de novo em
2026-09-21 (produto recriado do zero por causa do incidente do checkout
quebrado), então o mapeamento do webhook mudou outra vez e ainda não foi
validado ponta a ponta com esses IDs específicos, só verificado que o
checkout em si carrega sem erro (Playwright, sem crash JS) e que a function
está publicada com o mapeamento novo.

Regras da skill `criar-produto-cakto` que valem se for mexer em produto/oferta
de novo: conta é produção real, sempre simular antes de `--confirmar`, um
produto com múltiplas ofertas (nunca produtos separados por plano), webhook
escuta lista explícita de produtos (produto fora da lista vende e nunca
dispara evento — já causou prejuízo real em outro projeto do usuário).

## Rastreio de conversão — UTMify

Pixel instalado na landing (`page.tsx`) via dois `next/script`: um define
`window.pixelId = "6ab08b4c25e2526abd386109"`, o outro carrega
`cdn.utmify.com.br/scripts/pixel/pixel.js`. Testado no navegador local:
`window.pixelId` correto, script carregado, tracker inicializado.

**Pendência**: o pixel sozinho não repassa parâmetros de UTM para os links
de checkout externos (`pay.cakto.com.br/...`) — isso precisaria de um script
adicional que leia a query string da landing e a copie para o `href` dos
CTAs antes do clique (ver skill `padrao-lowticket`, seção 5c, para o padrão
de implementação usado em outros produtos do usuário). Não implementado
ainda.

**Nota de segurança relevante**: o usuário colou o script do pixel em
formato ofuscado (base64 + XOR, gerado por alguma ferramenta de terceiro).
Foi decodificado antes de implementar — confirmou-se que era só o pixel
legítimo da UTMify, sem nada malicioso, mas o padrão geral vale registrar:
scripts de terceiro que chegam ofuscados devem sempre ser decodificados e
inspecionados antes de colar em produção, mesmo vindo do próprio usuário.

## Automações e "argumentos de anúncio"

O usuário pediu explicitamente para o produto ter automações fortes o
suficiente pra virar argumento de anúncio. Três pilares, todos implementados:

1. **Mensalidades geram sozinhas** — `pg_cron` diário, sem clique manual.
2. **Central de Cobrança "quase automática"** — WhatsApp não permite disparo
   100% robô sem API paga; o sistema faz tudo (filtra, monta mensagem) e o
   clique final de envio é do usuário. Comunicado honestamente na própria UI
   da tela `/app/cobranca`.
3. **Resumo diário por e-mail + alerta de evasão** — proativo, não depende de
   abrir o app. Bloqueado em produção real pela verificação de domínio da
   Resend (pendência conhecida, não crítica — funciona pro próprio e-mail do
   usuário, só não escala pra clientes ainda).

## Identidade visual

Paleta validada: bordô `#7A1F3D` / `#5A1730` como acento primário, dourado
`#A9834F` como acento secundário (referência de "programa de teatro", não
sapatilha/tutu — clichê explicitamente evitado), papel off-white `#FAF7F3`,
tipografia Fraunces (display) + Inter (corpo). Ícone da marca é um "B"
bordô com um arco dourado — favicon, ícone de PWA
(`public/icon-192.png`, `icon-512.png`, `apple-touch-icon.png`) e
`BrandLogo` component (`compact` = só o "B", sem o nome ao lado).

Verde de conversão `#06a742`/`#048a37` reservado para elementos de
compra/confirmação (✓ das listas, CTA do plano recomendado), seguindo o
padrão da skill `padrao-lowticket` — nunca confundir com o verde de sucesso
usado no app interno (`#24734f`). Vermelho `#b3374a` para os ✕ de recursos
não incluídos no plano Iniciante.

**Assets de marketing gerados por IA** (via GPT, seguindo briefings salvos
no repo — ver arquivos `tarefa-*.md` na raiz):
- `public/marketing/prints/` — 5 prints reais de tela do app em formato 9:16
  com moldura de iPhone (dashboard, mensalidades, fila de cobrança, mensagem
  WhatsApp, resumo diário por e-mail). Paleta decidida pelo próprio gerador
  por imagem (não forçamos bordô em elementos que não são da marca, como
  botões do WhatsApp/Gmail — isso já causou um erro corrigido nesta sessão).
- `public/marketing/lifestyle/` — 3 fotos realistas de contexto (mulher
  administrando o studio) usadas como fundo nos blocos `StoryVisual`.
- `public/marketing/mockups/` — mockup composto (tablet + celulares) usado
  no card do plano Profissional.
- `public/marketing/garantia-15-dias.webp` — selo padronizado copiado da
  skill `padrao-lowticket` (`assets/padrao/garantia-15-dias.webp`).
- `public/marketing/ads/` — 5 criativos de anúncio, **ainda não referenciados
  em nenhum código**, gerados fora do fluxo desta sessão (provavelmente pelo
  usuário direto ou pelo Codex). Mantidos como untracked no git por pedido
  explícito do usuário ("deixar de fora por enquanto") — não commitar sem
  perguntar de novo.

O Codex também mexe em `src/app/page.tsx` e nos assets de marketing
continuamente — não assumir que o que está descrito aqui bate pixel a pixel
com o código atual, reler o arquivo sempre.

## Conta de demonstração

`teste@balletpro.dev` / `balletpro123` — Studio Arabesque, Porto Alegre.
Populada com dados realistas para gravação de vídeo: 36 alunas ativas, 5
turmas (Baby Class, Ballet Infantil A/B, Ballet Juvenil, Ballet Adulto),
2 meses de mensalidades com status misto, ~345 registros de presença
(inclui uma aluna com faltas consecutivas pra testar o alerta de evasão).
Hoje essa conta tem `plano = 'completo'` (default), não passou pelo fluxo de
checkout real. Login de teste usa senha — pode estar quebrado também se o
fluxo de auth mudar para passwordless (ver pendência #2 no topo).

## Padrões de trabalho validados

- Sempre rodar `npx tsc --noEmit`, `npx eslint src --ext .ts,.tsx` e
  `npm run build` antes de considerar uma mudança pronta.
- Testar fluxos no navegador via Playwright (`node test-flow.mjs` num script
  temporário na raiz do projeto, nunca commitado — apagar depois do teste,
  junto com screenshots em `C:\temp\balletpro-shots`).
- Migrations do Supabase sempre via `apply_migration` (nomeadas, versionadas),
  nunca `execute_sql` para DDL.
- Checar `get_advisors` (security) depois de qualquer migration nova.
- Ao criar recursos com custo (novo projeto Supabase, etc.) sempre confirmar
  custo com o usuário antes — mesmo quando o custo é R$0.
- Dados de teste/fictícios sempre limpos do banco depois de validar (não
  deixar lixo na conta demo nem em produção).
- Operações de escrita na Cakto (`cakto_call` com `confirm`) sempre chamadas
  primeiro com `confirm: false` para gerar preview, aprovado pelo usuário
  antes de repetir com `confirm: true` — é conta de produção real, sem
  sandbox.
- Assets gerados por IA (prints, lifestyle, mockups) sempre com briefing
  registrado antes em um arquivo `tarefa-*.md` na raiz do projeto, não
  gerados "no escuro" — isso já evitou erros de paleta forçada e formato
  errado (16:10 sem moldura → 9:16 com moldura de iPhone).
- Pasta `public/marketing/ads/` fica fora dos commits até o usuário pedir
  explicitamente para incluir.
- MCPs de infraestrutura (Supabase/Vercel/Cakto) podem estar conectados ou
  não dependendo da sessão — testar disponibilidade antes de depender deles,
  e nunca tentar contornar com CLI local sem confirmar que há autenticação
  disponível (evita pedir pro usuário rodar `login` interativo à toa).

## O que fica para depois (não implementar sem pedido explícito)

- Lógica real de login passwordless (magic link/OTP) para substituir o
  `signInWithPassword` quebrado — ver pendência crítica #2.
- Repasse de UTM da landing para os links de checkout externos.
- Site próprio "da escola" (mencionado pelo usuário, adiado deliberadamente).
- Leitura automática de comprovante de pagamento via WhatsApp/OCR (visão de
  longo prazo, não MVP — exige API paga do WhatsApp).
- WhatsApp Business API oficial para disparo 100% automático de cobrança.
- Trilha de auditoria mais rica na ficha da aluna (parcialmente feito:
  `billing_log` e alerta cruzado atraso+falta já existem).
- Configuração manual do checkout no painel Cakto (imagem do produto, PIX
  padrão, opção de entrega de conteúdo).
