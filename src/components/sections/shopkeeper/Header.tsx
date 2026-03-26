import Link from "next/link";
import { Bell, ChevronRight, Moon, Sun, User } from "lucide-react";

export default function ShopkeeperHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm font-medium text-gray-500">
        <Link href="/shopkeeper" className="hover:text-[#FF9933] transition-colors">
          Shopkeeper
        </Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span className="text-gray-900">Dashboard</span>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        {/* Date Picker Placeholder */}
        <div className="hidden md:flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 shadow-sm">
          <span>Today, Mar 25</span>
        </div>

        {/* Theme Toggle */}
        <button className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-[#FF9933] transition-colors">
          <Sun className="h-5 w-5" />
          <span className="sr-only">Toggle theme</span>
        </button>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-[#FF9933] transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#138808]"></span>
          <span className="sr-only">Notifications</span>
        </button>

        {/* Profile */}
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:ring-2 hover:ring-[#FF9933] hover:ring-offset-2 transition-all">
          <User className="h-5 w-5" />
          <span className="sr-only">Profile</span>
        </button>
      </div>
    </header>
  );
}
