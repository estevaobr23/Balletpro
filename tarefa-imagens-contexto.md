# Tarefa: imagens lifestyle para a página de vendas

> Este arquivo substitui a versão anterior. Ainda não implementar nada no
> código a partir deste documento — é só o briefing pra gerar as imagens no
> GPT. Quando as imagens estiverem prontas e salvas, aí sim mexemos no
> componente da página.

## Onde estão os prints de tela já gerados (para referência, não mexer)

Os 5 prints reais do sistema (formato 9:16, com moldura de iPhone) já foram
gerados e estão em `public/marketing/prints/`:
- `dashboard-hero.png` — usado no Hero
- `mensalidades-lista.png` — usado na seção de Mensalidades
- `cobranca-fila.png` — usado na seção de Central de Cobrança
- `cobranca-whatsapp.png` — usado na mesma seção, junto com o de cima em cascata
- `resumo-diario.png` — usado na seção de Automação

Esses prints continuam existindo e continuam sendo usados. As imagens
lifestyle desta tarefa são um elemento **novo**, que vai entrar ao lado ou
atrás desses prints — não substituem os prints de tela.

## O que é uma "imagem lifestyle" aqui

Foto realista (gerada por IA, mas com aparência de fotografia de verdade,
não ilustração/desenho/3D) de uma pessoa real vivendo uma cena do dia a dia
de quem administra um studio de ballet. **Não é obrigatório o app aparecer
na cena** — o valor da imagem é mostrar o contexto humano (a rotina, o
alívio, a confiança de quem já não vive mais no caos do caderno/planilha/
WhatsApp), não necessariamente mostrar uma tela de celular ligada.

## Regra de paleta (igual à regra já aplicada nos prints de tela)

**Não forçar a paleta de marca do BalletPro (bordô/dourado) na cena.** Essas
são fotos de pessoas reais em ambientes reais — o próprio GPT decide os
tons da cena (roupa, luz, ambiente) com base no que faria sentido numa foto
de verdade, sem pintar objetos ou roupas de bordô só para "casar com a
marca". Bordô/dourado podem aparecer naturalmente (ex.: uma peça de roupa,
um detalhe do ambiente) só se isso não parecer forçado — nunca como regra
obrigatória.

## Seções da página que vão ganhar imagem lifestyle

A página atual (`src/app/page.tsx`) tem hoje estas seções com um "slot" de
destaque (texto + print de tela). O Hero **fica de fora** — não geramos
imagem lifestyle para o Hero, só para as seções abaixo dele:

### 1. Seção "Mensalidades" (`Pagamentos gerados sozinhos, todo mês.`)
- **Contexto da seção**: mensalidades sendo geradas e cobradas sozinhas,
  sem a dona do studio precisar ficar controlando planilha.
- **Cena sugerida**: a dona do studio num momento de tranquilidade em
  relação a dinheiro/organização — pode ser tomando um café numa mesa com
  notebook fechado ou de lado (sinal de que não precisa ficar "vigiando" a
  planilha), expressão leve, sem estar necessariamente olhando pra uma tela.
  Não é obrigatório aparecer celular/notebook/tablet na cena.

### 2. Seção "Central de Cobrança" (`Cobrar quem está atrasado, sem constrangimento.`)
- **Contexto da seção**: cobrar sem o desconforto social de "ficar em cima"
  de alguém.
- **Cena sugerida**: a dona do studio numa interação tranquila — pode ser
  conversando com uma mãe/responsável na porta do studio, ou simplesmente
  num momento de leveza no ambiente de trabalho, sem cara de quem está
  cobrando dívida. A ideia é transmitir alívio/naturalidade, não
  necessariamente mostrar o celular com WhatsApp aberto.

### 3. Seção "Automação" (`Chamada em segundos e um resumo todo dia.`)
- **Contexto da seção**: começar o dia já sabendo como está tudo, sem abrir
  o sistema manualmente.
- **Cena sugerida**: a dona do studio numa cena matinal genuína — café da
  manhã, luz natural de manhã, talvez arrumando a bolsa pra sair de casa ou
  chegando no studio. De novo, não é obrigatório aparecer uma tela.

## Estilo fotográfico obrigatório (vale para as 3 fotos)

- Fotografia realista, luz natural, sem parecer banco de imagens genérico.
- Protagonista: mulher adulta (30-45 anos), dona/professora de um studio de
  ballet pequeno, roupa de trabalho comum (não uniforme de bailarina em
  cena, sem tutu/collant clichê).
- Sem foco em rosto de criança como protagonista (por segurança de imagem).
- Ambiente condizente com um studio de dança pequeno/médio ou a casa da
  pessoa (não escritório corporativo genérico).
- Proporção vertical ou quadrada, resolução alta (mínimo 1200px no menor
  lado), pra funcionar bem tanto ao lado do print de celular (9:16) quanto
  como fundo de seção.

## Onde salvar

`public/marketing/lifestyle/`, com nomes:
- `mensalidades-tranquilidade.png`
- `cobranca-leveza.png`
- `automacao-manha.png`

## Status desta tarefa

Só briefing por enquanto. **Nenhuma mudança de código foi feita ainda** —
quando as 3 imagens estiverem geradas e salvas, avisar para decidirmos juntos
como elas entram no layout de cada seção (ao lado do print, atrás dele como
fundo com o print sobreposto, etc.) antes de mexer em `page.tsx`.
