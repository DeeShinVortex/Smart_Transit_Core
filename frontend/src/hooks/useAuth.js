import { create } from "zustand";
import { login as apiLogin, register as apiRegister, logout as apiLogout, getToken } from "../services/auth";

const useAuthStore = create((set) => ({
  user: null,
  token: getToken(),
  loading: false,
  error: null,

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const data = await apiLogin(username, password);
      set({ user: data.user, token: data.token, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  register: async (username, email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await apiRegister(username, email, password);
      set({ user: data.user, token: data.token, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  logout: () => {
    apiLogout();
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
