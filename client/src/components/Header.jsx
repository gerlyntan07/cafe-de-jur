import React, { useEffect, useState } from 'react'
import { Link, useLocation } from "react-router-dom";
import logo from '/cafedejur-logo.png';
import { FiAlignRight } from "react-icons/fi";
import { BsX } from "react-icons/bs";
import { HashLink } from 'react-router-hash-link';

function Header() {
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [menuOpen, setMenuOpen] = useState(false);

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

    const isActivePath = (path) => location.pathname === path;
    const isActiveHash = (hash) => location.hash === hash;

    const desktopLeftLinkClass = (active) =>
        `font-inika h-full text-[15px] flex items-center py-2 ${active ? 'bg-lightBrownBG text-black px-5 ease-in' : 'text-white'
        }`;

    const mobileLinkClass = (active) =>
        `w-[90%] rounded font-inika text-[15px] text-center px-15 py-3 ${active ? 'bg-lightBrownBG !text-black shadow-lg' : 'text-white'
        }`;

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
                    </div>

                    <div className={`fixed top-0 right-0 h-full w-[70%] bg-darkBrown shadow-lg z-[1000] transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'
                        } flex flex-col items-center pt-6`}>
                        <button className='w-[85%] flex items-center justify-end my-5' onClick={toggleMenu}><BsX color='white' size={25} /></button>
                        <HashLink className={mobileLinkClass(isActivePath('/'))} smooth to="/">HOME</HashLink>
                        <HashLink className={mobileLinkClass(isActivePath('/signup'))} smooth to="/#menu">MENU</HashLink>
                        <HashLink className={mobileLinkClass(isActiveHash('#about'))} smooth to="/#about">ABOUT</HashLink>
                        <HashLink className={mobileLinkClass(isActiveHash('#contact'))} smooth to="/#contact">CONTACT</HashLink>
                        <Link className={mobileLinkClass(isActivePath('/login'))} to="/login">LOG IN</Link>
                        <Link className={mobileLinkClass(isActivePath('/signup'))} to="/signup">SIGN UP</Link>
                    </div>
                </>
            ) : (

                <div className='w-full fixed flex flex-col items-center justify-center z-[10000] shadow-lg'>
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
                            <HashLink className={desktopLeftLinkClass(isActivePath('/'))} smooth to="/">HOME</HashLink>
                            <HashLink className={desktopLeftLinkClass(isActivePath('/signup'))} smooth to="/#menu">MENU</HashLink>
                            <HashLink className={desktopLeftLinkClass(isActiveHash('#about'))} smooth to="/#about">ABOUT</HashLink>
                            <HashLink className={desktopLeftLinkClass(isActiveHash('#contact'))} smooth to="/#contact">CONTACT</HashLink>
                        </div>

                        <div className='w-[20%] h-full flex flex-row items-center justify-center gap-5'>
                            <Link className={desktopLeftLinkClass(isActivePath('/login'))} to="/login">LOG IN</Link>
                            <p className={rightMenuTexts}>|</p>
                            <Link className={desktopLeftLinkClass(isActivePath('/signup'))} to="/signup">SIGN UP</Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Header
