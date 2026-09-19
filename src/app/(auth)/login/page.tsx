import Link from "next/link";
import { signIn } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <>
      <h1 className="text-xl font-semibold text-ink-900">Entrar no BalletPro</h1>
      <p className="mt-1 text-sm text-ink-500">
        Acesse o painel do seu studio.
      </p>

      {erro && (
        <p className="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-danger">
          {erro}
        </p>
      )}

      <form action={signIn} className="mt-6 flex flex-col gap-4">
        <Input
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="voce@studio.com"
        />
        <Input
          label="Senha"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
        <Button type="submit" className="mt-2 w-full">
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-rose-600 hover:underline">
          Criar conta
        </Link>
      </p>
    </>
  );
}
