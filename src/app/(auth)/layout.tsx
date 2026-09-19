import Link from "next/link";

import { BrandLogo } from "@/components/ui/brand-logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-rose-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <BrandLogo />
        </Link>
        <div className="rounded-2xl border border-rose-100 bg-white p-8 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
