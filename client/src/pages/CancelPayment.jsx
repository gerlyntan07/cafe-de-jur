import React from 'react'
import { useNavigate } from 'react-router-dom'
import CancelIcon from '@mui/icons-material/Cancel';

function CancelPayment() {
    const navigate = useNavigate();
    document.title = `Payment Cancelled`

    return (
        <div className='w-full h-screen bg-inputGray flex items-center justify-center'>
            <div className='bg-white px-5 py-15 rounded-xl shadow-lg w-3/4 md:w-2/4 xl:w-1/3 text-center items-center justify-center'>
                <CancelIcon className='text-red-500 mb-2' sx={{fontSize: '5rem'}} />
                <p className='font-inika font-bold text-xl'>Payment Cancelled</p>
                <p className='font-inika text-base pt-2 pb-5'>You have cancelled your payment via Debit/Credit Card. The contents of the shopping cart have been saved for you.</p>

                <button className='bg-lightBrownBG py-2 px-4 cursor-pointer font-noticia rounded-sm hover:bg-[#dec9a0] transition-colors' onClick={() => navigate('/')}>Exit</button>
            </div>
        </div>
    )
}

export default CancelPayment