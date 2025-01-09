import React, { useEffect } from "react";

const AlertMessage = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Remove o alerta após 8 segundos
    return () => clearTimeout(timer); // Limpa o temporizador se o componente for desmontado
  }, [onClose]);

  return (
    <div className="alert alert-danger" role="alert">
      <svg
        className="bi flex-shrink-0 me-2"
        width="24"
        height="24"
        role="img"
        aria-label="Danger:"
      >
        <use xlinkHref="#exclamation-triangle-fill" />
      </svg>
      <div>{message}</div>
    </div>
  );
};

export default AlertMessage;
