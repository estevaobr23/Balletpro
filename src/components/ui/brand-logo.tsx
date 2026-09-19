import Image from "next/image";

export function BrandLogo({
  compact = false,
  light = false,
  className = "",
}: {
  compact?: boolean;
  light?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label="BalletPro">
      <Image
        src={light ? "/brand/balletpro-mark-white.svg" : "/brand/balletpro-mark.svg"}
        alt=""
        width={40}
        height={40}
        className="h-9 w-9 shrink-0"
        priority
      />
      {!compact && (
        <span className={`font-display text-2xl font-semibold tracking-[-0.04em] ${light ? "text-white" : "text-[#7A1F3D]"}`}>
          BalletPro
        </span>
      )}
    </span>
  );
}
