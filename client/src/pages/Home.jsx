import React, { useState, useEffect } from 'react'
import Header from '../components/Header';
import beans2 from '../assets/beans2.png';
import waves from '../assets/brownwaves.png'
import menubg from '../assets/menubg.png';
import { Link } from 'react-router-dom';
import MenuTypes from '../components/MenuTypes.jsx';
import menu3 from '../assets/menu3.png';
import food1 from '../assets/food1.png';
import food2 from '../assets/food2.png';
import food3 from '../assets/food3.png';
import HeaderLoggedIn from '../components/HeaderLoggedIn.jsx';

function Landing() {
  useEffect(() => {
    document.title = "CAFÉ de JÚR";
  }, []);

  

  return (
    <>
      <HeaderLoggedIn />
      <section id='homeLoggedIn' className='h-[100dvh] w-full items-center flex flex-col justify-center'>
        <p className='font-libre text-[2.5rem] md:text-[4rem] md:leading-none 2xl:text-[7rem]'>CAFÉ de JÚR</p>
        <p className='font-inika text-[1rem] md:text-[1rem] 2xl:text-[1.7rem]'>EST. 2024</p>
        <div className='h-[2px] w-[75%] bg-[#6F4E37] my-4 md:w-[45%] md:my-6' />
        <p className='font-inika text-[0.8rem] mb-[5rem] md:text-[1rem] 2xl:text-[1.2rem]'>START YOUR DAY WITH US</p>

        <Link className='bg-darkBrown text-white font-inika text-[15px] text-center py-2 px-5 rounded-full hover:bg-darkAccent focus:outline-2 focus:outline-offset-2 focus:outline-darkAccent z-[100] 2xl:text-[1.5rem]'>ORDER NOW</Link>

        <div
          style={{ backgroundImage: `url(${waves})` }}
          className="bg-cover w-full absolute bottom-0 bg-top h-[20rem] md:h-[18rem] 2xl:h-[30rem]"
        ></div>

        <div
          style={{ backgroundImage: `url(${beans2})` }}
          className="bg-cover w-full absolute bottom-0 bg-top h-[10rem] md:h-[20rem] 2xl:h-[30rem]"
        ></div>

        <div className='w-full h-[1rem] md:h-[1.5rem] bg-[#6F4E37] absolute bottom-0' />
      </section>

      {/* MENU */}
      <section id='menuLoggedIn' style={{ backgroundImage: `url(${menubg})` }} className='w-full bg-cover flex flex-col items-center justify-center relative pt-[3rem] pb-[5rem] md:pb-[10rem] md:pt-[5rem]'>
        <p className='font-libre text-[18px] md:text-[20px]'>FOODS MENU</p>
        <div className='h-[2px] w-[75%] bg-[#6F4E37] mt-2 mb-[3rem] md:mb-[5rem]' />

        <div className='flex flex-row flex-wrap w-[80%] md:w-[70%] items-center justify-evenly md:justify-center gap-8'>
          <MenuTypes imgSource={menu3} wSize='h-[120%]' menuType='Beverages' />
          <MenuTypes imgSource={food1} wSize='h-[110%] rotate-180' menuType='Croffles' />
          <MenuTypes imgSource={food2} wSize='h-[105%]' menuType='Silog Meals' />
          <MenuTypes imgSource={food3} wSize='h-[110%] rotate-180' menuType='Pasta' />
        </div>

        <div className='w-full h-[1rem] md:h-[1.5rem] bg-[#6F4E37] absolute bottom-0' />
      </section>
    </>
  )
}

export default Landing
