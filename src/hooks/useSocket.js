// src/hooks/useSocket.js
import {useState, useEffect} from "react";
import {io} from "socket.io-client";
import { API_URL_BASE } from "../config/api";
import useUserLoginStore from "./useUserLoginStore";

const useSocket = () => {
  const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const { getCompanies } = useUserLoginStore();
    const userCompany = getCompanies()
    

  useEffect(() => {
    const sock = io(API_URL_BASE, {
      path: "/socket.io",
      transports: ["websocket"], 
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    setSocket(sock);

    sock.on("connect", () => {
      setIsConnected(true);
      sock.emit("joinRoom", {room: `company:${userCompany.compamyId}`});
    });

    sock.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      sock.disconnect();
    };
  }, []);

  return {socket, isConnected};
};

export default useSocket;
