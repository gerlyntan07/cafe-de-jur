import React from 'react'
import logo from '/cafedejur-logo.png';

function Header() {
    const leftMenuTexts = 'font-inika text-white text-[18px]';
    const rightMenuTexts = 'font-inika text-black text-[18px] mr-[8%]';
    return (
        <div className='w-[100%] flex absolute flex-row items-center justify center mt-[3rem] z-100'>
            <div className="w-[70%] h-[3rem] bg-darkBrown flex flex-row overflow-visible relative">
                <div className='w-[25%] flex items-center justify-center'>
                    <img src={logo} alt="" className="w-[45%] overflow-visible object-contain" />
                </div>                
                <div className="w-[60%] ml-[15%] flex flex-row items-center justify-evenly">
                    <a href="" className={leftMenuTexts}>ABOUT</a>
                    <a href="" className={leftMenuTexts}>MENU</a>
                    <a href="" className={leftMenuTexts}>SERVICE</a>
                    <a href="" className={leftMenuTexts}>CONTACT</a>
                </div>
            </div>

            <div className='w-[30%] h-[3rem] bg-lightBrown flex flex-row items-center justify-end'>
                <a href="" className={rightMenuTexts}>LOG IN</a>
                <p className={rightMenuTexts}>|</p>
                <a href="" className={rightMenuTexts}>SIGN UP</a>
            </div>
        </div>
    )
}

export default Header
