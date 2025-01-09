// SuccessAlert.js
import React, { useEffect } from "react";

const SuccessAlert = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer); // Limpa o timer ao desmontar o componente
  }, [onClose]);

  return (
    <div className="alert alert-success align-items-center" role="alert">
      <div>{message}</div>
    </div>
  );
};

export default SuccessAlert;
