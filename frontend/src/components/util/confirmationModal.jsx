import React from 'react';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity ">
            <div className="bg-white rounded-lg shadow-xl w-96 p-8 transform transition-all duration-300 ease-in-out ">
                <p className="text-red-500 text-xl font-semibold mb-6 text-center">
                    Tem certeza de que deseja excluir?
                </p>
                <div className="flex justify-between gap-4">
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Sim, excluir
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
