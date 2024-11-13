import React, { useState } from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import './AuthModal.css';
import axios from "../../api/axios";
import { toast } from 'react-toastify';

const AuthModal = ({ onClose, onLoginSuccess }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [usernameValid, setUsernameValid] = useState({
        minLength: false,
        validChars: false,
        notSameAsPassword: true,
        isUnique: true,
    });
    const [passwordValid, setPasswordValid] = useState({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasDigit: false,
    });

    // Валидация логина
    const validateUsername = (value) => {
        setUsername(value);

        const localValidation = {
            minLength: value.length >= 6,
            validChars: /^[a-zA-Z0-9._]*$/.test(value),
            notSameAsPassword: value !== password && value.length > 0,
        };

        setUsernameValid(localValidation);
    };

    // Валидация пароля
    const validatePassword = (value) => {
        setPassword(value);
        setPasswordValid({
            minLength: value.length >= 8,
            hasUppercase: /[A-Z]/.test(value),
            hasLowercase: /[a-z]/.test(value),
            hasDigit: /\d/.test(value),
        });
        setUsernameValid((prev) => ({
            ...prev,
            notSameAsPassword: value !== username && username.length > 0,
        }));
    };

    // Обработчик изменения для поля даты рождения
    const handleBirthDateChange = (event) => {
        setBirthDate(event.target.value);
    };

    // Логика регистрации
    const handleRegister = async () => {
        if (
            Object.values(usernameValid).every(Boolean) &&
            Object.values(passwordValid).every(Boolean)
        ) {
            // Конвертируем `birthDate` в формат UTC
            const birthDateUTC = new Date(birthDate).toISOString();
    
            try {
                const response = await axios.post('/v1/user/create-client', {
                    client: {
                        login: username,
                        password,
                        birth_date: birthDateUTC,
                        role: 0
                    }
                });
    
                if (response.status === 200) {
                    toast.success("Регистрация успешна");
                    onClose();
                } else {
                    toast.error("Ошибка при регистрации: " + (response.data.message || 'Неизвестная ошибка'));
                    console.error('Ошибка при регистрации:', response.data.message || 'Неизвестная ошибка');
                }
            } catch (error) {
                toast.error("Ошибка при регистрации: " + (error.response?.data?.message || error.message));
                console.error('Ошибка при регистрации:', error.response?.data?.message || error.message);
            }
        }
    };

    // Логика авторизации
    const handleLogin = async () => {
        try {
            const response = await axios.post("/v1/auth/sign-in", 
                { login: username, password: password }
            );

            if (response.data) {
                const data = response.data;
                
                if (data) {
                    toast.success("Авторизация успешна");
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('username', username); 
                    localStorage.setItem('token', data); // сохраняем токен
                    onLoginSuccess();
                    onClose();
                } else {
                    toast.error("Неправильные данные");
                    console.error("Ответ сервера не содержит ожидаемых данных");
                }
            }
        } catch (error) {
            toast.error("Ошибка при авторизации: " + (error.response?.data?.message || "Неверные данные"));
            console.error('Ошибка при авторизации:', error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <button className="auth-modal-close" onClick={onClose}>×</button>
                <div className="auth-mode-toggle">
                    <span className={`toggle-option ${isLoginMode ? 'active' : ''}`} onClick={() => setIsLoginMode(true)}>Вход</span>
                    <span className="divider">/</span>
                    <span className={`toggle-option ${!isLoginMode ? 'active' : ''}`} onClick={() => setIsLoginMode(false)}>Регистрация</span>
                </div>
                <h2>{isLoginMode ? 'Авторизация' : 'Регистрация'}</h2>
                <Input placeholder="Логин" value={username} onChange={validateUsername} style={{margin:'1rem 0'}}/>
                
                {/* Поле для даты и валидация логина только для регистрации */}
                {!isLoginMode && (
                    <>
                        <input 
                            type="date" 
                            placeholder="Дата рождения" 
                            value={birthDate} 
                            onChange={handleBirthDateChange} 
                            style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem', fontSize: '1rem' }} 
                        />
                        <ul className="validation-list">
                            <li className={usernameValid.minLength ? 'valid' : 'invalid'}>Логин должен быть не менее 6 символов</li>
                            <li className={usernameValid.validChars ? 'valid' : 'invalid'}>Логин должен содержать только латиницу, цифры, точки или подчёркивания</li>
                            <li className={usernameValid.notSameAsPassword ? 'valid' : 'invalid'}>Логин не должен совпадать с паролем</li>
                        </ul>
                    </>
                )}

                <Input type="password" placeholder="Пароль" value={password} onChange={validatePassword} style={{marginBottom:'1rem'}}/>

                {/* Требования к паролю показываем только при регистрации */}
                {!isLoginMode && (
                    <ul className="validation-list">
                        <li className={passwordValid.minLength ? 'valid' : 'invalid'}>Пароль должен быть не менее 8 символов</li>
                        <li className={passwordValid.hasUppercase ? 'valid' : 'invalid'}>Хотя бы одна заглавная буква</li>
                        <li className={passwordValid.hasLowercase ? 'valid' : 'invalid'}>Хотя бы одна строчная буква</li>
                        <li className={passwordValid.hasDigit ? 'valid' : 'invalid'}>Хотя бы одна цифра</li>
                    </ul>
                )}
                
                <Button
                    onClick={isLoginMode ? handleLogin : handleRegister}
                    disabled={!isLoginMode && !(Object.values(usernameValid).every(Boolean) && Object.values(passwordValid).every(Boolean))}
                    style={{width:'100%'}}
                >
                    {isLoginMode ? 'Войти' : 'Зарегистрироваться'}
                </Button>
            </div>
        </div>
    );
};

export default AuthModal;
