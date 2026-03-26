const timeline = [
  { id: 1, content: 'Order #1024', target: 'Fulfilled', date: 'Just now', time: '10:45 AM', iconBg: 'bg-green-500' },
  { id: 2, content: 'Driver matching for', target: 'Order #1025', date: '5 mins ago', time: '10:40 AM', iconBg: 'bg-blue-500' },
  { id: 3, content: 'Exception for', target: 'Order #1012', date: '15 mins ago', time: '10:30 AM', iconBg: 'bg-[#FF9933]' },
  { id: 4, content: 'Order #1026', target: 'Delayed', date: '30 mins ago', time: '10:15 AM', iconBg: 'bg-[#FF9933]' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function RecentActivity() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-black/5 flex flex-col h-full">
      <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Activity</h3>
      </div>
      <div className="p-6">
        <ul role="list" className="-mb-8">
          {timeline.map((event, eventIdx) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== timeline.length - 1 ? (
                  <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={classNames(event.iconBg, 'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white')} />
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        {event.content} <span className="font-medium text-gray-900">{event.target}</span>
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <div>{event.date}</div>
                      <div className="text-xs">{event.time}</div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
