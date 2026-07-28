import { CompanyShell } from "@/components/company-shell";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <CompanyShell>{children}</CompanyShell>;
}
