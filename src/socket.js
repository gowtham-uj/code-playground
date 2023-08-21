import { io } from "socket.io-client";

export const initSocket = async (authToken) => {
  const options = {
    "force new connection": true,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
    auth: {
      token: authToken,
    },
  };
  return io("/", options);
};
