// hooks/useAIAgent.js
import {useState, useEffect, useRef} from "react";
import axios from "axios";
import {io} from "socket.io-client";
import {API_URL_BASE, API_URL_AI_CONTENT_REQUEST} from "../config/api";
import useUserLoginStore from "./useUserLoginStore";

const useAIAgent = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState(null);
  const [isAwaitingClarification, setIsAwaitingClarification] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const {getUserCompanies} = useUserLoginStore();
  const company = getUserCompanies();
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(API_URL_BASE);

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      console.log("WebSocket Connected! Client ID:", socketRef.current.id);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
      console.log("WebSocket Disconnected!");
    });

    socketRef.current.on("job_update", (data) => {
      const statusMsg = {role: "assistant", text: data.message};
      setMessages((prev) => [...prev, statusMsg]);

      if (data.message) {
        setIsLoading(false);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendInstruction = async (text) => {
    const persona = company?.companyName;
    console.log(persona);
    if (!isConnected) {
      alert("Connecting to agent server... Please wait a moment.");
      return;
    }

    setIsLoading(true);

    const userMsg = {role: "user", text};
    setMessages((prev) => [...prev, userMsg]);

    let finalInstruction = text;
    if (isAwaitingClarification && conversationContext) {
      finalInstruction = `Original instruction was: "${conversationContext}". The user has provided the following clarification: "${text}". Please proceed.`;
    } else {
      setConversationContext(text);
    }

    try {
      const userToken = useUserLoginStore.getState().getUserToken();
      if (!userToken) throw new Error("User not authenticated.");

      const {data} = await axios.post(
        API_URL_AI_CONTENT_REQUEST,
        {
          instruction: finalInstruction,
          persona,
          socketId: socketRef.current.id,
        },
        {headers: {Authorization: `Bearer ${userToken}`}}
      );

      const assistantMsg = {role: "assistant", text: data.message};
      setMessages((prev) => [...prev, assistantMsg]);
      setIsAwaitingClarification(false);
      setConversationContext(null);
    } catch (err) {
      if (
        err.response &&
        err.response.data?.status === "clarification_needed"
      ) {
        const assistantMsg = {
          role: "assistant",
          text: err.response.data.message,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsAwaitingClarification(true);
      } else {
        console.error("AI agent error:", err);
        const errorMsg = {
          role: "assistant",
          text: "⚠️ An error occurred. Please try again.",
        };
        setMessages((prev) => [...prev, errorMsg]);
        // Reseteamos en caso de error
        setIsAwaitingClarification(false);
        setConversationContext(null);
      }
      // Si hay un error inmediato, sí desactivamos el loading
      setIsLoading(false);
    }
    // El 'finally' no es necesario aquí porque el loading se desactiva
    // o en el CATCH, o a través del evento del WEBSOCKET.
  };

  return {messages, isLoading, isConnected, sendInstruction};
};

export default useAIAgent;
