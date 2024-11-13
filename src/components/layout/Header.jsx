import React, { useState, useEffect } from 'react';
import AuthModal from '../forms/AuthModal';
import profileIcon from "../../assets/profile.svg";
import homeIcon from "../../assets/home.svg";
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        setIsAuthModalOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
    };

    return (
        <header className="header">
            <nav className="header-nav">
                <Link to="/" className="header-item">
                    <img src={homeIcon} alt="Home" className="header-nav-icon" />
                    <div className="header-text">Домой</div>
                </Link>
                {isAuthenticated ? (
                    <button onClick={handleLogout} className="header-item header-button">
                        <img src={profileIcon} alt="Profile" className="header-nav-icon" />
                        <div className="header-text">Выйти</div>
                    </button>
                ) : (
                    <button onClick={() => setIsAuthModalOpen(true)} className="header-item header-button">
                        <img src={profileIcon} alt="Profile" className="header-nav-icon" />
                        <div className="header-text">Войти</div>
                    </button>
                )}
            </nav>
            {isAuthModalOpen && (
                <AuthModal onLoginSuccess={handleLoginSuccess} onClose={() => setIsAuthModalOpen(false)} />
            )}
        </header>
    );
};

export default Header;
