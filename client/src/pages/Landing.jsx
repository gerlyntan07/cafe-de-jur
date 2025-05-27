import React from 'react'
import Header from '../components/Header';
import coffee from '../assets/landing-coffee.png';
import beans from '../assets/beans.png';
import beans2 from '../assets/beans2.png';
import waves from '../assets/brownwaves.png'
import menubg from '../assets/menubg.png';
import { Link } from 'react-router-dom';
import MenuProducts from '../components/MenuProducts.jsx';
import menu1 from '../assets/menu1.png';
import menu2 from '../assets/menu2.png';
import menu3 from '../assets/menu3.png';
import menu4 from '../assets/menu4.png';
import food1 from '../assets/food1.png';
import food2 from '../assets/food2.png';
import food3 from '../assets/food3.png';

function Landing() {

  const hline1 = (window.innerWidth) / 1.5;
  const hline2 = (window.innerWidth) - hline1;


  const cafeName = 'font-libre text-[5.5rem] ml-[10%] leading-30'
  return (
    <>
      <Header />
      <div id='home' className='h-[100dvh] w-full items-center flex flex-col justify-center'>
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
      </div>

      {/* MENU */}
      <div id='menu' style={{ backgroundImage: `url(${menubg})` }} className='w-full bg-cover flex flex-col items-center justify-center relative pt-[3rem] md:pb-[10rem] md:pt-[7rem]'>
        <p className='font-libre text-[18px] md:text-[20px]'>DRINKS MENU</p>
        <div className='h-[2px] w-[75%] bg-[#6F4E37] mt-2 mb-[3rem] md:mb-[5rem]' />

        <div className='w-full flex flex-col md:flex-row items-center justify-center'>
          <div className='flex flex-row flex-wrap w-[60%] items-center justify-evenly md:justify-center gap-[3rem]'>
            <MenuProducts imgSource={menu1} wSize='w-[4rem] md:w-[6rem]' />
            <MenuProducts imgSource={menu2} wSize='w-[5rem] md:w-[15rem]' />
            <MenuProducts imgSource={menu3} wSize='w-[4rem] md:w-[5.5rem]' />
            <MenuProducts imgSource={menu4} wSize='w-[3.5rem] md:w-[4.5rem]' />
          </div>

          <Link className='text-right text-[15px] font-libre underline mt-4 md:text-[18px] md:mb-[0rem]'>View All {'>'}</Link>
        </div>

        <p className='font-libre text-[18px] mt-[3rem] md:text-[20px] md:mt-[5rem]'>FOODS MENU</p>
        <div className='h-[2px] w-[75%] bg-[#6F4E37] mt-2 mb-[3rem] md:mb-[5rem]' />

        <div className='w-full flex flex-col md:flex-row items-center justify-center'>
          <div className='flex flex-row flex-wrap w-[60%] items-center justify-evenly md:justify-center gap-[3rem]'>
          <MenuProducts imgSource={food1} wSize='w-[10rem] rotate-180' />
          <MenuProducts imgSource={food2} wSize='w-[10rem]' />
          <MenuProducts imgSource={food3} wSize='w-[10rem] rotate-180' />
          <MenuProducts imgSource={food1} wSize='w-[10rem] rotate-180' />
        </div>

        <Link className='text-right text-[15px] font-libre underline mt-4 mb-[5rem] md:mb-[0rem] md:text-[18px]'>View All {'>'}</Link>
        </div>

        <div className='w-full h-[1rem] md:h-[1.5rem] bg-[#6F4E37] absolute bottom-0' />
      </div>
    </>
  )
}

export default Landing
