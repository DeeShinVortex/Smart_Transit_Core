import React from "react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

const mockMessages = [
  { id: 1, from: "Todd Cooper", msg: "Arriving in 5 minutes at Central Station", time: "8:25 AM", unread: true },
  { id: 2, from: "Maria Santos", msg: "Route delayed due to traffic on 5th Ave", time: "7:50 AM", unread: false },
  { id: 3, from: "System", msg: "Bus 13 is now crowded. Consider next bus.", time: "Yesterday", unread: false },
];

export default function MessagesPage() {
  return (
    <div className="h-full bg-gray-50 pt-6 pb-24 px-4 overflow-y-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-5 text-center">Messages</h1>
      <div className="space-y-3">
        {mockMessages.map((m) => (
          <div key={m.id} className={`bg-white rounded-2xl p-4 shadow-sm ${m.unread ? "border-l-4 border-blue-500" : ""}`}>
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-gray-800 text-sm">{m.from}</p>
              <span className="text-gray-400 text-xs">{m.time}</span>
            </div>
            <p className="text-gray-500 text-xs">{m.msg}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
