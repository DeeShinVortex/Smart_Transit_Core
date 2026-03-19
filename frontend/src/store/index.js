import { create } from "zustand";

const useTrackingStore = create((set, get) => ({
  buses: {},
  busDetails: [],
  routes: [],
  selectedBusId: null,
  selectedRoute: null,
  trackingBusId: null,
  eta: null,

  setBuses: (buses) => set({ buses }),
  setBusDetails: (busDetails) => set({ busDetails }),

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

  setSelectedBus: (bus) => set({ selectedBusId: bus?.vehicle_id || bus?.bus_id || null }),

  getSelectedBus: () => {
    const { selectedBusId, buses } = get();
    if (!selectedBusId) return null;
    return buses[selectedBusId] || null;
  },

  getBusDetail: (busId) => {
    const { busDetails } = get();
    return busDetails.find((b) => b.bus_id === busId) || null;
  },

  startTracking: (busId) =>
    set({ trackingBusId: busId, selectedBusId: busId }),

  stopTracking: () => set({ trackingBusId: null }),

  setSelectedRoute: (routeId) => set({ selectedRoute: routeId }),
  setEta: (eta) => set({ eta }),
}));

export default useTrackingStore;
