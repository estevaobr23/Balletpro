import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>;
}

export const Icons = {
  home: (p: IconProps) => <Icon {...p}><path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10M9 21v-7h6v7"/></Icon>,
  students: (p: IconProps) => <Icon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></Icon>,
  classes: (p: IconProps) => <Icon {...p}><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></Icon>,
  attendance: (p: IconProps) => <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></Icon>,
  payments: (p: IconProps) => <Icon {...p}><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M7 15h2"/></Icon>,
  plus: (p: IconProps) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>,
  download: (p: IconProps) => <Icon {...p}><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M5 20h14"/></Icon>,
  arrow: (p: IconProps) => <Icon {...p}><path d="m9 18 6-6-6-6"/></Icon>,
  clock: (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>,
  check: (p: IconProps) => <Icon {...p}><path d="m5 12 4 4L19 6"/></Icon>,
  alert: (p: IconProps) => <Icon {...p}><path d="M10.3 3.2 2.6 17a2 2 0 0 0 1.8 3h15.2a2 2 0 0 0 1.8-3L13.7 3.2a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></Icon>,
  whatsapp: (p: IconProps) => <Icon {...p}><path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.4-4.7a8.5 8.5 0 1 1 16.1-4.2Z"/><path d="M8.2 7.8c.4 3.7 2.3 5.5 6 6"/></Icon>,
  search: (p: IconProps) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></Icon>,
  edit: (p: IconProps) => <Icon {...p}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></Icon>,
  user: (p: IconProps) => <Icon {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c1.2-4 4.5-6 8-6s6.8 2 8 6"/></Icon>,
  megaphone: (p: IconProps) => <Icon {...p}><path d="M3 11v2a2 2 0 0 0 2 2h1l2 5 2-1-1.6-4H9l9 4V5l-9 4H5a2 2 0 0 0-2 2Z"/></Icon>,
};
