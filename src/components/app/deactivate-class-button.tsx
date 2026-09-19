"use client";
import { Button } from "@/components/ui/button";
export function DeactivateClassButton() { return <Button type="submit" variant="danger" size="sm" className="w-full" onClick={(event) => { if (!window.confirm("Desativar esta turma? As alunas e o histórico serão preservados.")) event.preventDefault(); }}>Desativar turma</Button>; }
