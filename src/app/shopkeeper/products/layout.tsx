import ShopkeeperSidebar from "@/components/layout/ShopkeeperSidebar";

export default function ShopkeeperProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--dash-bg)] font-display text-[var(--dash-text)]">
      <ShopkeeperSidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
