import React from 'react'
import Header from '../components/Header';
import coffee from '../assets/landing-coffee.png';
import beans from '../assets/beans.png';
import beans2 from '../assets/beans2.png';
import waves from '../assets/brownwaves.png'
import { Link } from 'react-router-dom';

function Landing() {

  const hline1 = (window.innerWidth) / 1.5;
  const hline2 = (window.innerWidth) - hline1;


  const cafeName = 'font-libre text-[5.5rem] ml-[10%] leading-30'
  return (
    <>
      <Header />
      <div className='h-[100dvh] w-full items-center flex flex-col justify-center'>
        <p className='font-libre text-[2.5rem] md:text-[4rem] md:leading-none'>CAFÉ de JÚR</p>
        <p className='font-inika text-[1rem] md:text-[1rem]'>EST. 2024</p>
        <div className='h-[2px] w-[75%] bg-[#6F4E37] my-4 md:w-[45%] md:my-6' />
        <p className='font-inika text-[0.8rem] mb-[5rem] md:text-[1rem]'>START YOUR DAY WITH US</p>

        <Link className='bg-darkBrown text-white font-inika text-center py-2 px-5 rounded-full hover:bg-darkAccent focus:outline-2 focus:outline-offset-2 focus:outline-darkAccent z-[100]'>ORDER NOW</Link>

        <div
          style={{ backgroundImage: `url(${waves})` }}
          className="bg-cover w-full absolute bottom-0 bg-top h-[20rem] md:h-[18rem] 2xl:h-[30rem]"
        ></div>
        
        <div
          style={{ backgroundImage: `url(${beans2})` }}
          className="bg-cover w-full absolute bottom-0 bg-top h-[10rem] md:h-[20rem] 2xl:h-[30rem]"
        ></div>

        <div className='w-full h-[1rem] bg-[#6F4E37] absolute bottom-0' />
      </div>
    </>
  )
}

export default Landing
