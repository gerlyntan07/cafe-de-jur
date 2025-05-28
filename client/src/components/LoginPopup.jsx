import React, {useEffect} from 'react'
import { BsX } from "react-icons/bs";
import { Link } from "react-router-dom";
import logo from '/cafedejur-logo.png';

function LoginPopup({toggleLogin}) {
    useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = ''; // Reset on unmount
    };
  }, []);

  const inputStyle = 'w-full bg-inputGray py-3 font-inika text-[14px] px-3 my-2 rounded outline-none focus:bg-gray-300 transition-all duration-200 md:text-[15px]';

    return (
        <section id='loginPopup' className='fixed top-0 left-0 w-full h-full bg-black/50 z-[10000] flex items-center justify-center'>
            <div className='w-[90%] md:w-[60%] lg:w-[40%] 2xl:w-[30%] flex flex-col items-center justify-center rounded-[20px] shadow-lg bg-white overflow-hidden'>
                <button className='w-[85%] flex items-center justify-end mt-5 cursor-pointer' onClick={toggleLogin}><BsX color='black' size={25} /></button>
                <div className='w-full flex items-center justify-center'>
                    <img src={logo} className='w-[25%] object-contain' alt="" />
                </div>
                <p className='font-inika font-bold text-[15px] mt-5 md:text-[17px]'>The baristas missed you. Let’s brew!</p>
                <p className='font-inika text-[13px] mb-2 md:text-[15px]'>Sign in to your account.</p>

                <form autoComplete='off' className='w-[80%] flex flex-col items-center justify-center overflow-hidden'>
                    <input className={inputStyle} placeholder='Email' type="email" />
                    <input className={inputStyle} placeholder='Password' type="password" autocomplete="new-password" />
                </form>
                
                <Link className='font-inika w-[80%] text-right text-[13px] text-red-600 leading-none md:text-[15px]'>Forgot password?</Link>

                <button className='font-inika text-[15px] md:text-[16px] md:py-3 w-[80%] bg-lightBrownBG rounded-full py-2 mt-5 hover:bg-lightBrown focus:bg-lightBrown focus:outline-2 focus:outline-offset-2 focus:outline-lightBrown cursor-pointer'>Log in</button>
                <div className='h-[2px] w-[80%] bg-gray-300 my-7'> </div>
                <p className='w-[70%] text-center font-inika text-[13px] mb-8 md:text-[15px] md:mb-15'>Don’t have an account yet? <Link className='text-red-600'>Sign up</Link> and sip up!</p>
            </div>
        </section>
    )
}

export default LoginPopup