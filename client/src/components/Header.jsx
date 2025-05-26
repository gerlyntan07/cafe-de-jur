import React, { useEffect, useState } from 'react'
import { Link, useLocation } from "react-router-dom";
import logo from '/cafedejur-logo.png';
import { FiAlignRight } from "react-icons/fi";

function Header() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const rightMenuTexts = 'font-inika text-black text-[18px] mr-[8%]';

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    }

    const isActive = (path) => location.pathname === path;

    const desktopLeftLinkClass = (path) =>
        `font-inika h-full text-[18px] flex items-center py-2 ${isActive(path) ? 'bg-lightBrownBG text-black px-5 ease-in' : 'text-white'
        }`;

    const mobileLinkClass = (path) =>
        `w-full font-inika text-[15px] text-center px-15 py-3 ${isActive(path) ? 'bg-lightBrownBG !text-black' : 'text-white'
        }`;

    return (
        <>
            {isMobile ? (
                <>
                    <div className='flex flex-row bg-darkBrown items-center justify-between py-2 shadow-lg'>
                        <img src={logo} alt="" className="w-[2.5rem] ml-[1rem] object-contain" />
                        <button className='mr-[1rem]' onClick={toggleMenu}>
                            <FiAlignRight color='white' size={25} />
                        </button>
                    </div>
                    {menuOpen && (
                        <div style={{background: 'rgba(0, 0, 0, 0.51)'}} className='w-full h-[100%] absolute flex flex-col items-end justify-end rounded-b-lg ease-in-out z-100'>
                            <div className='bg-darkBrown absolute right-0 top-0 flex flex-col items-center justify-center rounded-b-lg shadow-lg ease-in-out'>
                                <Link className={mobileLinkClass("/")} to='/'>HOME</Link>
                                <Link className={mobileLinkClass("/menu")} to='/menu'>MENU</Link>
                                <Link className={mobileLinkClass("/service")} to='/service'>SERVICE</Link>
                                <Link className={mobileLinkClass("/contact")} to='/contact'>CONTACT</Link>
                                <Link className={mobileLinkClass("/login")} to='/login'>LOG IN</Link>
                                <Link className={mobileLinkClass("/signup")} to='/signup'>SIGN UP</Link>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className='w-[100%] flex absolute flex-row items-center justify center mt-[3rem] z-100'>
                    <div className="w-[70%] h-[3rem] bg-darkBrown flex flex-row overflow-visible relative">
                        <div className='w-[25%] flex items-center justify-center'>
                            <img src={logo} alt="" className="w-[45%] overflow-visible object-contain 2xl:w-[35%]" />
                        </div>
                        <div className="w-[60%] ml-[15%] flex flex-row items-center justify-evenly">
                            <Link className={desktopLeftLinkClass("/")} to='/'>HOME</Link>
                            <Link className={desktopLeftLinkClass("/menu")} to='/menu'>MENU</Link>
                            <Link className={desktopLeftLinkClass("/service")} to='/service'>SERVICE</Link>
                            <Link className={desktopLeftLinkClass("/contact")} to='/contact'>CONTACT</Link>
                        </div>
                    </div>

                    <div className='w-[30%] h-[3rem] bg-lightBrown flex flex-row items-center justify-end'>
                        <a href="" className={rightMenuTexts}>LOG IN</a>
                        <p className={rightMenuTexts}>|</p>
                        <a href="" className={rightMenuTexts}>SIGN UP</a>
                    </div>
                </div>
            )}
        </>
    )
}

export default Header
