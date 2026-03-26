import { TrendingUp, TrendingDown } from "lucide-react";

const financials = [
  { name: "Total Revenue", stat: "$0", previousStat: "$0", change: "0%", changeType: "increase" },
  { name: "Total Costs", stat: "$0", previousStat: "$0", change: "0%", changeType: "decrease" },
  { name: "Net Profit Margin", stat: "0%", previousStat: "0%", change: "0%", changeType: "increase" },
];

export default function FinancialOverview() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-black/5">
      <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Financial Overview</h3>
      </div>
      <dl className="grid grid-cols-1 divide-y divide-gray-200 overflow-hidden sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {financials.map((item) => (
          <div key={item.name} className="px-4 py-5 sm:p-6">
            <dt className="text-base font-normal text-gray-900">{item.name}</dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="flex items-baseline text-2xl font-semibold text-[#FF9933]">
                {item.stat}
              </div>
              <div
                className={`inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0
                  ${item.changeType === "increase" ? "bg-green-100 text-[#138808]" : "bg-orange-100 text-orange-800"}
                `}
              >
                {item.changeType === "increase" ? (
                  <TrendingUp className="-ml-1 mr-0.5 h-4 w-4 shrink-0 self-center text-[#138808]" aria-hidden="true" />
                ) : (
                  <TrendingDown className="-ml-1 mr-0.5 h-4 w-4 shrink-0 self-center text-orange-800" aria-hidden="true" />
                )}
                <span className="sr-only"> {item.changeType === "increase" ? "Increased" : "Decreased"} by </span>
                {item.change}
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
