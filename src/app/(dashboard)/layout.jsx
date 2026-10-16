import { DashboardShell } from "@/components/dashboard/DashboardShell";

/**
 * Chrome for the signed-in app: `/dashboard` and every page under it.
 *
 * Its own route group, so it inherits none of the marketing site's header or
 * footer. The shell (the sidebar and the panel beside it) fills the window
 * edge to edge; each page renders only what goes in the panel.
 */
export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}
