import { useState, useEffect } from 'react'
import Header from '../components/Header';
import Marquee from "react-fast-marquee";
import m1 from '../assets/marquee1.png';
import m2 from '../assets/marquee2.png';

function Landing() {
  const hline1 = (window.innerWidth) / 1.5;
  const hline2 = (window.innerWidth) - hline1;

  const images = [m1, m2]; // add more images if needed

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // 3000ms = 3 seconds pause

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const cafeName = 'font-libre text-[5.5rem] ml-[10%] leading-30'
  return (
    <>
      <Header />
      <div className='w-[100%] h-[100dvh] bg-red-100 flex flex-row'>
        {/* left section */}
        <div className="w-[70%] bg-lightBrown flex flex-col relative justify-center">
          <div style={{ width: hline2 }} className="h-[5px] bg-darkBrown absolute bottom-[1.5rem] left-0" />
          <p className={cafeName}>CAFÉ de</p>
          <div className='flex flex-row items-end'>
            <p className={cafeName}>JÚR</p>
            <p className='font-libre font-semibold text-[1.5rem] ml-[5rem] mb-5'>EST. 2024</p>
          </div>

          <div className='w-[50%] flex items-center justify-end mt-10'>
            <a href="" className='bg-darkBrown text-white font-inika ml-[8%] text-center py-2 px-5 rounded-full hover:bg-[#895d3e] focus:outline-2 focus:outline-offset-2 focus:outline-[#895d3e]'>ORDER NOW</a>
          </div>
        </div>

        {/* right section */}
        <div className="w-[30%] bg-white flex flex-col relative overflow-visible items-center justify-center">
          <div style={{ width: hline1 }} className="h-[5px] bg-darkBrown absolute right-0 top-[1.5rem]" />

          <img src={m2} alt="Image 2" className="h-full max-h-[20rem] object-contain ml-[-100%] mt-[10rem]" />    
        </div>
      </div>
    </>
  )
}

export default Landing
