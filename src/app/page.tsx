import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Icons } from "@/components/ui/icons";

const UTMIFY_PIXEL_ID = "6ab08b4c25e2526abd386109";

function SectionHead({
  eyebrow,
  title,
  sub,
  dark = false,
  center = true,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <p
        className={`text-xs font-bold uppercase tracking-[.16em] ${
          dark ? "text-[#e4c4ce]" : "text-[#7A1F3D]"
        }`}
      >
        {eyebrow}
      </p>
      <div
        className={`mt-3 h-[3px] w-14 rounded-full bg-gradient-to-r from-[#7A1F3D] to-[#A9834F] ${
          center ? "mx-auto" : ""
        }`}
      />
      <h2
        className={`mt-4 font-display text-3xl leading-tight sm:text-4xl ${
          dark ? "text-white" : "text-[#2a1b22]"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p className={`mt-3 text-base leading-7 ${dark ? "text-[#ead9df]" : "text-[#746c70]"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

function FeatureCard({
  icon: IconComp,
  title,
  text,
}: {
  icon: (p: { className?: string }) => React.ReactElement;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e8e3e3] bg-white p-6 shadow-[0_10px_30px_rgba(73,39,52,.06)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#7A1F3D] text-[#7A1F3D]">
        <IconComp className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-semibold text-[#2a1b22]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#746c70]">{text}</p>
    </div>
  );
}

function FloatingNotification({
  title,
  text,
  time,
  className = "",
}: {
  title: string;
  text: string;
  time: string;
  className?: string;
}) {
  return (
    <div
      className={`absolute z-30 items-start gap-2 rounded-xl border border-white/60 bg-white/75 p-2 shadow-[0_18px_40px_rgba(73,39,52,.22)] backdrop-blur-xl sm:gap-2.5 sm:rounded-2xl sm:p-3 ${className}`}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[0.5rem] bg-[#7A1F3D] shadow-inner sm:h-9 sm:w-9 sm:rounded-[0.6rem]">
        <Image src="/brand/balletpro-mark-white.svg" alt="" width={18} height={18} className="h-3.5 w-3.5 sm:h-[18px] sm:w-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-1.5">
          <p className="truncate text-[11px] font-semibold text-[#2a1b22] sm:text-[13px]">{title}</p>
          <span className="hidden shrink-0 text-[10px] text-[#8a7f83] sm:inline">{time}</span>
        </div>
        <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-[#5c5257] sm:text-[12px]">{text}</p>
      </div>
    </div>
  );
}

function FloatingStatCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute z-30 rounded-xl border border-white/60 bg-white/75 p-2.5 shadow-[0_18px_40px_rgba(73,39,52,.22)] backdrop-blur-xl sm:rounded-2xl sm:p-4 ${className}`}
    >
      <p className="text-[9px] font-semibold uppercase tracking-wide text-[#8a7f83] sm:text-[10px]">Recebido no mês</p>
      <p className="mt-1 font-display text-base font-semibold text-[#2a1b22] sm:text-2xl">R$ 5.280</p>
      <div className="mt-2 flex items-end gap-1">
        {[40, 65, 50, 80, 60, 90, 70].map((h, i) => (
          <span
            key={i}
            style={{ height: `${h * 0.22}px` }}
            className="w-2 flex-1 rounded-sm bg-[#7A1F3D]/80 sm:h-auto"
          />
        ))}
      </div>
      <p className="mt-2 text-[10px] font-semibold text-[#24734f] sm:text-[11px]">↑ 18% vs. mês anterior</p>
    </div>
  );
}

function PhoneMockup({
  label,
  src,
  priority = false,
  className = "",
  sizes = "(min-width: 1024px) 20rem, (min-width: 640px) 19rem, 72vw",
}: {
  label: string;
  src: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt={label}
      width={1200}
      height={2133}
      priority={priority}
      unoptimized
      draggable={false}
      className={`select-none object-contain ${className}`}
      sizes={sizes}
    />
  );
}

type StoryPhone = {
  src: string;
  alt: string;
};

function StoryVisual({
  lifestyleSrc,
  lifestyleAlt,
  phones,
  phoneSide,
  phoneOffset = "default",
  dark = false,
}: {
  lifestyleSrc: string;
  lifestyleAlt: string;
  phones: StoryPhone[];
  phoneSide: "left" | "right";
  phoneOffset?: "default" | "outward";
  dark?: boolean;
}) {
  const lifestylePosition =
    phoneSide === "right"
      ? "left-0 right-[9%] sm:right-[12%] lg:right-[14%]"
      : "left-[9%] right-0 sm:left-[12%] lg:left-[14%]";
  const phonePosition =
    phoneOffset === "outward"
      ? phoneSide === "right"
        ? "-right-[6%] sm:-right-[5%] lg:-right-[4%]"
        : "-left-[6%] sm:-left-[5%] lg:-left-[4%]"
      : phoneSide === "right"
        ? "right-0"
        : "left-0";
  const singlePhonePosition = phoneSide === "right" ? "right-0" : "left-0";
  const phoneColumnWidth =
    phones.length > 1
      ? phoneOffset === "outward"
        ? "w-[68%] sm:w-[65%] lg:w-[63%]"
        : "w-[72%] sm:w-[68%] lg:w-[66%]"
      : "w-[66%] sm:w-[62%] lg:w-[60%]";
  const edgeShade =
    phoneSide === "right"
      ? "bg-gradient-to-r from-transparent via-transparent to-[#24101a]/20"
      : "bg-gradient-to-l from-transparent via-transparent to-[#24101a]/20";

  return (
    <div className="group relative isolate mx-auto aspect-[4/5] w-full max-w-[40rem]">
      <div
        className={`absolute inset-y-[5%] overflow-hidden rounded-[1.75rem] border shadow-[0_30px_80px_rgba(58,21,34,.2)] transition duration-500 ease-out group-hover:-translate-y-1 sm:rounded-[2.25rem] ${
          dark ? "border-white/15 bg-[#2b1020]" : "border-[#d9c7cc] bg-[#f4e7d8]"
        } ${lifestylePosition}`}
      >
        <Image
          src={lifestyleSrc}
          alt={lifestyleAlt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 42vw, (min-width: 640px) 70vw, 92vw"
        />
        <div aria-hidden="true" className={`absolute inset-0 ${edgeShade}`} />
      </div>

      <div
        aria-hidden="true"
        className={`absolute bottom-[3%] z-10 h-[22%] w-[42%] rounded-full blur-2xl ${
          dark ? "bg-black/45" : "bg-[#4c1830]/20"
        } ${phonePosition}`}
      />

      <span
        className={`absolute top-[2%] z-30 rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.14em] shadow-sm backdrop-blur sm:text-[10px] ${
          dark
            ? "border-white/20 bg-[#2b1020]/85 text-[#f4e7d8]"
            : "border-white/80 bg-white/90 text-[#6f1235]"
        } ${phoneSide === "right" ? "right-[2%]" : "left-[2%]"}`}
      >
        Tela real do BalletPro
      </span>

      <div className={`absolute inset-y-0 z-20 ${phoneColumnWidth} ${phonePosition}`}>
        {phones.map((phone, index) => {
          const phoneClass =
            phones.length === 1
              ? `absolute bottom-0 h-auto w-[94%] drop-shadow-[0_24px_24px_rgba(32,13,22,.28)] transition duration-500 ease-out group-hover:-translate-y-2 sm:w-[92%] lg:w-[90%] ${singlePhonePosition}`
              : index === 0
                ? "absolute bottom-[1%] left-0 h-auto w-[80%] -rotate-[2deg] drop-shadow-[0_22px_22px_rgba(0,0,0,.38)] transition duration-500 ease-out group-hover:-translate-x-1 group-hover:-rotate-[3deg]"
                : "absolute bottom-[9%] right-0 h-auto w-[80%] rotate-[2deg] drop-shadow-[0_24px_24px_rgba(0,0,0,.42)] transition duration-500 ease-out group-hover:translate-x-1 group-hover:rotate-[3deg]";

          return (
            <PhoneMockup
              key={phone.src}
              src={phone.src}
              label={phone.alt}
              className={phoneClass}
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 36vw, 48vw"
            />
          );
        })}
      </div>
    </div>
  );
}

function TrustCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#e8e3e3] bg-white p-6">
      <h3 className="font-semibold text-[#2a1b22]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#746c70]">{text}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-2xl border border-[#e8e3e3] bg-white px-5 py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[#2a1b22]">
        {q}
        <span className="shrink-0 text-[#7A1F3D] transition group-open:rotate-45">+</span>
      </summary>
      <p className="mt-3 text-sm leading-6 text-[#746c70]">{a}</p>
    </details>
  );
}

const features = [
  { icon: Icons.students, title: "Alunas e turmas organizadas", text: "Cada aluna com ficha completa: turma, responsável, mensalidade e observações — sem procurar em conversas antigas." },
  { icon: Icons.attendance, title: "Chamada em segundos", text: "Abra a turma do dia e marque presença com poucos toques, direto do celular." },
  { icon: Icons.payments, title: "Mensalidades sozinhas", text: "O sistema gera as mensalidades do mês e marca atrasos automaticamente, todo mês, sem você lembrar." },
  { icon: Icons.whatsapp, title: "Cobrança sem constrangimento", text: "Fila de quem está pendente, mensagem já escrita, link do WhatsApp pronto. Você só confere e envia." },
];

const CHECKOUT_INICIANTE = "https://pay.cakto.com.br/36yqnbm";
const CHECKOUT_PROFISSIONAL = "https://pay.cakto.com.br/366vvu9";

const plans = [
  {
    name: "Iniciante",
    price: "R$ 37,90",
    installment: "12x de R$ 3,16",
    note: "pagamento único · até 30 alunas",
    included: ["Alunas, turmas e presença", "Mensalidades automáticas", "Cobrança manual pelo WhatsApp"],
    excluded: ["Central de cobrança completa", "Resumo diário por e-mail", "Suporte prioritário"],
    highlighted: false,
    checkoutHref: CHECKOUT_INICIANTE,
  },
  {
    name: "Profissional",
    price: "R$ 67,90",
    installment: "12x de R$ 5,66",
    note: "pagamento único · alunas ilimitadas",
    included: [
      "Alunas, turmas e presença",
      "Mensalidades automáticas",
      "Cobrança manual pelo WhatsApp",
      "Central de cobrança completa",
      "Resumo diário por e-mail",
      "Suporte prioritário",
    ],
    excluded: [],
    highlighted: true,
    checkoutHref: CHECKOUT_PROFISSIONAL,
  },
];

const faqs = [
  { q: "Preciso instalar alguma coisa?", a: "Não. O BalletPro funciona direto no navegador, do computador ou do celular. Dá pra adicionar como atalho na tela inicial do celular, sem passar por loja de aplicativos." },
  { q: "É pagamento único ou assinatura?", a: "Pagamento único. Você paga uma vez e tem acesso vitalício ao plano escolhido, sem mensalidade do sistema." },
  { q: "E se eu não gostar?", a: "Você tem 15 dias de garantia. Se achar que o BalletPro não é para você, devolvemos todo o valor pago, sem perguntas." },
  { q: "Meus dados ficam seguros?", a: "Sim. Cada studio só enxerga os próprios dados — isso é garantido no banco de dados, não só na tela. As mensalidades e cobranças passam por criptografia padrão de mercado." },
  { q: "Consigo migrar minha planilha atual?", a: "Sim, o cadastro de alunas e turmas é rápido e pode ser feito aos poucos, sem precisar migrar tudo de uma vez no primeiro dia." },
  { q: "Qual a diferença entre os planos?", a: "O Iniciante cobre o essencial para studios de até 30 alunas. O Profissional libera alunas ilimitadas, a Central de Cobrança completa e o resumo diário automático por e-mail." },
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-white text-[#2a1b22]">
      <Script id="utmify-pixel-id" strategy="afterInteractive">
        {`window.pixelId = "${UTMIFY_PIXEL_ID}";`}
      </Script>
      <Script
        id="utmify-pixel"
        strategy="afterInteractive"
        src="https://cdn.utmify.com.br/scripts/pixel/pixel.js"
        async
      />
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#e8e3e3] bg-white/90 px-5 py-4 backdrop-blur-md lg:px-8">
        <BrandLogo compact />
        <nav className="hidden gap-7 text-sm font-medium text-[#746c70] md:flex">
          <a href="#recursos" className="hover:text-[#2a1b22]">Recursos</a>
          <a href="#planos" className="hover:text-[#2a1b22]">Planos</a>
          <a href="#duvidas" className="hover:text-[#2a1b22]">Dúvidas</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-5 pb-10 pt-10 sm:pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#7A1F3D]">
            Gestão para studios de ballet
          </p>
          <h1 className="mt-4 font-display text-3xl leading-[1.12] tracking-[-.02em] sm:text-5xl">
            Pare de administrar seu studio pelo{" "}
            <span className="text-[#7A1F3D]">caderno</span> e{" "}
            <span className="text-[#7A1F3D]">WhatsApp</span>.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[#746c70]">
            Alunas, turmas, presenças e mensalidades num único sistema, com cobrança
            assistida por WhatsApp e mensalidades geradas sozinhas todo mês.
          </p>
        </div>

        <div className="relative mx-auto mt-8 max-w-sm overflow-visible sm:max-w-3xl">
          <PhoneMockup
            label="Visão geral do studio"
            src="/marketing/prints/dashboard-hero.png"
            priority
            className="relative z-10 mx-auto h-auto w-[86vw] max-w-[20rem] drop-shadow-[0_28px_35px_rgba(73,39,52,.2)] sm:w-[21rem] sm:max-w-none lg:w-[23rem]"
          />

          <FloatingStatCard className="right-[6%] top-6 block w-[7.5rem] rotate-1 sm:right-[8%] sm:top-10 sm:w-44" />

          <FloatingNotification
            title="Alerta de faltas"
            text="Camila Alves teve 3 faltas seguidas."
            time="agora"
            className="left-[4%] bottom-[13%] flex w-[9.5rem] -rotate-2 sm:left-[6%] sm:bottom-[16%] sm:w-64"
          />
          <FloatingNotification
            title="Pagamento pendente"
            text="Mensalidade de Marina vence hoje."
            time="1 min"
            className="right-[4%] bottom-[5%] flex w-[10.5rem] rotate-1 sm:right-[6%] sm:bottom-[6%] sm:w-64"
          />
        </div>

        <div className="mx-auto mt-7 flex max-w-md flex-col items-center gap-3">
          <Link
            href="#planos"
            className="w-full rounded-xl bg-[#7A1F3D] px-6 py-4 text-center text-sm font-bold tracking-wide text-white shadow-lg shadow-[#7A1F3D]/20 transition hover:bg-[#5A1730]"
          >
            QUERO ORGANIZAR MEU STUDIO
          </Link>
          <p className="text-xs text-[#746c70]">Pagamento único · acesso vitalício</p>
        </div>
      </section>

      {/* O que o app faz */}
      <section id="recursos" className="border-t border-[#e8e3e3] bg-[#f6e9ec] px-5 py-14 lg:px-8">
        <SectionHead
          eyebrow="O essencial, bem resolvido"
          title="O que o BalletPro faz por você"
          sub="Tudo o que hoje está espalhado em caderno, planilha e WhatsApp, organizado num só lugar."
        />
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} text={f.text} />
          ))}
        </div>
      </section>

      {/* Destaque: Mensalidades */}
      <section className="relative overflow-hidden px-5 py-16 sm:py-20 lg:px-8 lg:py-24">
        <div aria-hidden="true" className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-[#f2dfe5]/60 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[.82fr_1.18fr] lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#7A1F3D]">Mensalidades</p>
            <h2 className="mt-3 font-display text-2xl leading-tight sm:text-3xl">
              Pagamentos gerados sozinhos, todo mês.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#746c70] sm:text-base sm:leading-7">
              O sistema gera as mensalidades do mês automaticamente e marca atrasos sem
              você precisar lembrar. Exporte tudo em CSV quando quiser prestar contas.
            </p>
            <Link
              href="#planos"
              className="mt-5 inline-block rounded-xl bg-[#7A1F3D] px-6 py-3.5 text-sm font-bold tracking-wide text-white transition hover:bg-[#5A1730]"
            >
              Ver como funciona
            </Link>
          </div>
          <StoryVisual
            lifestyleSrc="/marketing/lifestyle/mensalidades-lifestyle-ilustrado-v1.png"
            lifestyleAlt="Ilustração editorial de uma proprietária de studio de ballet com a rotina financeira organizada"
            phoneSide="right"
            phones={[
              {
                src: "/marketing/prints/mensalidades-lista.png",
                alt: "Tela real de mensalidades do BalletPro",
              },
            ]}
          />
        </div>
      </section>

      {/* Destaque: Cobrança (invertido, fundo escuro) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#24101a] via-[#381522] to-[#160a10] px-5 py-16 text-white sm:py-20 lg:px-8 lg:py-24">
        <div aria-hidden="true" className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-[#8c78a8]/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.18fr_.82fr] lg:gap-16">
          <div className="lg:order-2">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#e4c4ce]">
              Central de cobrança
            </p>
            <h2 className="mt-3 font-display text-2xl leading-tight sm:text-3xl">
              Cobrar quem está atrasado, sem constrangimento.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#ead9df] sm:text-base sm:leading-7">
              Uma fila com quem está pendente ou atrasado, mensagem já escrita e o link
              do WhatsApp pronto. Você só confere e envia.
            </p>
            <Link
              href="#planos"
              className="mt-5 inline-block rounded-xl bg-[#06a742] px-6 py-3.5 text-sm font-bold tracking-wide text-white transition hover:bg-[#048a37]"
            >
              Conhecer os planos
            </Link>
          </div>
          <div className="lg:order-1">
            <StoryVisual
              lifestyleSrc="/marketing/lifestyle/cobranca-lifestyle-ilustrado-v1.png"
              lifestyleAlt="Ilustração editorial da proprietária acompanhando uma aula enquanto o BalletPro organiza as cobranças"
              phoneSide="left"
              phoneOffset="outward"
              dark
              phones={[
                {
                  src: "/marketing/prints/cobranca-fila.png",
                  alt: "Tela real da fila de cobrança do BalletPro",
                },
                {
                  src: "/marketing/prints/cobranca-whatsapp.png",
                  alt: "Mensagem de cobrança preparada para o WhatsApp",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Destaque: Presença + resumo diário */}
      <section className="relative overflow-hidden bg-[#fbf8f4] px-5 py-16 sm:py-20 lg:px-8 lg:py-24">
        <div aria-hidden="true" className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-[#c98242]/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[.82fr_1.18fr] lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#7A1F3D]">Automação</p>
            <h2 className="mt-3 font-display text-2xl leading-tight sm:text-3xl">
              Chamada em segundos e um resumo todo dia.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#746c70] sm:text-base sm:leading-7">
              Marque presença com poucos toques direto do celular. E receba, todo dia
              por e-mail, o resumo de recebido, pendente, atrasado e alunas com faltas
              seguidas — sem precisar abrir o sistema.
            </p>
            <Link
              href="#planos"
              className="mt-5 inline-block rounded-xl bg-[#7A1F3D] px-6 py-3.5 text-sm font-bold tracking-wide text-white transition hover:bg-[#5A1730]"
            >
              Quero organizar meu studio
            </Link>
          </div>
          <StoryVisual
            lifestyleSrc="/marketing/lifestyle/automacao-lifestyle-ilustrado-v1.png"
            lifestyleAlt="Ilustração editorial da proprietária abrindo o studio com a rotina do dia organizada"
            phoneSide="right"
            phones={[
              {
                src: "/marketing/prints/resumo-diario.png",
                alt: "Resumo diário real enviado pelo BalletPro",
              },
            ]}
          />
        </div>
      </section>

      {/* Confiança */}
      <section className="border-t border-[#e8e3e3] bg-[#fbeedd] px-5 py-14 lg:px-8">
        <SectionHead
          eyebrow="Segurança"
          title="O BalletPro nunca mexe no seu dinheiro"
          sub="O sistema organiza a cobrança, mas o pagamento continua acontecendo do jeito que já acontece hoje — direto entre você e a família."
        />
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
          <TrustCard title="Só leitura, zero transações" text="O BalletPro nunca movimenta dinheiro. Ele organiza dados, não faz cobranças automáticas de cartão ou PIX." />
          <TrustCard title="Isolamento total por studio" text="Cada studio só enxerga os próprios dados — garantido no banco de dados, não apenas na tela." />
          <TrustCard title="Você decide quando enviar" text="A cobrança pelo WhatsApp é sempre revisada por você antes de enviar. Nada sai sozinho." />
          <TrustCard title="Backup automático" text="Seus dados de alunas, turmas e mensalidades ficam salvos com segurança, sem depender de planilha ou caderno." />
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="bg-gradient-to-br from-[#2d101b] via-[#3a1522] to-[#1a0a11] px-5 py-14 lg:px-8">
        <SectionHead
          eyebrow="Pagamento único"
          title="Escolha o plano do tamanho do seu studio"
          sub="Sem mensalidade do sistema. Você paga uma vez e tem acesso vitalício."
          dark
        />
        <div className="mx-auto mt-10 grid max-w-3xl items-center gap-6 sm:grid-cols-2 sm:gap-5">
          {plans.map((plan) =>
            plan.highlighted ? (
              <div
                key={plan.name}
                className="relative rounded-2xl border-2 border-[#A9834F] bg-white p-8 text-center shadow-[0_30px_70px_rgba(0,0,0,.35)] sm:scale-105"
              >
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#A9834F] px-4 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  ⭐ O mais escolhido
                </span>
                <p className="text-sm font-semibold text-[#2a1b22]">{plan.name}</p>
                <p className="mt-1 text-xs text-[#746c70]">{plan.note}</p>
                <p className="mt-3 text-4xl font-semibold text-[#06a742]">{plan.price}</p>
                <p className="mt-1 text-xs text-[#2a1b22]">
                  ou <b className="font-bold text-[#06a742]">{plan.installment}</b>
                </p>
                <PhoneMockup
                  label="Visão geral do studio no BalletPro"
                  src="/marketing/prints/dashboard-hero.png"
                  className="mx-auto mt-5 h-auto w-40 drop-shadow-[0_20px_30px_rgba(73,39,52,.25)]"
                />
                <ul className="mt-6 space-y-2.5 text-left">
                  {plan.included.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#4d4549]">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#06a742] text-[9px] font-bold text-white">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.checkoutHref}
                  className="mt-7 block rounded-xl bg-[#06a742] px-5 py-3.5 text-center text-sm font-bold tracking-wide text-white transition hover:bg-[#048a37]"
                >
                  QUERO ORGANIZAR MEU STUDIO
                </Link>
                <p className="mt-3 text-[11px] text-[#a39a9d]">🔒 Compra segura · garantia de 15 dias</p>
              </div>
            ) : (
              <div
                key={plan.name}
                className="rounded-2xl border border-white/15 bg-white/5 p-7 text-left text-white backdrop-blur-sm"
              >
                <p className="text-sm font-semibold text-white">{plan.name}</p>
                <p className="mt-1 text-xs text-[#ead9df]/70">{plan.note}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{plan.price}</p>
                <p className="mt-1 text-xs text-[#ead9df]">
                  ou <b className="font-bold text-[#7ee6a3]">{plan.installment}</b>
                </p>
                <ul className="mt-6 space-y-2.5">
                  {plan.included.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#ead9df]">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#06a742] text-[9px] font-bold text-white">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                  {plan.excluded.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#ead9df]/50">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#b3374a] text-[9px] font-bold text-white">
                        ✕
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.checkoutHref}
                  className="mt-7 block rounded-xl border border-white/25 px-5 py-3.5 text-center text-sm font-bold tracking-wide text-white transition hover:border-white/50"
                >
                  Começar
                </Link>
              </div>
            )
          )}
        </div>
      </section>

      {/* Garantia */}
      <section className="border-t border-[#e8e3e3] bg-white px-5 py-14 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Image
            src="/marketing/garantia-15-dias.webp"
            alt="Selo de garantia de 15 dias"
            width={260}
            height={260}
            className="h-56 w-56 sm:h-64 sm:w-64"
          />
          <h2 className="mt-5 font-display text-2xl leading-tight sm:text-3xl">
            Risco zero: você tem 15 dias para testar
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-[#746c70] sm:text-base sm:leading-7">
            Pode adquirir hoje e usar com calma no seu studio. Se em até{" "}
            <strong className="text-[#2a1b22]">15 dias</strong> você achar que
            o BalletPro não é para você, devolvo todo o seu dinheiro — sem
            perguntas.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="duvidas" className="border-t border-[#e8e3e3] bg-[#f6e9ec] px-5 py-14 lg:px-8">
        <SectionHead eyebrow="Dúvidas" title="Dúvidas? A gente responde" />
        <div className="mx-auto mt-8 max-w-2xl space-y-3">
          {faqs.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-gradient-to-br from-[#2d101b] via-[#3a1522] to-[#1a0a11] px-5 py-16 text-center text-white lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#e4c4ce]">BalletPro</p>
        <h2 className="mx-auto mt-3 max-w-lg font-display text-3xl leading-tight sm:text-4xl">
          Pronto para organizar seu studio?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-[#ead9df] sm:text-base">
          Pagamento único, acesso vitalício. Comece hoje.
        </p>
        <Link
          href="#planos"
          className="mt-7 inline-block rounded-xl bg-[#06a742] px-8 py-4 text-sm font-bold tracking-wide text-white transition hover:bg-[#048a37]"
        >
          QUERO ORGANIZAR MEU STUDIO
        </Link>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-8 text-xs text-[#746c70] sm:flex-row lg:px-8">
        <BrandLogo />
        <span>Gestão feita para studios de ballet</span>
      </footer>
    </main>
  );
}
