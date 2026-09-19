"use client";

import { AttendanceStatusBadge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { formatDate, whatsappLink } from "@/lib/utils/format";
import { renderAbsenceMessage } from "@/lib/utils/absence-message";
import type { AttendanceStatus } from "@/lib/types/database";

interface AttendanceRecord {
  data: string;
  status: AttendanceStatus;
}

export function AttendanceHistory({
  records,
  alunaNome,
  responsavelNome,
  telefoneResponsavel,
  turmaNome,
}: {
  records: AttendanceRecord[];
  alunaNome: string;
  responsavelNome: string | null;
  telefoneResponsavel: string | null;
  turmaNome: string;
}) {
  return (
    <ul className="divide-y divide-neutral-100">
      {records.map((record, index) => {
        const faltou = record.status === "faltou";
        const whatsapp =
          faltou && telefoneResponsavel
            ? whatsappLink(
                telefoneResponsavel,
                renderAbsenceMessage({
                  alunaNome,
                  responsavelNome,
                  turmaNome,
                  dataFalta: record.data,
                })
              )
            : null;

        return (
          <li
            key={`${record.data}-${index}`}
            className="flex items-center justify-between gap-3 px-4 py-3"
          >
            <span className="text-sm text-ink-700">{formatDate(record.data)}</span>
            <div className="flex items-center gap-2">
              <AttendanceStatusBadge status={record.status} />
              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-7 items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 text-xs font-semibold text-green-700 hover:bg-green-100"
                >
                  <Icons.whatsapp className="h-3.5 w-3.5" />
                  Perguntar
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
