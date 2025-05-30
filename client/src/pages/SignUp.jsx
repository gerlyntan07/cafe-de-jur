import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import LoginPopup from '../components/LoginPopup';
import { Link, useLocation } from "react-router-dom";
import menubg from '../assets/menubg.png';
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import CheckIcon from '@mui/icons-material/Check';

function SignUp() {
    const API = import.meta.env.VITE_API_URL;
    const location = useLocation();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [values, setValues] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        consent: false,
        dataPriv: false
    });
    const [isPassValid, setIsPassValid] = useState(false);
    const [notChecked, setNotChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isFailed, setIsFailed] = useState(false);

    const toggleLogin = () => {
        setIsLoginOpen(prev => !prev);
    }
    useEffect(() => {
        // When route changes, and hash is #signup, scroll to that element
        if (location.hash === '#signup') {
            const el = document.getElementById('signup');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
    }

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setValues(prev => ({ ...prev, [name]: checked }));
    };

    useEffect(() => {
        if (values.password && values.confirmPassword) {
            setIsPassValid(values.password === values.confirmPassword);
        } else {
            setIsPassValid(true);
        }
    }, [values.password, values.confirmPassword]);

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (values.consent === false || values.dataPriv === false) {
            setNotChecked(true);
            return;
        }

        setIsLoading(true);

        if (isPassValid) {
            try {
                const res = await axios.post(`${API}/register`, values);
                if(res.data.error === 'Email already exists') {
                    setIsFailed(true);
                    setIsLoading(false);
                    return;
                }
                setIsLoading(false);
                setIsSubmitted(true);
                setValues({
                    firstname: '',
                    lastname: '',
                    email: '',
                    phone: '',
                    password: '',
                    confirmPassword: '',
                    consent: false,
                    dataPriv: false
                })
            } catch (err) {
                setIsFailed(true);
                setIsLoading(false);
                console.error(err);                
            }
        }
    }

    const inputStyle = 'w-full xl:w-[47%] bg-inputGray py-3 font-inika text-[14px] px-3 my-2 rounded outline-none focus:bg-gray-300 transition-all duration-200 md:text-[15px]';
    const checkboxStyle = 'w-5 h-5 cursor-pointer self-start';
    const checkboxLabelStyle = 'font-noticia font-bold text-[14px] ml-2 md:text-[15px] leading-5';

    return (
        <>
            <Header toggleLogin={toggleLogin} />
            {isLoginOpen && <LoginPopup toggleLogin={toggleLogin} />}
            {isSubmitted && (
                <Stack sx={{
                    width: '100%',
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    zIndex: (theme) => theme.zIndex.snackbar,
                }} spacing={2}>
                    <Alert variant="filled" severity="success">
                        Registration successful! Please verify your email.
                    </Alert></Stack>
            )}
            {isFailed && (
                <Stack sx={{
                    width: '100%',
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    zIndex: (theme) => theme.zIndex.snackbar,
                }} spacing={2}>
                    <Alert variant="filled" severity="error">
                        Email already exists
                    </Alert></Stack>
            )}
            {isLoading && (
                <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: 12000 })}
                    open={open}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}

            <section style={{ backgroundImage: `url(${menubg})`, backgroundColor: 'rgba(0, 0, 0, 0.06)' }} id='signup' className='md:h-screen xl:h-auto w-full flex flex-col items-center justify-center pt-[10rem] 2xl:pt-[12rem] 2xl:pb-[8rem] pb-[5rem]'>
                <p className='font-noticia font-bold text-center text-[18px] md:text-[20px]'>Ready to sign up? Your cup awaits.</p>
                <p className='w-[90%] font-noticia text-center text-[14px] md:text-[17px]'>Tell us more about you so we can the start brewing magic.</p>

                <form onSubmit={handleSignUp} autoComplete='off' className='w-[90%] md:w-[80%] 2xl:w-[70%] bg-white rounded-[20px] shadow-lg flex flex-col items-center justify-center py-10 xl:py-15 mt-5'>
                    <div className='w-[85%] flex flex-col items-center justify-center'>

                        <label className='w-full font-noticia font-bold text-left text-[15px] md:text-[16px]'>User Details</label>
                        <div className='w-full flex flex-col xl:flex-row flex-wrap items-center justify-center xl:justify-between'>
                            <input className={inputStyle} type="text" placeholder='First Name' name="firstname" onChange={handleChange} value={values.firstname} required />
                            <input className={inputStyle} type="text" placeholder='Last Name' name="lastname" value={values.lastname} onChange={handleChange} required />
                        </div>

                        <label className='w-full font-noticia font-bold text-left text-[15px] mt-5 md:text-[16px]'>Login & Contact Details</label>
                        <div className='w-full flex flex-col xl:flex-row flex-wrap items-start justify-center xl:justify-between'>
                            <input className={inputStyle} type="email" placeholder='Email' name='email' value={values.email} onChange={handleChange} required />
                            <input className={inputStyle} type="tel" placeholder='Contact Number (e.g. 09123456789)' name='phone' value={values.phone} onChange={handleChange} required />
                            <input className={inputStyle} type="password" placeholder='Password' name='password' value={values.password} onChange={handleChange} required />
                            <div className='w-full xl:w-[47%] flex flex-col items-center justify-center'>
                                <input className='w-full bg-inputGray py-3 font-inika text-[14px] px-3 my-2 rounded outline-none focus:bg-gray-300 transition-all duration-200 md:text-[15px]' type="password" placeholder='Confirm Password' name='confirmPassword' value={values.confirmPassword} onChange={handleChange} required />
                                {!isPassValid && (
                                    <p className='w-full text-left text-red-600 text-[12px] font-inika md:text-[14px] leading-none'>Passwords do not match.</p>
                                )}
                            </div>
                        </div>

                        <div className='w-[90%] flex flex-row items-start justify-start mt-5 xl:mt-7'>
                            <input className={checkboxStyle} type="checkbox" name="consent" onChange={handleCheckboxChange} checked={values.consent} />
                            <label className={checkboxLabelStyle}>
                                I consent to the use and processing of my personal information. I am aware of my data privacy rights including the option to withdraw my consent at any time.
                            </label>
                        </div>

                        <div className='w-[90%] flex flex-row items-start justify-start mt-3 mb-5 xl:mt-7 xl:mb-8'>
                            <input className={checkboxStyle} type="checkbox" name="dataPriv" onChange={handleCheckboxChange} checked={values.dataPriv} />
                            <label className={checkboxLabelStyle}>
                                I have fully read, understood and agree to the <Link className='text-gray-500'>Data Privacy Policy, Terms & Condition</Link> of CAFE de JUR.
                            </label>
                        </div>
                        {notChecked && (
                            <p className='w-[90%] mb-3 text-left text-red-600 text-[12px] font-inika md:text-[14px] leading-none'>Please agree to the terms and conditions to proceed.</p>
                        )}

                        <button type='submit' className='font-noticia text-[15px] md:text-[16px] md:py-3 w-[70%] xl:w-[50%] 2xl:w-[40%] bg-lightBrownBG rounded-full py-2 hover:bg-lightBrown focus:bg-lightBrown focus:outline-2 focus:outline-offset-2 focus:outline-lightBrown cursor-pointer'>Create account</button>
                    </div>
                </form>
            </section>
        </>
    )
}

export default SignUp