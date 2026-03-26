import ShopkeeperHeader from "@/components/sections/shopkeeper/Header";

export default function ShopkeeperDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F9FAFB] font-display text-gray-900">
      <ShopkeeperHeader />
      <main className="flex-1 overflow-x-hidden pt-6">
        {children}
      </main>
    </div>
  );
}
