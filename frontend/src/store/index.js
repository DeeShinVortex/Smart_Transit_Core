import { create } from "zustand";

const useTrackingStore = create((set, get) => ({
  buses: {},
  routes: [],
  selectedBusId: null,
  selectedRoute: null,
  trackingBusId: null, // bus we're actively following on the map
  eta: null,

  setBuses: (buses) => set({ buses }),

  updateBus: (id, location) =>
    set((state) => ({
      buses: { ...state.buses, [id]: location },
    })),

  removeBus: (id) =>
    set((state) => {
      const { [id]: _, ...rest } = state.buses;
      return { buses: rest };
    }),

  setRoutes: (routes) => set({ routes }),

  setSelectedBus: (bus) => set({ selectedBusId: bus?.vehicle_id || null }),

  getSelectedBus: () => {
    const { selectedBusId, buses } = get();
    if (!selectedBusId) return null;
    return buses[selectedBusId] || null;
  },

  // Start tracking — select + follow
  startTracking: (busId) =>
    set({ trackingBusId: busId, selectedBusId: busId }),

  stopTracking: () => set({ trackingBusId: null }),

  setSelectedRoute: (routeId) => set({ selectedRoute: routeId }),
  setEta: (eta) => set({ eta }),
}));

export default useTrackingStore;
