// src/hooks/useSocket.js
import {useState, useEffect} from "react";
import {io} from "socket.io-client";
import {API_URL_BASE} from "../config/api";

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const sock = io(API_URL_BASE, {
      path: "/socket.io",
      transports: ["websocket"], // fuerza WebSocket y evita polling
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    setSocket(sock);

    sock.on("connect", () => {
      setIsConnected(true);
      // únete a tu sala personal para recibir eventos dirigidos
      sock.emit("joinRoom", {room: sock.id});
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
