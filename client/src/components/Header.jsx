import React, { useEffect, useState } from 'react'
import { Link, useLocation } from "react-router-dom";
import logo from '/cafedejur-logo.png';
import { FiAlignRight } from "react-icons/fi";
import { BsX } from "react-icons/bs";
import { HashLink } from 'react-router-hash-link';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import UseLogout from '../hooks/UseLogout.js';
import Cart from './Cart.jsx';

function Header({ toggleLogin, isAuthenticated, userName }) {
    const logout = UseLogout();
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeHash, setActiveHash] = useState('');
    const [isAccount, setIsAccount] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const rightMenuTexts = 'font-inika text-white text-[15px]';

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    }

    const [isCartOpen, setIsCartOpen] = useState(false);

    const toggleCart = () => {
        setIsCartOpen(prev => !prev);
        if (!isCartOpen) {
            document.title = "Cart | CAFÉ de JÚR";
        } else {
            document.title = "CAFÉ de JÚR";
        }
    };

    useEffect(() => {
        const sectionIds = ['home', 'menu', 'about', 'contact', 'loginPopup', 'signup'];
        const sections = sectionIds.map(id => document.getElementById(id));

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveHash(`#${entry.target.id}`);
                    }
                });
            },
            {
                rootMargin: '-50% 0px -40% 0px', // triggers around section middle
                threshold: 0.1
            }
        );

        sections.forEach(section => {
            if (section) observer.observe(section);
        });

        return () => {
            sections.forEach(section => {
                if (section) observer.unobserve(section);
            });
        };
    }, []);

    const isSignupActive = location.pathname === '/signup' || location.hash === '#signup';
    const isMyAccActive = location.pathname === '/myAcc' || location.hash === '#myAcc';

    const isActiveHash = (hash) => {
        const normalizedHash = hash.replace('/#', '#');
        return activeHash === normalizedHash;
    };


    const desktopLeftLinkClass = (hash) =>
        `font-inika h-full text-[15px] flex items-center py-2 transition-all duration-100 ${isActiveHash(hash) ? 'bg-lightBrownBG text-black px-5 ease-in' : 'text-white'}`;


    const mobileLinkClass = (hash) =>
        `w-[90%] rounded font-inika text-[15px] text-center px-15 py-3 transition-all duration-100 ${isActiveHash(hash) ? 'bg-lightBrownBG !text-black shadow-lg' : 'text-white'}`;

    const signupLinkClass = () =>
        `w-[90%] rounded font-inika text-[15px] text-center px-15 py-3 transition-all duration-100 ${isSignupActive ? 'bg-lightBrownBG !text-black shadow-lg' : 'text-white'}`;

    const myAccLinkClass = () =>
        `w-full rounded font-inika text-[15px] text-center px-15 py-3 transition-all duration-100 ${isMyAccActive ? 'bg-lightBrownBG !text-black shadow-lg' : 'text-white'}`;

    const signupLinkClassPC = () =>
        `font-inika h-full text-[15px] flex items-center py-2 transition-all duration-100 ${isSignupActive ? 'bg-lightBrownBG text-black px-5 ease-in' : 'text-white'}`;

    const myAccLinkClassPC = () =>
        `w-full font-inika h-full text-[15px] flex items-center justify-center py-2 transition-all duration-100 ${isMyAccActive ? 'bg-lightBrownBG text-black px-5 ease-in' : 'text-white'}`;

    const toggleAccount = () => {
        setIsAccount(prev => !prev);
    }

    return (
        <>
            {isMobile ? (
                <>
                    <div className='w-full fixed z-[10000]'>
                        <div className='flex flex-row items-center bg-white justify-center w-full gap-4'>
                            <div className='flex-1 h-[2px] bg-darkBrown' />

                            <div className='flex flex-col items-center justify-center py-3'>
                                <p className='font-libre text-[17px] leading-none'>CAFÉ de JÚR</p>
                                <p className='font-inika text-[13px]'>EST. 2024</p>
                            </div>

                            <div className='flex-1 h-[2px] bg-darkBrown' />
                        </div>

                        <div className='flex flex-row bg-darkBrown items-center justify-between py-2 shadow-lg'>
                            <img src={logo} alt="" className="w-[2.5rem] ml-[1rem] object-contain" />
                            <button className='mr-[1rem]' onClick={toggleMenu}>
                                <FiAlignRight color='white' size={25} />
                            </button>
                        </div>

                        <div className='flex flex-row items-center justify-end py-2 bg-white shadow-md'>
                            <button className='mr-2 cursor-pointer' onClick={() => {
                                if (!isAuthenticated) {
                                    toggleLogin();
                                } else {
                                    toggleCart();
                                }
                            }}><ShoppingCartIcon /></button>
                            <button className='mr-[1rem] font-noticia' onClick={toggleMenu}><SearchIcon /> SEARCH</button>
                        </div>
                        
                        {isCartOpen && isAuthenticated && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={toggleCart}
                                />
                                <Cart toggleCart={toggleCart} />
                            </>
                        )}
                    </div>

                    {isAuthenticated === true ? (
                        <div className={`fixed top-0 right-0 h-full w-[70%] bg-darkBrown shadow-lg z-[10000] transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'
                            } flex flex-col items-center pt-6`}>
                            <button className='w-[85%] flex items-center justify-end my-5' onClick={toggleMenu}><BsX color='white' size={25} /></button>
                            <HashLink className={mobileLinkClass('#home')} smooth to="/#home">HOME</HashLink>
                            <HashLink className={mobileLinkClass('#menu')} smooth to="/#menu">MENU</HashLink>
                            <HashLink className={mobileLinkClass('#about')} smooth to="/#about">ABOUT</HashLink>
                            <HashLink className={mobileLinkClass('#contact')} smooth to="/#contact">CONTACT</HashLink>
                            <div className='flex flex-col w-[90%] items-center justify-center rounded'>
                                <button onClick={toggleAccount} className='w-full rounded font-inika text-[15px] text-white text-center px-15 py-3 transition-all duration-100 uppercase'><AccountCircleOutlinedIcon sx={{ color: 'white', marginRight: 1 }} />{userName}</button>
                                <div className={`${isAccount ? `flex` : `hidden`} rounded bg-darkAccent w-full flex-col items-center`}>
                                    <HashLink className={myAccLinkClass('#myAcc')} to="/myAcc">MY ACCOUNT</HashLink>
                                    <button className='w-[90%] cursor-pointer rounded font-inika text-[15px] text-white text-center px-15 py-3 transition-all duration-100' onClick={logout}>LOG OUT</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={`fixed top-0 right-0 h-full w-[70%] bg-darkBrown shadow-lg z-[10000] transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'
                            } flex flex-col items-center pt-6`}>
                            <button className='w-[85%] flex items-center justify-end my-5' onClick={toggleMenu}><BsX color='white' size={25} /></button>
                            <HashLink className={mobileLinkClass('#home')} smooth to="/#home">HOME</HashLink>
                            <HashLink className={mobileLinkClass('#menu')} smooth to="/#menu">MENU</HashLink>
                            <HashLink className={mobileLinkClass('#about')} smooth to="/#about">ABOUT</HashLink>
                            <HashLink className={mobileLinkClass('#contact')} smooth to="/#contact">CONTACT</HashLink>
                            <HashLink className={mobileLinkClass('#loginPopup')} onClick={toggleLogin}>LOG IN</HashLink>
                            <HashLink className={signupLinkClass('#signup')} to="/signup">SIGN UP</HashLink>
                        </div>
                    )}

                </>
            ) : (

                <div className='w-full fixed flex flex-col items-center justify-center z-[10000]'>
                    <div className='w-full bg-white flex items-center justify-end pt-3 pb-3'>
                        <div className='flex items-end justify-center mr-[3%] whitespace-nowrap'>
                            <p className='font-libre text-[2rem] 2xl:text-[3rem]'>CAFÉ de JÚR</p>
                            <p className='font-inika text-[0.7rem] ml-[2rem]'>EST. 2024</p>
                        </div>
                        <div className='w-[60%] h-[2px] bg-darkBrown mt-[2rem]'> </div>
                    </div>

                    <div className="w-full h-[2.5rem] bg-darkBrown flex flex-row items-center justify-between">
                        <div className='w-[20%] flex items-center justify-center overflow-visible relative'>
                            <img src={logo} alt="" className="w-[40%] overflow-visible object-contain 2xl:w-[35%]" />
                        </div>
                        <div className="w-[60%] h-full flex flex-row items-center justify-center gap-15 2xl:gap-20">
                            <HashLink className={desktopLeftLinkClass('#home')} smooth to="/#home">HOME</HashLink>
                            <HashLink className={desktopLeftLinkClass('#menu')} smooth to="/#menu">MENU</HashLink>
                            <HashLink className={desktopLeftLinkClass('#about')} smooth to="/#about">ABOUT</HashLink>
                            <HashLink className={desktopLeftLinkClass('#contact')} smooth to="/#contact">CONTACT</HashLink>
                        </div>

                        {isAuthenticated === true ? (
                            <div className='flex flex-col w-[20%] items-center justify-center rounded'>
                                <button onClick={toggleAccount} className='w-full flex flex-row items-center justify-center cursor-pointer rounded font-inika text-[15px] text-white text-center px-15 transition-all duration-100 uppercase'><AccountCircleOutlinedIcon sx={{ color: 'white', marginRight: 1 }} />{userName}</button>
                                <div className={`${isAccount ? `flex` : `hidden`} rounded shadow-md absolute bottom-[-27%] 2xl:bottom-[-23%] bg-darkAccent flex-col items-center`}>
                                    <HashLink className={myAccLinkClassPC('#myAcc')} to="/myAcc">MY ACCOUNT</HashLink>
                                    <button className='w-full cursor-pointer rounded font-inika text-[15px] text-white text-center px-15 py-3 transition-all duration-100' onClick={logout}>LOG OUT</button>
                                </div>
                            </div>
                        ) : (
                            <div className='w-[20%] h-full flex flex-row items-center justify-center gap-5'>
                                <HashLink className={desktopLeftLinkClass('#loginPopup')} onClick={toggleLogin}>LOG IN</HashLink>
                                <p className={rightMenuTexts}>|</p>
                                <HashLink className={signupLinkClassPC('#signup')} to="/signup">SIGN UP</HashLink>
                            </div>
                        )}
                    </div>

                    <div className='flex flex-row w-full items-center justify-end py-2 bg-white'>
                        <button className='mr-2 cursor-pointer' onClick={() => {
                            if (!isAuthenticated) {
                                toggleLogin();
                            } else {
                                toggleCart();
                            }
                        }}><ShoppingCartIcon /></button>
                        <button className='mr-[3rem] font-noticia' onClick={toggleMenu}><SearchIcon /> SEARCH</button>
                    </div>

                    {isCartOpen && isAuthenticated && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={toggleCart}
                            />
                            <Cart toggleCart={toggleCart} />
                        </>
                    )}
                </div>
            )}
        </>
    )
}

export default Header
