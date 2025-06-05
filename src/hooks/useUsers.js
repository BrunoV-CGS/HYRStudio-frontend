import {
  API_URL_CREATE_USERS,
  API_URL_GET_USERS,
  API_URL_BASE,
} from "../config/api";
import Swal from "sweetalert2";
import useLoader from "./useLoader";
import useUserLoginStore from "./useUserLoginStore";

const useUsers = () => {
  const {setLoading} = useLoader();
  const {getUserToken} = useUserLoginStore();
  const userToken = getUserToken();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL_GET_USERS, {
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

  const createUser = async (userData) => {
    setLoading(true);
    try {
      const response = await fetch(API_URL_CREATE_USERS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error creating user:", response.status, errorText);
        Swal.fire("Error", "User could not be created.", "error");
        setLoading(false);
        return null;
      }

      const data = await response.json();
      Swal.fire("Success", "User created successfully.", "success");
      setLoading(false);
      return data;
    } catch (error) {
      console.error("Create user error:", error);
      Swal.fire("Error", "An unexpected error occurred.", "error");
      setLoading(false);
      return null;
    }
  };

  const updateUser = async (email, userData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL_CREATE_USERS}/${email}`, {
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
        Swal.fire("Error", "User could not be updated.", "error");
        setLoading(false);
        return null;
      }

      const data = await response.json();
      Swal.fire("Success", "User updated successfully.", "success");
      setLoading(false);
      return data;
    } catch (error) {
      console.error("Update user error:", error);
      Swal.fire("Error", "An unexpected error occurred.", "error");
      setLoading(false);
      return null;
    }
  };

  const assignCompany = async (dto) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL_CREATE_USERS}/assign-company`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error assigning company:", response.status, errorText);
        Swal.fire("Error", "Company could not be assigned.", "error");
        setLoading(false);
        return null;
      }

      const data = await response.json();
      Swal.fire("Success", "Company assigned successfully.", "success");
      setLoading(false);
      return data;
    } catch (error) {
      console.error("Assign company error:", error);
      Swal.fire("Error", "An unexpected error occurred.", "error");
      setLoading(false);
      return null;
    }
  };

  return {
    fetchUsers,
    createUser,
    updateUser,
    assignCompany,
  };
};

export default useUsers;
