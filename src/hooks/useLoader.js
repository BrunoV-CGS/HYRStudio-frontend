import {create} from "zustand";

const useLoader = create((set) => ({
  isLoading: false,
  setLoading: (value) => set({isLoading: value}),
}));

export default useLoader;
