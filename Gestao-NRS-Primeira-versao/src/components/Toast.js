import React, { useEffect, useState } from 'react';

const Toast = ({ show, message, icon, isError }) => {
    const [visible, setVisible] = useState(false);
    const [toastClass, setToastClass] = useState('');

    useEffect(() => {
        let hideTimer;
        if (show) {
            setVisible(true);
            setToastClass('show-toast');
            
            // Define o tempo que a notificação ficará visível
            hideTimer = setTimeout(() => {
                setToastClass('hide-toast');
            }, 3000); // Exibe por 3 segundos
        }

        // Limpa o temporizador ao desmontar o componente ou ao 'show' mudar para falso
        return () => {
            clearTimeout(hideTimer);
            setToastClass('');
            setVisible(false);
        };
    }, [show, message, icon, isError]); // Recria o efeito sempre que as props mudarem

    if (!visible) {
        return null;
    }

    return (
        <div className="toast-container">
            <div className={`toast ${isError ? 'toast-error' : 'toast-success'} ${toastClass}`}>
                <i className={`fa-solid ${icon}`}></i> <span>{message}</span>
            </div>
        </div>
    );
};

export default Toast;