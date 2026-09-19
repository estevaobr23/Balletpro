"use client";

import { Button } from "@/components/ui/button";

export function DeactivateStudentButton() {
  return <Button type="submit" variant="danger" size="sm" className="w-full" onClick={(event) => { if (!window.confirm("Desativar esta aluna? O histórico de pagamentos e presenças será preservado.")) event.preventDefault(); }}>Desativar aluna</Button>;
}
