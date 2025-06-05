import {create} from "zustand";
import {persist} from "zustand/middleware";
import SecureStorage from "react-secure-storage";

const useUserLoginStore = create(
  persist(
    (set, get) => ({
      user: null,
      selectedCompany: null,
      role: null,
      companies: [],

      saveUserToken: (token) => {
        SecureStorage.setItem("authToken", token, {
          storageType: "sessionStorage",
        });
      },
      getUserToken: () => {
        return SecureStorage.getItem("authToken", {
          storageType: "sessionStorage",
        });
      },
      removeUserToken: () => {
        SecureStorage.removeItem("authToken", {storageType: "sessionStorage"});
      },

      setCompanies: (companies) => set({companies}),
      getCompanies: () => get().companies,

      setUserCompanies: (selectedCompany) => set({selectedCompany}),
      getUserCompanies: () => get().selectedCompany,

      setUserRole: (role) => set({role}),
      getUserRole: () => get().role,
    }),
    {
      name: "user-store", // nombre en el storage
      partialize: (state) => ({
        selectedCompany: state.selectedCompany,
        role: state.role,
      }),
    }
  )
);

export default useUserLoginStore;
