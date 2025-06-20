import React, { useState, useEffect } from 'react'
import Header from '../components/Header';
import beans2 from '../assets/beans2.png';
import waves from '../assets/brownwaves.png'
import menubg from '../assets/menubg.png';
import { Link } from 'react-router-dom';
import MenuTypes from '../components/MenuTypes.jsx';
import LoginPopup from '../components/LoginPopup.jsx';
import menu3 from '../assets/menu3.png';
import food1 from '../assets/food1.png';
import food2 from '../assets/food2.png';
import food3 from '../assets/food3.png';
import axios from '../hooks/AxiosConfig.js';
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

function Landing() {
  useEffect(() => {
    document.title = "CAFÉ de JÚR";
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  useEffect(() => {
    axios.get('/session')
      .then((res) => {
        if (res.data.loggedIn === false) {
          setIsAuthenticated(false);
        } else {
          setUserName(res.data.firstname);
          setUserRole(res.data.userRole);
          setIsAuthenticated(true);
        }
      })
      .catch((error) => {
        console.error('Session validation failed:', error);
        setIsAuthenticated(false);
      })
  }, []);

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const toggleLogin = () => {
    setIsLoginOpen(prev => !prev);
    if (isLoginOpen) {
      document.title = "CAFÉ de JÚR";
    }
  }

  return (
    <>
      <Header toggleLogin={toggleLogin} isAuthenticated={isAuthenticated} userName={userName} userRole={userRole} />
      {isLoginOpen && <LoginPopup toggleLogin={toggleLogin} />}
      <div id='home' className='h-[100dvh] w-full items-center flex flex-col justify-center'>
        <p className='font-libre text-[2.5rem] md:text-[4rem] md:leading-none 2xl:text-[7rem]'>CAFÉ de JÚR</p>
        <p className='font-inika text-[1rem] md:text-[1rem] 2xl:text-[1.7rem]'>EST. 2024</p>
        <div className='h-[2px] w-[75%] bg-[#6F4E37] my-4 md:w-[45%] md:my-6' />
        <p className='font-inika text-[0.8rem] mb-[5rem] md:text-[1rem] 2xl:text-[1.2rem]'>START YOUR DAY WITH US</p>

        <Link className='bg-darkBrown text-white font-inika text-[15px] text-center py-2 px-5 rounded-full hover:bg-darkAccent focus:outline-2 focus:outline-offset-2 focus:outline-darkAccent z-[100] 2xl:text-[1.5rem]' to={`/menu?type=Beverages`}>ORDER NOW</Link>

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
      <div id='menu' style={{ backgroundImage: `url(${menubg})` }} className='w-full bg-cover flex flex-col items-center justify-center relative pt-[3rem] pb-[5rem] md:pb-[10rem] md:pt-[5rem]'>
        <p className='font-libre text-xl md:text-[2rem]'>FOODS MENU</p>
        <div className='h-[2px] w-[75%] bg-[#6F4E37] mt-2 mb-[3rem] md:mb-[5rem]' />

        <div className='flex flex-row flex-wrap w-[80%] md:w-[70%] items-center justify-evenly md:justify-center gap-8'>
          <MenuTypes imgSource={menu3} wSize='h-[120%]' menuType='Beverages' />
          <MenuTypes imgSource={food1} wSize='h-[110%] rotate-180' menuType='Croffles' />
          <MenuTypes imgSource={food2} wSize='h-[105%]' menuType='Silog Meals' />
          <MenuTypes imgSource={food3} wSize='h-[110%] rotate-180' menuType='Pasta' />
        </div>

        <div className='w-full h-[1rem] md:h-[1.5rem] bg-[#6F4E37] absolute bottom-0' />
      </div>

      {/* About */}
      <div id="about" className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center relative pt-[3rem] pb-[5rem] md:pb-[10rem] md:pt-[5rem]">
        <p className='font-libre text-xl md:text-[2rem] text-center'>ABOUT</p>
        


        <div className="w-6/7 bg-[#f5e9d3] shadow-lg rounded-2xl p-6 md:p-10 mt-10">
          <p className="text-center pb-5 font-noticia"> <b>Café de JÚR</b> is a cozy, community-oriented café located at <b>B19 L43 PH2 Sampaguita Street Soldiers Hills IV Subd, Molino 6, Bacoor, Philippines.</b> </p>

          <p className="text-center pb-5 font-noticia"> <b>O</b>pen daily from <b>10 AM to 9 PM</b>, it offers dine-in, take-out, pick-up, and delivery options, </p>

          <p className="text-center pb-5 font-noticia"> <b>W</b>elcoming guests to savour freshly brewed coffee, pastries, and a warm ambiance. </p>

          <p className="text-center pb-5 font-noticia">The Café’s menu features a variety of specialty drinks including their <b>“Jur’s Signature Blend,” Hot & Iced Cappuccino, Spanish & Caramel Lattes, Iced</b> <br />
            <b>Americano</b>, plus classic <b>Hot American</b> and <b>Flavored iced coffees</b> like vanilla . </p>

          <p className="text-center pb-14 font-noticia"> They recently refreshed their offerings to better serve the community, and now even offer 10‑piece pastry trays for group orders at around <b>₱80</b>+, with <br />
            table reservations available .</p>

          <p className="text-center font-noticia"> Celebrating over a year in business, <b>Café de JÚR</b> steadily nurtures a loyal customer base while maintaining affordable pricing and high-quality beverages.</p>
        </div>

        <div className='w-full h-[1rem] md:h-[1.5rem] bg-[#6F4E37] absolute bottom-0' />
      </div>


      {/* Contact*/}
      <div id='contact' className='w-full bg-cover flex flex-col items-center justify-center relative pt-[3rem] pb-[5rem] md:pb-[10rem] md:pt-[5rem]'>
        <p className='font-libre text-xl md:text-[2rem]'>CONTACT US</p>
        <div className='h-[2px] w-[75%] bg-[#6F4E37] mt-2 mb-[3rem] md:mb-[5rem]' />

        <div className="w-[80%] lg:w-[50%] xl:w-[35%] flex flex-row justify-around pb-14">
          <a href="https://www.facebook.com/profile.php?id=61558396151633" target="_blank" rel="noopener noreferrer">  <FaFacebookSquare className="text-[5rem] md:text-[10rem] text-darkAccent"  /></a>
          <a href="https://www.instagram.com/cafedejur/" target="_blank" rel="noopener noreferrer"> <FaInstagram className="text-[5rem] md:text-[10rem] text-darkAccent" /></a>
        </div>

        <p className="text-left font-noticia"> <b>Address:</b> B19 L43 PH2 Sampaguita Street Soldiers Hills IV Subd, Molino 6, Bacoor, Philippines. <br />
          <b>Opening Hours:</b> 10 AM – 9 PM (Daily) <br /> <br />
          <b>Available Services:</b> <br />
          - Dine-in <br />
          -Take‑out & Pick‑up <br />
          - Delivery (Cash, GCash, Bank Transfer) <br />  <br />
          <b>Payments Accepted:</b> Cash, GCash, bank transfer
        </p>

        <div className='w-full h-[1rem] md:h-[1.5rem] bg-[#6F4E37] absolute bottom-0' />
      </div>
    </>
  )
}

export default Landing
