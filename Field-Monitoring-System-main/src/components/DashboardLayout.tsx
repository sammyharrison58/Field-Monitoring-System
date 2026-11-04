import Sidebar from "./Sidebar";
import Header from "./Header";
import { SidebarProvider } from "@/lib/sidebar-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="app-container">
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header />
          <main className="main-content min-h-screen">
            <div className="animate-fade-in">
               {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
