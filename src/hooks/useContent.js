import {
  API_URL_CONTENT_REQUEST,
  API_URL_GOOGLE_IMAGE_REQUEST,
  API_URL_CONTENT_REVIEW,
  API_URL_GET_CONTENT_REQUEST,
  API_URL_GET_REVIEWED_CONTENT_REQUEST,
  API_URL_SEND_TO_MIXPOST,
  API_URL_UPDATE_KNOWLEDGE_BASE,
} from "../config/api";
import Swal from "sweetalert2";
import useLoader from "./useLoader";
import useUserLoginStore from "./useUserLoginStore";

const useContent = () => {
  const {setLoading} = useLoader();
  const {getUserToken, getUserCompanies} = useUserLoginStore();
  const userToken = getUserToken();
  const companies = getUserCompanies();

  const contentGenerator = async (formValues) => {
    try {
      const response = await fetch(API_URL_CONTENT_REQUEST, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Content generation error:", response.status, errorText);
        Swal.fire(
          "Error",
          "Content could not be generated. Please try again.",
          "error"
        );
        setLoading(false);
        return null;
      }

      const data = await response.json();
      setLoading(false);

      if (data.status === "generated") {
        Swal.fire(
          "Success",
          "Content has been generated successfully.",
          "success"
        );
      } else {
        Swal.fire(
          "Warning",
          "Content was not generated correctly. Please review the details.",
          "warning"
        );
      }
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

  const handleGoogleGenerateImage = async (row) => {
    console.log(row);
    const {id} = row;
    setLoading(true);

    try {
      const response = await fetch(API_URL_GOOGLE_IMAGE_REQUEST, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          postId: id,
        }),
      }); // <-- este paréntesis faltaba

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error generating image:", response.status, errorText);
        Swal.fire(
          "Error",
          "Image could not be generated. Please try again.",
          "error"
        );
        setLoading(false);
        return null;
      }

      const data = await response.json();
      setLoading(false);

      if (data?.imageUrl) {
        Swal.fire({
          title: "Image Generated",
          html: `
            <p>The image has been generated successfully.</p>
            <button id="view-image-button" style="
              margin-top: 10px;
              padding: 8px 16px;
              background-color:rgb(93, 183, 96);
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            ">View Image</button>
          `,
          icon: "success",
          
          didRender: () => {
            const btn = document.getElementById("view-image-button");
            btn?.addEventListener("click", () => {
              window.open(data.imageUrl, "_blank", "noopener,noreferrer");
            });
          },
        });
        
        console.log(data)
        return data;
      } else {
        Swal.fire(
          "Warning",
          "No image returned by the AI. Try modifying the content.",
          "warning"
        );
        return null;
      }
    } catch (error) {
      console.error("Server error generating image:", error);
      Swal.fire(
        "Error",
        "An unexpected error occurred while generating the image.",
        "error"
      );
      setLoading(false);
      return null;
    }
  };
  
  

  const reviewPost = async (formValues) => {
    setLoading(true);

    try {
      const response = await fetch(API_URL_CONTENT_REVIEW, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Content review error:", response.status, errorText);
        Swal.fire(
          "Error",
          "The review could not be submitted. Please try again.",
          "error"
        );
        setLoading(false);
        return null;
      }

      const data = await response.json();
      setLoading(false);

      Swal.fire("Success", "The review was submitted successfully.", "success");
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

  const fetchGeneratedContent = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL_GET_CONTENT_REQUEST, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error fetching content:", response.status, errorText);
        setLoading(false);
        Swal.fire(
          "Error",
          "Could not fetch content. Please try again.",
          "error"
        );

        return null;
      }

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setLoading(false);
        return data;
      } else {
        setLoading(false);
        Swal.fire("No Content", "No generated content was found.", "info");
        return [];
      }
    } catch (error) {
      console.error("Server connection error:", error);
      setLoading(false);
      Swal.fire(
        "Error",
        "An unexpected error occurred. Please try again later.",
        "error"
      );
      setLoading(false);
      return null;
    }
  };
  const fetchReviewedContent = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL_GET_REVIEWED_CONTENT_REQUEST, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error fetching content:", response.status, errorText);
        setLoading(false);
        Swal.fire(
          "Error",
          "Could not fetch content. Please try again.",
          "error"
        );

        return null;
      }

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setLoading(false);
        return data;
      } else {
        Swal.fire("No Content", "No generated content was found.", "info");
        setLoading(false);
        return [];
      }
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

  const sendToMixpost = async (content) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL_SEND_TO_MIXPOST}?companyId=${companies.companyId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(content),
        }
      );

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

  const updateKnowledgeBase = async (data) => {
    setLoading(true);

    try {
      const response = await fetch(API_URL_UPDATE_KNOWLEDGE_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Error updating knowledge base:",
          response.status,
          errorText
        );
        Swal.fire(
          "Error",
          "An unexpected error occurred. Please try again later.",
          "error"
        );
        setLoading(false);
        return null;
      }

      const result = await response.json();
      setLoading(false);
      Swal.fire("Éxito", "Knowledge base updated successfully.", "success");
      return result;
    } catch (error) {
      console.error("Error de conexión con el servidor:", error);
      Swal.fire(
        "Error",
        "An unexpected error occurred. Please try again later.",
        "error"
      );
      setLoading(false);
      return null;
    }
  };

  return {
    contentGenerator,
    handleGoogleGenerateImage,
    reviewPost,
    fetchGeneratedContent,
    fetchReviewedContent,
    sendToMixpost,
    updateKnowledgeBase,
  };
};

export default useContent;
