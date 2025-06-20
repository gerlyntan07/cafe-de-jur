import React, { useEffect } from 'react'
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import CheckoutContactCard from '../components/CheckoutContactCard';
import CheckoutAddressCard from '../components/CheckoutAddressCard.jsx';
import LoginPopup from '../components/LoginPopup.jsx';
import Header from '../components/Header';
import axios from '../hooks/AxiosConfig.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast, ToastContainer } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import {
    PaymentElement,
    Elements,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51RbmEWQD9NH11xrS3oUYbHh2Cun7kNHpQWAczJcuux2V1Dcz8cNx1KAZSicFYA8dbgh1lfODd1CNDifn9JElpdXD00BulHEAz1');

function Checkout() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const deliveryFee = 35;

    const items = state?.items;

    useEffect(() => {
        if (!items || items.length === 0) {
            navigate('/');
        }

        document.title = `Check out | CAFÉ de JÚR`;
    }, []);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState('');
    useEffect(() => {
        axios.get('/session')
            .then((res) => {
                if (res.data.loggedIn === false) {
                    setIsAuthenticated(false);
                } else {
                    setUserName(res.data.firstname);
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

    const profileForm = `bg-inputGray w-[90%] flex flex-col pl-3 py-3 rounded-[10px] justify-center`;
    const labelStyle = 'font-noticia text-base text-gray-600';
    const orderDetailsStyle = `font-noticia text-base font-bold`;

    const totalRow = `flex flex-row items-center justify-between w-[90%]`;
    const totalLabel = `font-noticia text-base font-bold`;

    const totalItemPrice = items.reduce((sum, item) => sum + parseFloat(item.price || item.totalPrice), 0);
    const totalOrder = deliveryFee + totalItemPrice;


    //Handle payment
    const [userAddress, setUserAddress] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const handlePaymentChange = (e) => {
        setSelectedPaymentMethod(e.target.value);
    };

    const handlePlaceOrder = async () => {
        const stripe = await stripePromise;
        if (!selectedPaymentMethod) {
            toast.error('Please select a mode of payment before placing the order.', {
                autoClose: 2000
            })
            return;
        }
        const cleanedItems = items.map(item => ({
            ...item,
            productID: item.productID ?? parseInt(item.selectedProductID),
        }));


        if (selectedPaymentMethod === 'Card') {
            // Stripe
            const res = await axios.post('/store-order', { cleanedItems, totalItemPrice, paymentMethod: selectedPaymentMethod, address: userAddress });
            if (res.data.success) {
                const { data } = await axios.post('/create-checkout-session', { items });
                window.location.href = data.url;
            }
        } else {
            // COD
            await axios.post('/store-order', { cleanedItems, totalItemPrice, paymentMethod: selectedPaymentMethod, address: userAddress });
            toast.success("Order placed successfully!");
            navigate('/delivery-info');
        }
    }

    return (
        <>
            <Header toggleLogin={toggleLogin} isAuthenticated={isAuthenticated} userName={userName} />
            {isLoginOpen && <LoginPopup toggleLogin={toggleLogin} />}
            <ToastContainer hideProgressBar={true} position='bottom-center' />
            {loading && (
                <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={open}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
            <div className='w-full pt-45 2xl:pt-50 bg-inputGray pb-5'>
                <button className='ml-5 2xl:ml-10 flex flex-row items-center justify-start pl-3 cursor-pointer' onClick={() => navigate(-1)}>
                    <ArrowBackIcon sx={{ fontSize: 20 }} />
                    <p className='font-noticia ml-2 text-sm md:text-base lg:text-lg'>Back</p>
                </button>
            </div>


            <div className='w-full flex items-center justify-center bg-inputGray'>
                <div className='w-full xl:w-[90%] flex flex-col md:flex-row bg-inputGray pb-25 items-center justify-center md:items-start gap-5 lg:gap-10'>
                    <div className='w-[90%] md:w-[40%] flex flex-col items-center justify-center gap-5'>
                        <CheckoutContactCard setLoading={setLoading} />
                        <CheckoutAddressCard setLoading={setLoading} userAddress={setUserAddress} />

                        <div className='w-full md:w-full rounded-[10px] bg-white shadow-lg flex flex-col items-center justify-center py-5'>
                            <p className='w-full font-noticia font-bold text-lg pb-3 border-b-1 pl-5'>Payment</p>
                            <div className='w-full flex flex-col items-center justify-center py-5 xl:w-[90%] xl:flex-row gap-5 xl:items-start'>
                                <div className={`${profileForm}`}>
                                    <div className='flex flex-row items-center justify-start'>
                                        <input type="radio" value='COD' id='MOP' name='payment' onChange={handlePaymentChange} />
                                        <label htmlFor="cod" className="font-noticia text-base text-gray-800 ml-2">Cash on Delivery</label>
                                    </div>
                                </div>
                                <div className='bg-inputGray w-[90%] flex flex-row pl-3 py-3 rounded-[10px] justify-start'>
                                    <input type="radio" value='Card' id='MOP' name='payment' onChange={handlePaymentChange} />
                                    <label htmlFor="cod" className="font-noticia text-base text-gray-800 ml-2">Debit/Credit Card</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='w-[90%] md:w-[50%] flex flex-col items-center justify-center gap-5'>
                        <div className='w-full md:w-full rounded-[10px] bg-white shadow-lg flex flex-col items-center justify-center py-5'>
                            <p className='w-full font-noticia font-bold text-lg pb-3 border-b-1 pl-5'>Order Summary</p>

                            {items.map(item => (
                                <div key={`${item.productID}-${item.variantID ?? 'noVariant'}`} className='w-[90%] flex flex-row py-2 gap-2 justify-between'>
                                    <p className={`${orderDetailsStyle} w-[10%]`}>x{item.quantity}</p>
                                    <div className='flex flex-col w-[80%]'>
                                        <p className={`${orderDetailsStyle}`}>
                                            {item.name} {item.variant && `(${item.variant})`}
                                        </p>
                                        {item.addOns?.length > 0 && (
                                            <p className='text-sm font-semibold text-gray-400 truncate leading-none pb-1'>
                                                {item.addOns.map(a => a.name).join(', ')}
                                            </p>
                                        )}
                                    </div>
                                    <p className={`${orderDetailsStyle}`}>₱{(item.price ?? 0).toFixed(2)}</p>
                                </div>
                            ))}

                            <div className='border-t-1 border-gray-300 w-full py-3 flex flex-col gap-5 items-center justify-center'>
                                <div className={totalRow}>
                                    <p className={totalLabel}>Subtotal</p>
                                    <p className={totalLabel}>₱{totalItemPrice.toFixed(2)}</p>
                                </div>
                                <div className={totalRow}>
                                    <p className={totalLabel}>Delivery fee</p>
                                    <p className={totalLabel}>₱{deliveryFee}</p>
                                </div>
                                <div className={totalRow}>
                                    <p className={totalLabel}>Total</p>
                                    <p className={totalLabel}>₱{totalOrder.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className='fixed w-full py-2 px-5 bottom-0 left-0 bg-white flex flex-row items-center justify-between'>
                <div className='flex flex-col'>
                    <p className='text-base font-noticia font-bold leading-none'>Total</p>
                    <p className='text-lg font-noticia font-bold'>₱{totalOrder.toFixed(2)}</p>
                </div>

                <button className='bg-lightBrownBG py-2 px-4 text-lg font-noticia font-bold rounded-full cursor-pointer' onClick={handlePlaceOrder}>Place Order</button>
            </div>
        </>
    )
}

export default Checkout