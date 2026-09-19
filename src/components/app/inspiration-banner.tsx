"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/ui/brand-logo";

const SLIDES = [
  {
    image: "/banners/dashboard-ballet-01.webp",
    eyebrow: "Sua rotina em movimento",
    quote: "Organização também faz parte da dança.",
    description: "Quando a gestão flui, sobra mais tempo para ensinar.",
  },
  {
    image: "/banners/dashboard-ballet-02.webp",
    eyebrow: "Um passo de cada vez",
    quote: "Cada passo de hoje prepara o espetáculo de amanhã.",
    description: "Cuide do presente do seu studio e construa o próximo palco.",
  },
] as const;

export function InspirationBanner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(
      () => setCurrent((index) => (index + 1) % SLIDES.length),
      8000,
    );
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section
      className="relative min-h-[210px] overflow-hidden rounded-2xl bg-rose-900 shadow-[0_18px_45px_rgba(90,23,48,.16)] sm:min-h-[230px]"
      aria-label="Inspiração BalletPro"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {SLIDES.map((slide, index) => (
        <div
          key={slide.image}
          aria-hidden={current !== index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            current === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt="Bailarinas profissionais dançando"
            fill
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, 1280px"
            className="object-cover object-[64%_center] sm:object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(61,15,33,.96)_0%,rgba(90,23,48,.88)_35%,rgba(90,23,48,.28)_68%,rgba(42,27,34,.08)_100%)]" />
          <div className="relative z-10 flex min-h-[210px] max-w-xl flex-col justify-center px-5 py-6 sm:min-h-[230px] sm:px-8">
            <BrandLogo light className="mb-3 scale-90 origin-left sm:scale-100" />
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#D5B47B]">
              {slide.eyebrow}
            </p>
            <h2 className="mt-1.5 max-w-md font-display text-2xl font-semibold leading-tight tracking-[-.025em] text-white sm:text-3xl">
              {slide.quote}
            </h2>
            <p className="mt-2 hidden text-sm text-white/75 sm:block">
              {slide.description}
            </p>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-5 z-20 flex items-center gap-2 sm:left-8">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => setCurrent(index)}
            aria-label={`Mostrar banner ${index + 1}`}
            aria-current={current === index ? "true" : undefined}
            className={`h-1.5 rounded-full transition-all ${
              current === index ? "w-7 bg-[#D5B47B]" : "w-2 bg-white/55 hover:bg-white"
            }`}
          />
        ))}
      </div>
      <span className="absolute bottom-4 right-5 z-20 text-[10px] font-semibold uppercase tracking-[.16em] text-white/60 sm:right-8">
        BalletPro
      </span>
    </section>
  );
}
