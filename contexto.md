# Contexto do projeto BalletPro

> Leia este arquivo inteiro antes de fazer qualquer alteração. Ele existe para
> que uma nova sessão recupere o estado real do projeto sem precisar re-perguntar
> o que já foi decidido. Atualize-o sempre que fechar uma etapa importante.

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

1. ~~`SUPABASE_SERVICE_ROLE_KEY` nunca foi configurada.~~ **Resolvido
   2026-09-20.** A chave está em `.env.local` e o fluxo completo (webhook →
   compra gravada → cadastro reconhece e-mail → studio criado com plano e
   limite corretos → compra marcada como `usado_em`) foi testado
   de ponta a ponta com sucesso via Playwright + chamadas diretas à API do
   Supabase. Dados de teste já foram limpos do banco.

2. ~~Mudanças da integração Cakto não commitadas.~~ **Resolvido 2026-09-20** —
   commit `968aee4`, push feito, já em `main` no GitHub. A Vercel builda
   automaticamente a partir daí.

3. **`SUPABASE_SERVICE_ROLE_KEY` não está configurada na Vercel.** Está em
   `.env.local` localmente e o fluxo funciona em dev, mas em produção
   (`balletpro.vercel.app`) o cadastro vai falhar da mesma forma que falhava
   antes (Internal Server Error) até essa variável ser adicionada lá também.
   O acesso ao MCP da Vercel foi desconectado nesta sessão — fazer manual:
   `vercel.com/estevaobr23s-projects/balletpro/settings/environment-variables`
   → Add New → nome `SUPABASE_SERVICE_ROLE_KEY`, valor = a mesma chave
   `service_role` do Supabase (pegar de novo em
   `supabase.com/dashboard/project/lflvnagijahniywrjdhq/settings/api-keys`
   se necessário) → marcar Production+Preview+Development → salvar → disparar
   um **redeploy** (Deployments → ⋯ → Redeploy) pra pegar a variável nova.
   **Sem isso, ninguém consegue completar cadastro em produção depois de
   comprar.**

4. **Checkout da Cakto incompleto no painel** (a API não grava estes campos,
   é preciso configurar manualmente em `app.cakto.com.br`):
   - Imagem do produto BalletPro
   - PIX como método de pagamento padrão
   - Marcar opção de entrega de conteúdo (painel trava sem isso)
   - Renomear a oferta cheia de "BalletPro" para "Plano Completo" (hoje herdou
     o nome do produto)

5. **Duas IAs trabalham neste repositório em paralelo** — esta sessão (Claude,
   focada em funcionalidade/backend) e o Codex/ChatGPT (focado em UI, CSS,
   copy da landing page). Arquivos mudam fora das suas próprias edições; isso
   é esperado, não é conflito — sempre releia o arquivo antes de editar.

## Infraestrutura

| Serviço | Detalhe |
|---|---|
| **Supabase** | Projeto `balletpro`, id `lflvnagijahniywrjdhq`, região `sa-east-1`. Banco Postgres com RLS por studio. |
| **Vercel** | Projeto `balletpro`, produção em **https://balletpro.vercel.app**. Env vars `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` já configuradas lá (corrigido um Internal Server Error causado pela ausência delas). |
| **GitHub** | `https://github.com/estevaobr23/Balletpro.git`, branch `main`. |
| **Resend** | Conta criada, `RESEND_API_KEY` em `.env.local`. Modo de teste — só envia para `micaelestevao735@gmail.com` até verificar um domínio próprio. Usado pelo resumo diário. |
| **Cakto** | Conta de produção do usuário (sem sandbox). Produto `BalletPro` (`b585f136-6944-4c42-9fde-10d61e830c7d`) com duas ofertas — ver seção dedicada abaixo. |

Credenciais completas ficam em `.env.local` (nunca commitado, protegido por
`.gitignore`). Se uma nova sessão precisar de uma chave que já foi configurada
antes, **verifique o `.env.local` primeiro** — não peça de novo sem checar.

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
- **`cakto-webhook`** — recebe `purchase_approved` da Cakto, valida
  `body.secret` contra `CAKTO_WEBHOOK_SECRET`, mapeia `data.offer.id` pro
  plano (hardcoded: `36yqnbm` = básico, `366vvu9` = completo), grava em
  `purchases` com upsert por `transaction_id` (idempotente). Testada
  manualmente com payloads simulados — todos os casos passaram (básico,
  completo, oferta desconhecida, secret errado), e o fluxo completo
  webhook→cadastro foi validado em 2026-09-20 (ver seção Cakto). **Ainda não
  testada com uma compra real de cartão/PIX na Cakto.**

## Estrutura de rotas (`src/app`)

```
/                           landing page (pública, o Codex mantém isso vivo)
/login, /cadastro           auth — grupo (auth)
/auth/callback              callback do Supabase Auth

/app/onboarding             3 passos: studio → turma → aluna (obrigatório
                             logo após cadastro; agora exige compra aprovada
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

## Modelo comercial — Cakto

Definido com o usuário: **pagamento único vitalício**, dois planos.

| | Básico — R$67 | Completo — R$97 |
|---|---|---|
| Alunas | até 30 (`limite_alunas`) | ilimitadas |
| Core (alunas/turmas/presença/mensalidades, cobrança manual WhatsApp) | ✓ | ✓ |
| Central de Cobrança, resumo diário, automações, suporte prioritário | — | ✓ |

Produto na Cakto: `b585f136-6944-4c42-9fde-10d61e830c7d`.
- Oferta Completo (R$97, âncora): `366vvu9` — link `pay.cakto.com.br/366vvu9`
- Oferta Básico (R$67): `36yqnbm` — link `pay.cakto.com.br/36yqnbm`

**Fluxo de compra decidido**: compra primeiro, cadastro depois.
1. Cliente compra na Cakto com seu e-mail (sem precisar ter conta no BalletPro
   ainda).
2. Webhook `cakto-webhook` grava `email + plano` em `purchases`.
3. Cliente acessa `/cadastro`, cria conta com **o mesmo e-mail** da compra.
4. Ao criar o studio (`createStudio` em `onboarding/actions.ts`), o sistema
   usa `createAdminClient()` (service_role) pra buscar compra aprovada com
   aquele e-mail. Sem compra → bloqueia com mensagem clara. Com compra →
   grava `plano` e `limite_alunas` no studio e marca `usado_em` na compra.
5. Plano básico é enforced em `createStudent` (`alunas/actions.ts`): conta
   alunas ativas antes de inserir, bloqueia acima do limite.

**Testado de ponta a ponta em 2026-09-20** com webhook simulado + Playwright:
compra gravada → cadastro reconheceu o e-mail → studio criado com
`plano: 'basico'`, `limite_alunas: 30` → compra marcada `usado_em`. Dados de
teste já removidos do banco. Falta só testar com uma compra real via
cartão/PIX (fluxo síncrono do Cakto → webhook de produção).

Regras da skill `criar-produto-cakto` que valem se for mexer em produto/oferta
de novo: conta é produção real, sempre simular antes de `--confirmar`, um
produto com múltiplas ofertas (nunca produtos separados por plano), webhook
escuta lista explícita de produtos (produto fora da lista vende e nunca
dispara evento — já causou prejuízo real em outro projeto do usuário).

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

Paleta validada (ver artifact "Direção Visual BalletPro" se precisar
re-consultar, publicado numa sessão anterior): bordô `#7A1F3D` / `#5A1730`
como acento primário, dourado `#A9834F` como acento secundário (referência de
"programa de teatro", não sapatilha/tutu — clichê explicitamente evitado),
papel off-white `#FAF7F3`, tipografia Fraunces (display) + Inter (corpo).
Ícone da marca é um "B" bordô com um arco dourado — já vira favicon,
ícone de PWA (`public/icon-192.png`, `icon-512.png`, `apple-touch-icon.png`)
e `BrandLogo` component.

O Codex está evoluindo a landing page (`src/app/page.tsx`) e os componentes
de UI genéricos (`src/components/ui/*`) continuamente — não assumir que o
que está descrito aqui é o pixel exato atual, reler o arquivo.

## Conta de demonstração

`teste@balletpro.dev` / `balletpro123` — Studio Arabesque, Porto Alegre.
Populada com dados realistas para gravação de vídeo: 36 alunas ativas, 5
turmas (Baby Class, Ballet Infantil A/B, Ballet Juvenil, Ballet Adulto),
2 meses de mensalidades com status misto, ~345 registros de presença
(inclui uma aluna com faltas consecutivas pra testar o alerta de evasão).
Se for usada para testar o novo fluxo de compra/plano: hoje essa conta tem
`plano = 'completo'` (default), não passou pelo fluxo de checkout real.

## Padrões de trabalho validados nesta sessão

- Sempre rodar `npx tsc --noEmit`, `npx eslint src --ext .ts,.tsx` e
  `npm run build` antes de considerar uma mudança pronta.
- Testar fluxos no navegador via Playwright (`node test-flow.mjs` num script
  temporário na raiz do projeto, nunca commitado — apagar depois do teste,
  junto com screenshots em `C:\temp\balletpro-shots`).
- Migrations do Supabase sempre via `apply_migration` (nomeadas, versionadas),
  nunca `execute_sql` para DDL.
- Checar `get_advisors` (security) depois de qualquer migration nova —
  já pegou uma falha real (função de automação exposta publicamente via API
  REST, permitindo qualquer usuário logado gerar mensalidades de outro
  studio; corrigido revogando `EXECUTE`).
- Ao criar recursos com custo (novo projeto Supabase, etc.) sempre confirmar
  custo com o usuário antes — mesmo quando o custo é R$0.
- Dados de teste/fictícios sempre limpos do banco depois de validar (não
  deixar lixo na conta demo nem em produção).

## O que fica para depois (não implementar sem pedido explícito)

- Site próprio "da escola" (mencionado pelo usuário, adiado deliberadamente)
- Leitura automática de comprovante de pagamento via WhatsApp/OCR (visão de
  longo prazo, não MVP — exige API paga do WhatsApp)
- WhatsApp Business API oficial para disparo 100% automático de cobrança
- Trilha de auditoria mais rica na ficha da aluna (parcialmente feito:
  `billing_log` e alerta cruzado atraso+falta já existem)
