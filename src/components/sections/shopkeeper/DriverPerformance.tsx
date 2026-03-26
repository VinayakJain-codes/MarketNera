import { Star } from "lucide-react";

const drivers = [
  { name: "John Doe", onTime: "98%", rating: 4.9, deliveries: 124 },
  { name: "Jane Smith", onTime: "95%", rating: 4.7, deliveries: 98 },
  { name: "Robert Taylor", onTime: "92%", rating: 4.5, deliveries: 156 },
  { name: "Alice Brown", onTime: "99%", rating: 5.0, deliveries: 210 },
];

export default function DriverPerformance() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-black/5 flex flex-col h-full">
      <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Driver Performance</h3>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#F9FAFB]">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Driver</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">On-Time %</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rating</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Deliveries</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {drivers.map((driver) => (
              <tr key={driver.name} className="hover:bg-gray-50 transition-colors">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{driver.name}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-[#138808] font-medium">{driver.onTime}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 flex items-center">
                  <Star className="w-4 h-4 text-[#FF9933] mr-1" fill="currentColor" /> {driver.rating}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{driver.deliveries}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
