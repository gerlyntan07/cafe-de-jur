import React, { useEffect, useState } from 'react'
import { Link, useLocation } from "react-router-dom";
import logo from '/cafedejur-logo.png';
import { FiAlignRight } from "react-icons/fi";
import { BsX } from "react-icons/bs";
import { HashLink } from 'react-router-hash-link';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import UseLogout from '../hooks/UseLogout.js';

function Header() {
    const logout = UseLogout();
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

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    }

    const isActive = (path, hash) => {
        return location.pathname === path || location.hash === hash;
    };


    const desktopLeftLinkClass = (active) =>
        `font-inika w-[90%] text-center text-[1.2rem] py-2 mt-5 transition-all outline-none duration-100 ${active ? 'bg-lightBrownBG text-black ease-in rounded-md' : 'text-white'}`;


    const mobileLinkClass = (active) =>
        `w-[90%] rounded-md font-inika text-[15px] text-center uppercase px-15 py-3 outline-none transition-all duration-100 ${active ? 'bg-lightBrownBG !text-black shadow-lg' : 'text-white'}`;


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
                    <div className={`fixed top-0 right-0 h-full w-[70%] bg-darkBrown shadow-lg z-[10000] transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'
                        } flex flex-col items-center pt-6`}>
                        <button className='w-[85%] flex items-center justify-end my-5' onClick={toggleMenu}><BsX color='white' size={25} /></button>
                        <HashLink className={mobileLinkClass(isActive('/admin-dashboard', '#admin-dashboard'))} smooth to='/admin-dashboard' >Dashboard</HashLink>
                        <HashLink className={mobileLinkClass(isActive('/admin-products', '#admin-products'))} smooth to="/admin-products">Products</HashLink>
                        <button className='w-[90%] cursor-pointer rounded font-inika text-[15px] text-white text-center px-15 py-3 transition-all duration-100 uppercase' onClick={logout}>Log out</button>
                    </div>


                </>
            ) : (
                <div className='w-[30%] xl:w-[25%] h-screen z-[10000] flex flex-col items-center justify-between bg-darkAccent'>
                    <div className='w-full flex flex-col items-center'>
                        <p className='font-libre text-white text-[2rem] mt-10 mb-20 xl:text-[2.5rem] 2xl:text-[3rem]'>CAFÉ de JÚR</p>
                        <HashLink className={desktopLeftLinkClass(isActive('/admin-dashboard', '#admin-dashboard'))} smooth to='/admin-dashboard' >Dashboard</HashLink>
                        <HashLink className={desktopLeftLinkClass(isActive('/admin-products', '#admin-products'))} smooth to="/admin-products">Products</HashLink>
                    </div>
                    <button className='w-[90%] cursor-pointer rounded font-inika text-[1.2rem] text-white text-center px-15 py-3 transition-all duration-100 mb-10' onClick={logout}>Log out</button>
                </div>
            )}
        </>
    )
}

export default Header
