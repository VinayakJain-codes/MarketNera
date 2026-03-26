import { ArrowDownIcon, ArrowUpIcon, ShoppingBag, Truck, DollarSign, Users, Clock, Star } from "lucide-react";

const metrics = [
  {
    title: "Total Sales",
    value: "1,284",
    trend: "+12%",
    trendUp: true,
    icon: ShoppingBag,
  },
  {
    title: "On-Time Fulfillment",
    value: "94.2%",
    trend: "+1.5%",
    trendUp: true,
    icon: Truck,
  },
  {
    title: "Avg. Order Value",
    value: "$4.50",
    trend: "-3%",
    trendUp: false,
    icon: DollarSign,
  },
  {
    title: "Active Drivers",
    value: "42",
    trend: "Live",
    trendNeutral: true,
    icon: Users,
  },
  {
    title: "Pending Orders",
    value: "156",
    trend: "Action Required",
    trendNeutral: true,
    icon: Clock,
  },
  {
    title: "Customer Satisfaction",
    value: "4.8/5",
    trend: "Stable",
    trendNeutral: true,
    icon: Star,
  },
];

export default function MetricsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => (
        <div
          key={metric.title}
          className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm ring-1 ring-black/5"
        >
          <dt>
            <div className="absolute rounded-md bg-orange-50 p-3">
              <metric.icon className="h-6 w-6 text-[#FF9933]" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">{metric.title}</p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
            <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
            <p
              className={`ml-2 flex items-baseline text-sm font-semibold
                ${metric.trendNeutral ? "text-gray-500" : (metric.trendUp ? "text-[#138808]" : "text-[#FF9933]")}
              `}
            >
              {!metric.trendNeutral && (
                metric.trendUp ? (
                  <ArrowUpIcon className="h-4 w-4 shrink-0 self-center text-[#138808]" aria-hidden="true" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 shrink-0 self-center text-[#FF9933]" aria-hidden="true" />
                )
              )}
              <span className={metric.trendNeutral ? "" : "ml-1"}>{metric.trend}</span>
            </p>
          </dd>
        </div>
      ))}
    </div>
  );
}
