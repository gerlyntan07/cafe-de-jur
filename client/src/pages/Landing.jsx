import React from 'react'
import Header from '../components/Header';
import coffee from '../assets/landing-coffee.png';
import beans from '../assets/beans.png';
import doodle from '../assets/coffee-doodle.png'
import { Link } from 'react-router-dom';

function Landing() {

  const hline1 = (window.innerWidth) / 1.5;
  const hline2 = (window.innerWidth) - hline1;


  const cafeName = 'font-libre text-[5.5rem] ml-[10%] leading-30'
  return (
    <>
      <Header />
      <div className='w-[100%] h-screen bg-red-50 flex flex-col md:flex-row-reverse'>
        <div className='w-[100%] h-[25%] bg-white'>
          <div style={{ backgroundImage: `url(${doodle})` }} className='bg-cover bg-center h-full w-full flex items-center justify-center overflow-visible relative bg-opacity-100'>
            <img src={coffee} alt="Coffee" className='w-[50%] absolute bottom-[-20%] z-10' />
          </div>
        </div>

        <div className='w-[100%] h-[75%] bg-lightBrown'>
          <div style={{ backgroundImage: `url(${beans})` }} className='bg-cover bg-center h-full w-full flex flex-col items-center justify-start overflow-visible relative bg-opacity-100'>
            <p className='font-libre text-[5rem] mt-[8rem] leading-none'>CAFÉ de</p>
            <div className='flex flex-row items-end gap-8'>
              <p className='font-libre text-[5rem]'>JÚR</p>
              <p className='font-libre text-[1.5rem] mb-5'>EST. 2024</p>
            </div>

            <div className='w-full items-center justify-center md:w-[50%] flex items-center md:justify-end md:mt-10 mt-15'>
              <a href="" className='bg-darkBrown text-white font-inika md:ml-[8%] text-center py-2 px-5 rounded-full hover:bg-[#895d3e] focus:outline-2 focus:outline-offset-2 focus:outline-[#895d3e]'>ORDER NOW</a>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}

export default Landing
