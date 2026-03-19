import React, { useEffect, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import AuthPage from "./components/AuthPage";
import useTracking from "./hooks/useWebSocket";
import useTrackingStore from "./store";
import useAuthStore from "./hooks/useAuth";
import { fetchRoutes } from "./services/api";
import MapView from "./components/MapView";
import TopStatusCard from "./components/TopStatusCard";
import BottomDriverCard from "./components/BottomDriverCard";
import BottomTabBar from "./components/BottomTabBar";
import Notifications from "./components/Notifications";
import HistoryPage from "./components/HistoryPage";
import MessagesPage from "./components/MessagesPage";
import ProfilePage from "./components/ProfilePage";

function TrackerApp() {
  useTracking();
  const setRoutes = useTrackingStore((s) => s.setRoutes);
  const [activeTab, setActiveTab] = useState("mybus");

  useEffect(() => {
    fetchRoutes()
      .then(setRoutes)
      .catch(() => {});
  }, [setRoutes]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-100">
      <Notifications />
      {activeTab === "mybus" && (
        <>
          <MapView />
          <TopStatusCard />
          <BottomDriverCard />
        </>
      )}
      {activeTab === "history" && <HistoryPage />}
      {activeTab === "messages" && <MessagesPage />}
      {activeTab === "profile" && <ProfilePage />}
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default function App() {
  const token = useAuthStore((s) => s.token);

  return (
    <ErrorBoundary>
      {token ? <TrackerApp /> : <AuthPage />}
    </ErrorBoundary>
  );
}
