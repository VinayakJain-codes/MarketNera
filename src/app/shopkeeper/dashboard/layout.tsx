import ShopkeeperSidebar from "@/components/layout/ShopkeeperSidebar";
import ShopkeeperBottomNav from "@/components/layout/ShopkeeperBottomNav";

export default function ShopkeeperDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--dash-bg)] font-display text-[var(--dash-text)]">
      <ShopkeeperSidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden pb-[68px] md:pb-0 relative">
        {children}
      </main>
      <ShopkeeperBottomNav />
    </div>
  );
}
