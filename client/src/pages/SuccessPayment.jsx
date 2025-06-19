import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../hooks/AxiosConfig.js';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function SuccessPayment() {
  const navigate = useNavigate();
  useEffect(() => {
  const confirmOrder = async () => {
    try {
      const order = JSON.parse(localStorage.getItem('orderData'));
      if (order) {
        await axios.post('/store-order', order);
        localStorage.removeItem('orderData');
      }
    } catch (err) {
      console.error('Order store failed:', err);
    }
  };

  confirmOrder();
}, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/delivery-info');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className='w-full h-screen bg-inputGray flex items-center justify-center'>
      <div className='bg-white px-5 py-15 rounded-xl shadow-lg w-3/4 md:w-2/4 xl:w-1/3 text-center items-center justify-center'>
        <CheckCircleIcon className='text-green-500 mb-2' sx={{fontSize: '5rem'}} />
        <p className='font-inika font-bold text-xl'>Payment Successful</p>
        <p className='font-inika text-base pt-2 pb-5'>
          Your order is being processed. You will be redirected to delivery info shortly.
        </p>
      </div>
    </div>
  );
}

export default SuccessPayment;
