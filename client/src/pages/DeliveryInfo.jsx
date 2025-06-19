import React, { useEffect, useState } from 'react';
import cafeLogo from '/cafedejur-logo.png';
import { useNavigate } from 'react-router-dom';

function Tracking() {
  const navigate = useNavigate();
  const [statusIndex, setStatusIndex] = useState(1);
  const [arrivalRange, setArrivalRange] = useState('');
  const [isDelivered, setIsDelivered] = useState(false);

  const statuses = [
    'Order being validated',
    'Order being prepared',
    'Rider on his way to store',
    'Delivery on its way',
    'Order delivered',
  ];

  useEffect(() => {
    const now = new Date();
    const minArrival = new Date(now.getTime() + 5 * 60000);
    const maxArrival = new Date(now.getTime() + 10 * 60000);

    const formatTime = (date) => {
      const options = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };
      return date.toLocaleTimeString('en-US', options);
    };

    setArrivalRange(`${formatTime(minArrival)} - ${formatTime(maxArrival)}`);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => {
        if (prev < statuses.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsDelivered(true);
          return prev;
        }
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='w-full h-screen bg-[#f6f6f6] flex items-center justify-center'>
      <div className='bg-white w-[90%] md:w-[60%] lg:w-[40%] rounded-2xl shadow-md p-6 flex flex-col items-center'>
        <img src={cafeLogo} alt="CAFÉ de JÚR" className='w-20 h-20 lg:w-30 lg:h-30 mb-6' />

        <div className='w-full flex flex-col gap-4 relative'>
          {statuses.map((step, index) => (
            <div key={index} className='flex items-start gap-4'>
              <div className='flex flex-col items-center'>
                <div
                  className={`w-3 h-3 rounded-full ${
                    index === statusIndex ? 'bg-[#3c2c17]' : 'bg-gray-300'
                  }`}
                ></div>
                {index !== statuses.length - 1 && (
                  <div className='w-[2px] h-8 bg-gray-300 mt-1'></div>
                )}
              </div>
              <p
                className={`font-noticia ${
                  index === statusIndex
                    ? 'text-[#3c2c17] font-bold'
                    : 'text-gray-500'
                }`}
              >
                {step}
              </p>
            </div>
          ))}
        </div>

        <div className='w-full border-t border-gray-300 mt-8 pt-4 text-center'>
          <p className='font-noticia text-sm text-gray-600'>Estimated Order Arrival Time</p>
          <p className='font-noticia text-lg font-bold'>{arrivalRange}</p>
        </div>

        {isDelivered && (
          <div className='mt-6 w-full bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md text-center'>
            <p className='font-noticia font-bold text-md'>Your order has been successfully delivered!</p>
            <p className='font-noticia text-sm mt-1'>Thank you for ordering at CAFÉ de JÚR!</p>
            <button className='mt-3 font-noticia bg-white py-2 px-5 border-1 border-gray-300 cursor-pointer rounded-md' onClick={() => navigate('/')}>Go to home</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tracking;
