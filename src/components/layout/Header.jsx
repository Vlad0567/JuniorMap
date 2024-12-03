import React, {useState, useContext} from 'react';
import AuthModal from '../forms/AuthModal';
import {Link, Outlet, useLocation, useNavigate} from 'react-router-dom';
import './Header.css';
import {IoExitOutline, IoHomeOutline, IoPersonOutline} from "react-icons/io5";
import AuthContext from "../../api/AuthContext";
import {IoIosArrowBack} from "react-icons/io";

const Header = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    // const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
    const {username, token, isAuthenticated, login, logout} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const handleLoginSuccess = () => {
        // login();
        // setIsAuthenticated(true);
        setIsAuthModalOpen(false);
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div>
            <header className="header bg-gray-800 h-24 w-full">
                <button disabled={location.pathname === '/'} className={"flex align-middle text-white " + (location.pathname !== '/' ? 'opacity-100' : 'opacity-0')} onClick={()=>(navigate(-1))}><IoIosArrowBack className="m-auto"/> Назад</button>
                <h2 className="text-center text-white w-full">JuniorRoadMap</h2>
                <nav className="flex flex-row gap-x-6">
                    <Link to="/" className="header-item">
                        <IoHomeOutline className='header-nav-icon'/>
                        <div className="header-text">Домой</div>
                    </Link>
                    {isAuthenticated === "true" ? (
                        <div className='flex flex-row gap-x-6'>
                            <Link to="/profile">
                                <button className="header-item header-button">
                                    <IoPersonOutline className='header-nav-icon'/>
                                    <div className="header-text">{username}</div>
                                </button>
                            </Link>
                            <button onClick={handleLogout} className="header-item header-button">
                                <IoExitOutline className='header-nav-icon'/>
                                <div className="header-text">Выйти</div>
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsAuthModalOpen(true)} className="header-item header-button">
                            <IoPersonOutline className='header-nav-icon'/>
                            <div className="header-text">Войти</div>
                        </button>
                    )}
                </nav>
                {isAuthModalOpen && (
                    <AuthModal onLoginSuccess={handleLoginSuccess} onClose={() => setIsAuthModalOpen(false)}/>
                )}
            </header>
            <div className="mt-24">
                <Outlet/>
            </div>
        </div>
    );
};

export default Header;
