import { Package, CheckCircle, AlertTriangle, XCircle, Clock, RotateCcw } from "lucide-react";

const statuses = [
  { name: "In Transit", count: 0, icon: Truck, color: "text-blue-600", bg: "bg-blue-50" },
  { name: "Fulfilled Today", count: 0, icon: CheckCircle, color: "text-[#138808]", bg: "bg-green-50" },
  { name: "Delayed", count: 0, icon: Clock, color: "text-[#FF9933]", bg: "bg-orange-50" },
  { name: "Failed", count: 0, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
  { name: "Exception", count: 0, icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-50" },
  { name: "Attempted", count: 0, icon: RotateCcw, color: "text-gray-600", bg: "bg-gray-50" },
];

function Truck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
      <path d="M14 9h4l4 4v5c0 .6-.4 1-1 1h-2" />
      <circle cx="7" cy="18" r="2" />
      <path d="M15 18H9" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

export default function FulfillmentStatus() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Fulfillment Status</h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statuses.map((status) => (
          <div key={status.name} className={`flex items-center p-3 rounded-lg border border-gray-50 ${status.bg}`}>
            <status.icon className={`h-5 w-5 ${status.color} mr-3`} />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">{status.count}</span>
              <span className="text-xs text-gray-600">{status.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
