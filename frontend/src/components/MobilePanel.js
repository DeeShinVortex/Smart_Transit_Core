import React, { useState } from "react";
import Dashboard from "./Dashboard";
import RouteSelector from "./RouteSelector";

/**
 * Slide-up panel for mobile — mimics Uber/Citymapper bottom sheet.
 * Collapsed: shows a drag handle + peek content.
 * Expanded: shows full dashboard.
 */
export default function MobilePanel() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out ${
        expanded ? "translate-y-0" : "translate-y-[calc(100%-80px)]"
      }`}
      style={{ maxHeight: "70vh" }}
    >
      {/* Drag handle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex justify-center pt-3 pb-2"
        aria-label={expanded ? "Collapse panel" : "Expand panel"}
      >
        <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
      </button>

      {/* Peek content when collapsed */}
      {!expanded && (
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-500 text-center">
            Tap to see bus details
          </p>
        </div>
      )}

      {/* Full content when expanded */}
      {expanded && (
        <div className="px-4 pb-6 overflow-y-auto" style={{ maxHeight: "calc(70vh - 60px)" }}>
          <RouteSelector />
          <Dashboard />
        </div>
      )}
    </div>
  );
}
