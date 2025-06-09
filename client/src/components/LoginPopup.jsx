import React, { useEffect, useState } from 'react'
import { BsX } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import logo from '/cafedejur-logo.png';
import axios from '../hooks/AxiosConfig.js';
import Card from '@mui/material/Card';
import ErrorIcon from '@mui/icons-material/Error';

function LoginPopup({ toggleLogin }) {
    const [loginErrorMsg, setLoginErrorMsg] = useState('');
    const [isLoginError, setIsLoginError] = useState(false);

    useEffect(() => {
        document.title = "Log In | CAFÉ de JÚR";
    }, []);


    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = ''; // Reset on unmount
        };
    }, []);


    const [values, setValues] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        setIsLoginError(false);
        setLoginErrorMsg('');
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
    }

    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`/login`, values);
            setIsLoginError(false);
            navigate('/redirect-after-login');            
        } catch (err) {
            console.error('Login failed:', err.response?.data || err.message);
            setIsLoginError(true);
            setLoginErrorMsg(err.response?.data?.message || 'Login error');
        }
    }

    const inputStyle = 'w-full bg-inputGray py-3 font-inika text-[14px] px-3 my-2 rounded outline-none focus:bg-gray-300 transition-all duration-200 md:text-[15px]';

    return (
        <section id='loginPopup' className='fixed top-0 left-0 w-full h-full bg-black/50 z-[10000] flex items-center justify-center'>
            <form autoComplete='off' onSubmit={handleLogin} className='w-[90%] md:w-[60%] lg:w-[40%] 2xl:w-[30%] flex flex-col items-center justify-center rounded-[20px] shadow-lg bg-white overflow-hidden'>
                <button className='w-[85%] flex items-center justify-end mt-5 cursor-pointer' type='button' onClick={toggleLogin}><BsX color='black' size={25} /></button>
                <div className='w-full flex items-center justify-center'>
                    <img src={logo} className='w-[25%] object-contain' alt="" />
                </div>
                <p className='font-inika font-bold text-[15px] mt-5 md:text-[17px]'>The baristas missed you. Let’s brew!</p>
                <p className='font-inika text-[13px] mb-2 md:text-[15px]'>Sign in to your account.</p>

                <div className='w-[80%] flex flex-col items-center justify-center overflow-hidden'>
                    <input className={inputStyle} name='email' value={values.email} onChange={handleChange} placeholder='Email' type="email" required />
                    <input className={inputStyle} name='password' value={values.password} onChange={handleChange} placeholder='Password' type="password" autoComplete="new-password" required />
                </div>
                {isLoginError && (
                    <Card sx={{
                        bgcolor: 'rgb(255, 209, 209)',
                        border: 1,
                        borderColor: 'rgb(255, 145, 145)',
                        display: 'flex',
                        flexDirection: 'row',
                        paddingY: 1,
                        width: '80%',
                        marginBottom: 3,
                        alignItems: 'center',
                    }} variant="outlined">
                        <ErrorIcon sx={{ color: 'red', marginX: 1 }} />
                        <p className='font-inika text-red-600 text-sm'>{loginErrorMsg}</p>
                    </Card>
                )}

                <Link className='font-inika w-[80%] text-right text-[13px] text-red-600 leading-none md:text-[15px]'>Forgot password?</Link>

                <button type='submit' className='font-inika text-[15px] md:text-[16px] md:py-3 w-[80%] bg-lightBrownBG rounded-full py-2 mt-5 hover:bg-lightBrown focus:bg-lightBrown focus:outline-2 focus:outline-offset-2 focus:outline-lightBrown cursor-pointer'>Log in</button>
                <div className='h-[2px] w-[80%] bg-gray-300 my-7'> </div>
                <p className='w-[70%] text-center font-inika text-[13px] mb-8 md:text-[15px] md:mb-15'>Don’t have an account yet? <Link className='text-red-600' to='/signup'>Sign up</Link> and sip up!</p>
            </form>
        </section>
    )
}

export default LoginPopup