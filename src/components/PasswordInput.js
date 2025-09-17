import React, { useState } from 'react';

const PasswordInput = ({ 
    id, 
    value, 
    onChange, 
    placeholder = "Digite a senha", 
    required = false,
    className = ""
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={`password-input-wrapper ${className}`}>
            <input
                type={showPassword ? "text" : "password"}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="modern-input"
            />
            <button
                type="button"
                className="password-toggle-btn modern-toggle"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
            >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
        </div>
    );
};

export default PasswordInput;



