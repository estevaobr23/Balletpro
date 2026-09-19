import Link from "next/link";
import { signUp } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <>
      <h1 className="text-xl font-semibold text-ink-900">Criar sua conta</h1>
      <p className="mt-1 text-sm text-ink-500">
        Comece a organizar seu studio agora.
      </p>

      {erro && (
        <p className="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-danger">
          {erro}
        </p>
      )}

      <form action={signUp} className="mt-6 flex flex-col gap-4">
        <Input label="Seu nome" name="nome" required placeholder="Ana Souza" />
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
          autoComplete="new-password"
          required
          minLength={6}
          placeholder="Mínimo 6 caracteres"
        />
        <Button type="submit" className="mt-2 w-full">
          Criar conta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-rose-600 hover:underline">
          Entrar
        </Link>
      </p>
    </>
  );
}
