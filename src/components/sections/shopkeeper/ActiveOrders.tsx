import { CheckCircle, Clock } from "lucide-react";

const orders = [
  { id: "#ORD-1024", customer: "Sarah Jenkins", eta: "10 mins", status: "In Transit", courier: "Mike D.", color: "text-blue-700 bg-blue-50 ring-blue-600/20" },
  { id: "#ORD-1025", customer: "David Chen", eta: "-", status: "Fulfilled", courier: "Sarah T.", color: "text-[#138808] bg-green-50 ring-green-600/20" },
  { id: "#ORD-1026", customer: "Emma Wilson", eta: "35 mins", status: "Delayed", courier: "John R.", color: "text-[#FF9933] bg-orange-50 ring-[#FF9933]/20" },
  { id: "#ORD-1027", customer: "James Smith", eta: "5 mins", status: "In Transit", courier: "Mike D.", color: "text-blue-700 bg-blue-50 ring-blue-600/20" },
];

export default function ActiveOrders() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-black/5 flex flex-col h-full">
      <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Active Orders</h3>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#F9FAFB]">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order ID</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">ETA</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Courier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{order.id}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.customer}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.eta}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${order.color}`}>
                    {order.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.courier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
