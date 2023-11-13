import React from "react";
import { io } from "socket.io-client";

function useSocket() {
  const [errorMessage, setErrorMessage] = React.useState("");
  const [showErrorMessage, setShowErrorMessage] = React.useState(false);

  const [isConnected, setIsConnected] = React.useState(false);
  const [metadata, setMetadata] = React.useState(null);
  const [practiceStatus, setPracticeStatus] = React.useState("");
  const [dataValues, setDataValues] = React.useState({});

  const connect = React.useCallback((serverIp, options) => {
    const { user, password, initialize } = options;
    const newSocket = io(serverIp);
    setErrorMessage("");

    newSocket.on("connect", () => {
      console.log("socket on connect");
      setIsConnected(true);
      newSocket.emit("setup", { user, password, initialize });
    });

    newSocket.io.on("reconnect", () => {
      console.log("socket on reconnect");
    });

    newSocket.on("disconnect", () => {
      console.log("socket on disconnect");
      setIsConnected(false);
    });

    newSocket.on("setup", (data) => {
      if (data.status === "success") {
        setMetadata(data.metadata);
      } else if (data.status === "error") {
        setErrorMessage(data.message);
        setShowErrorMessage(true);
      }
    });

    newSocket.on("updatePracticeData", (practiceData) => {
      setPracticeStatus(practiceData.status);
      setDataValues(practiceData.dataValues);
    });

    newSocket.on("message", ({ status, message }) => {
      if (status === "error") {
        console.log("Error: ", message);
        setErrorMessage(message);
        setShowErrorMessage(true);
      }
    });

    return newSocket;
  }, []);

  return {
    connect,
    isConnected,
    metadata,
    practiceStatus,
    dataValues,
    errorMessage,
    showErrorMessage,
    clearErrorMessage: () => {
      setShowErrorMessage(false);
    },
  };
}

export default useSocket;
