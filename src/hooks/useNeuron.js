import Swal from "sweetalert2";
import useLoader from "./useLoader";
import {
  API_URL_BLOG_UPLOAD_NEURON,
  API_URL_BLOG_DOWNLOAD_FROM_NEURON,
} from "../config/api";
import useUserLoginStore from "./useUserLoginStore";

const useNeuron = () => {
  const {setLoading} = useLoader();
  const {getUserToken} = useUserLoginStore();
  const userToken = getUserToken();

  const pushContentToNeuron = async (payload) => {
    setLoading(true);

    try {
      const response = await fetch(API_URL_BLOG_UPLOAD_NEURON, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error sending to Mixpost:", response.status, errorText);
        Swal.fire(
          "Error",
          "Could not send content to Mixpost. Please try again.",
          "error"
        );
        setLoading(false);
        return null;
      }

      const data = await response.json();
      setLoading(false);
      Swal.fire("Success", "Content sent to Mixpost successfully.", "success");
      return data;
    } catch (error) {
      console.error("Server connection error:", error);
      Swal.fire(
        "Error",
        "An unexpected error occurred. Please try again later.",
        "error"
      );
      setLoading(false);
      return null;
    }
    };
    
    const pullContentFromNeuron = async (queryId) => {
      setLoading(true);

      try {
        const response = await fetch(API_URL_BLOG_DOWNLOAD_FROM_NEURON, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({queryId}),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            "Error pulling from Neuron:",
            response.status,
            errorText
          );
          Swal.fire(
            "Error",
            "Could not fetch content from Neuron. Please try again.",
            "error"
          );
          setLoading(false);
          return null;
        }

        const data = await response.json();
        setLoading(false);
        Swal.fire(
          "Success",
          "Content pulled from Neuron successfully.",
          "success"
        );
        return data;
      } catch (error) {
        console.error("Server connection error:", error);
        Swal.fire(
          "Error",
          "An unexpected error occurred while pulling content.",
          "error"
        );
        setLoading(false);
        return null;
      }
    };

  return {
    pushContentToNeuron,
    pullContentFromNeuron,
  };
};

export default useNeuron;
