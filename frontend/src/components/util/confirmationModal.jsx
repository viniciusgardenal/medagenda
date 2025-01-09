import React from 'react';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <p style={styles.text}>Tem certeza de que deseja excluir?</p>
                <div style={styles.actions}>
                    <button onClick={onConfirm} style={styles.confirmButton}>Sim, excluir</button>
                    <button onClick={onCancel} style={styles.cancelButton}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
        width: '300px',
    },
    text: {
        color: 'red',
        marginBottom: '20px',
    },
    actions: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    confirmButton: {
        backgroundColor: 'red',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    cancelButton: {
        backgroundColor: 'gray',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default ConfirmationModal;
