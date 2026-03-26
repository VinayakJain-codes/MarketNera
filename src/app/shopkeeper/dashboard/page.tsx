import MetricsGrid from "@/components/sections/shopkeeper/MetricsGrid";
import FulfillmentStatus from "@/components/sections/shopkeeper/FulfillmentStatus";
import ActiveOrders from "@/components/sections/shopkeeper/ActiveOrders";
import RecentActivity from "@/components/sections/shopkeeper/RecentActivity";
import PerformanceChart from "@/components/sections/shopkeeper/PerformanceChart";
import DriverPerformance from "@/components/sections/shopkeeper/DriverPerformance";
import FinancialOverview from "@/components/sections/shopkeeper/FinancialOverview";
import SupportTickets from "@/components/sections/shopkeeper/SupportTickets";

export default function ShopkeeperDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your store operations, orders, and performance.</p>
      </div>
      
      {/* Grid wrapper for dashboard components */}
      <div className="flex flex-col gap-8">
        
        {/* Row 1: Metrics */}
        <MetricsGrid />

        {/* Row 2: Status & Performance */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <FulfillmentStatus />
          </div>
          <div className="lg:col-span-2">
            <PerformanceChart />
          </div>
        </div>

        {/* Row 3: Active Orders & Recent Activity */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActiveOrders />
          </div>
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>

        {/* Row 4: Financials */}
        <FinancialOverview />

        {/* Row 5: Drivers & Support */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="lg:col-span-1">
            <DriverPerformance />
          </div>
          <div className="lg:col-span-1">
            <SupportTickets />
          </div>
        </div>

      </div>
    </div>
  );
}


