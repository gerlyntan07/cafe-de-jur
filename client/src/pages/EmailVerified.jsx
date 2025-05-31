import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import LoginPopup from '../components/LoginPopup';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import menubg from '../assets/menubg.png';

function EmailVerified() {
  useEffect(() => {
      document.title = "Email Verified | CAFÉ de JÚR";
    }, []);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const toggleLogin = () => {
        setIsLoginOpen(prev => !prev);
        if (isLoginOpen){
            document.title = "Email Verified | CAFÉ de JÚR";
        }
    }
  return (
    <>      
      <Header toggleLogin={toggleLogin} />
      {isLoginOpen && <LoginPopup toggleLogin={toggleLogin} />}
      <div style={{ backgroundImage: `url(${menubg})`, backgroundColor: 'rgba(0, 0, 0, 0.06)' }} id='signup' className='h-screen w-full flex flex-col items-center justify-center pt-[10rem] 2xl:pt-[12rem] 2xl:pb-[8rem] pb-[5rem]'>
        <MarkEmailReadOutlinedIcon fontSize="inherit"
          sx={{
            fontSize: {
              xs: '150px',
              sm: '150px',
              md: '230px',
              lg: '230px',
              xl: '280px',
            },
          }} />
        <p className='font-noticia font-bold text-lg md:text-xl lg:text-2xl my-2'>Thank you for signing up!</p>
        <p className='w-[80%] text-center font-noticia text-sm md:text-lg lg:text-lg md:w-[60%] lg:w-[40%]'>Your coffee journey starts here! Check your registered email and click on the link provided to activate your account.</p>

        <button onClick={toggleLogin} className='font-noticia font-bold text-[15px] md:text-[16px] md:py-3 px-20 bg-lightBrownBG rounded-full py-2 hover:bg-lightBrown focus:bg-lightBrown focus:outline-2 focus:outline-offset-2 focus:outline-lightBrown cursor-pointer mt-5'>Login Now</button>
      </div>
    </>
  )
}

export default EmailVerified