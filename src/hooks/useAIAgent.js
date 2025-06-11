import {useState, useEffect} from "react";
import axios from "axios";
import {API_URL_AI_CONTENT_REQUEST} from "../config/api";
import useUserLoginStore from "./useUserLoginStore";
import useSocket from "./useSocket";

const useAIAgent = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState(null);
  const [isAwaitingClarification, setIsAwaitingClarification] = useState(false);

  const {socket, isConnected} = useSocket();
  const {getUserCompanies} = useUserLoginStore();
  const company = getUserCompanies();

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = (data) => {
      const statusMsg = {role: "assistant", text: data.message};
      setMessages((prev) => [...prev, statusMsg]);
      if (data.isDone) {
        setIsLoading(false);
      }
    };

    socket.on("job_update", handleUpdate);
    return () => {
      socket.off("job_update", handleUpdate);
    };
  }, [socket]);

  const sendInstruction = async (text) => {
    if (!socket) {
      alert("Socket not initialized yet. Please wait.");
      return;
    }

    if (!socket.connected) {
      await new Promise((resolve) => {
        const listener = () => {
          socket.off("connect", listener);
          resolve();
        };
        socket.on("connect", listener);
      });
    }
    setIsLoading(true);
    setMessages((prev) => [...prev, {role: "user", text}]);

    let newContext;
    if (isAwaitingClarification) {
      newContext = conversationContext + "\n[ACLARACIÓN] " + text;
    } else {
      newContext = text;
    }
    setConversationContext(newContext);

    try {
      const userToken = useUserLoginStore.getState().getUserToken();
      if (!userToken) throw new Error("User not authenticated.");

      const {data} = await axios.post(
        API_URL_AI_CONTENT_REQUEST,
        {
          instruction: newContext,
          persona: company?.companyName,
          socketId: socket.id,
        },
        {headers: {Authorization: `Bearer ${userToken}`}}
      );

      setMessages((prev) => [...prev, {role: "assistant", text: data.message}]);

      setIsAwaitingClarification(false);
    } catch (err) {
      if (
        err.response &&
        err.response.data?.status === "clarification_needed"
      ) {
        setMessages((prev) => [
          ...prev,
          {role: "assistant", text: err.response.data.message},
        ]);
        setIsAwaitingClarification(true);
      } else {
        console.error("AI agent error:", err);
        setMessages((prev) => [
          ...prev,
          {role: "assistant", text: "⚠️ An error occurred. Please try again."},
        ]);
        setIsAwaitingClarification(false);
        setConversationContext(null);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!isLoading && !isAwaitingClarification) {
      setConversationContext(null);
    }
  }, [messages, isLoading, isAwaitingClarification]);

  return {messages, isLoading, isConnected, sendInstruction};
};

export default useAIAgent;
