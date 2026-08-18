import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (


      <TooltipProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />

          <SidebarInset>
            <SiteHeader />

            <main className="flex flex-1 flex-col px-4 py-[2rem] md:px-6 lg:px-8">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
  );
}