import {API_URL_CREATE_COMPANY, API_URL_GET_COMPANIES} from "../config/api";
import Swal from "sweetalert2";
import useLoader from "./useLoader";
import useUserLoginStore from "./useUserLoginStore";

const useCompanies = () => {
  const {setLoading} = useLoader();
  const {getUserToken} = useUserLoginStore();
  const userToken = getUserToken();

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL_GET_COMPANIES, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error fetching users:", response.status, errorText);
        Swal.fire("Error", "Could not fetch users. Please try again.", "error");
        return [];
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      Swal.fire("Error", "An unexpected error occurred.", "error");
      setLoading(false);
      return [];
    }
  };

  const createCompany = async (companyData) => {
    setLoading(true);
    try {
      const response = await fetch(API_URL_CREATE_COMPANY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(companyData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error creating user:", response.status, errorText);
        Swal.fire("Error", "Company could not be created.", "error");
        setLoading(false);
        return null;
      }

      const data = await response.json();
      Swal.fire("Success", "Company created successfully.", "success");
      setLoading(false);
      return data;
    } catch (error) {
      console.error("Create user error:", error);
      Swal.fire("Error", "An unexpected error occurred.", "error");
      setLoading(false);
      return null;
    }
  };

  const updateCompany = async (email, userData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL_CREATE_COMPANY}/${email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error updating user:", response.status, errorText);
        Swal.fire("Error", "Company could not be updated.", "error");
        setLoading(false);
        return null;
      }

      const data = await response.json();
      Swal.fire("Success", "Company updated successfully.", "success");
      setLoading(false);
      return data;
    } catch (error) {
      console.error("Update user error:", error);
      Swal.fire("Error", "An unexpected error occurred.", "error");
      setLoading(false);
      return null;
    }
  };

  return {
    fetchCompanies,
    createCompany,
    updateCompany,
  };
};

export default useCompanies;
