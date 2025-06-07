import Swal from "sweetalert2";
import useLoader from "./useLoader";
import { API_URL_BLOG_CREATE } from "../config/api"; 
import useUserLoginStore from "./useUserLoginStore";


const useBlogs = () => {
  const { setLoading } = useLoader();
  const {getUserToken} = useUserLoginStore();
  const userToken = getUserToken();

  const createBlogPost = async (postData) => {
    setLoading(true);
    try {
      const response = await fetch(API_URL_BLOG_CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error while creating blog post:", errorText);
        Swal.fire("Error", "Blog post could not be created.", "error");
        return null;
      }

      const data = await response.json();
      Swal.fire("Success", "Blog post created successfully.", "success");
      return data;
    } catch (error) {
      console.error("Network error while creating blog post:", error);
      Swal.fire(
        "Error",
        "An unexpected error occurred. Please try again.",
        "error"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBlogPost,
  };
};

export default useBlogs;
