import {create} from "zustand";
import SecureStorage from "react-secure-storage";

const useUserLoginStore = create((set, get) => ({
  user: null,
  companies: [],
  role: null,

  saveUserToken: (token) => {
    SecureStorage.setItem("authToken", token, {storageType: "sessionStorage"});
  },
  getUserToken: () => {
    return SecureStorage.getItem("authToken", {storageType: "sessionStorage"});
  },
  removeUserToken: () => {
    SecureStorage.removeItem("authToken", {storageType: "sessionStorage"});
  },

  setUserCompanies: (companies) => set({companies}),

  getUserCompanies: () => get().companies,

  setUserRole: (role) => set({ role }),
  
  getUserRole: () => get().role,
}));

export default useUserLoginStore;
