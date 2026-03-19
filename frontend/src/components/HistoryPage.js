import React from "react";
import { IoTimeOutline } from "react-icons/io5";
import { FaBus } from "react-icons/fa";

const mockHistory = [
  { id: 1, bus: "Bus 42", route: "Downtown Loop", date: "Today, 8:30 AM", status: "Completed" },
  { id: 2, bus: "Bus 77", route: "Midtown Express", date: "Today, 7:15 AM", status: "Completed" },
  { id: 3, bus: "Bus 13", route: "Downtown Loop", date: "Yesterday, 5:45 PM", status: "Completed" },
  { id: 4, bus: "Bus 42", route: "Downtown Loop", date: "Yesterday, 8:20 AM", status: "Cancelled" },
];

export default function HistoryPage() {
  return (
    <div className="h-full bg-gray-50 pt-6 pb-24 px-4 overflow-y-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-5 text-center">Trip History</h1>
      <div className="space-y-3">
        {mockHistory.map((trip) => (
          <div key={trip.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <FaBus size={18} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm">{trip.bus}</p>
              <p className="text-gray-400 text-xs truncate">{trip.route}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-gray-400 text-xs">{trip.date}</p>
              <span className={`text-xs font-semibold ${trip.status === "Completed" ? "text-emerald-500" : "text-red-400"}`}>
                {trip.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
