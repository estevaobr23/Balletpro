import type { PaymentStatus, AttendanceStatus } from "@/lib/types/database";

const paymentStyles: Record<PaymentStatus, string> = {
  pago: "bg-green-50 text-success border-green-200",
  pendente: "bg-amber-50 text-warning border-amber-200",
  atrasado: "bg-red-50 text-danger border-red-200",
};

const paymentLabels: Record<PaymentStatus, string> = {
  pago: "Pago",
  pendente: "Pendente",
  atrasado: "Atrasado",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${paymentStyles[status]}`}
    >
      {paymentLabels[status]}
    </span>
  );
}

const attendanceStyles: Record<AttendanceStatus, string> = {
  presente: "bg-green-50 text-success border-green-200",
  faltou: "bg-red-50 text-danger border-red-200",
  justificada: "bg-amber-50 text-warning border-amber-200",
};

const attendanceLabels: Record<AttendanceStatus, string> = {
  presente: "Presente",
  faltou: "Faltou",
  justificada: "Justificada",
};

export function AttendanceStatusBadge({ status }: { status: AttendanceStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${attendanceStyles[status]}`}
    >
      {attendanceLabels[status]}
    </span>
  );
}
