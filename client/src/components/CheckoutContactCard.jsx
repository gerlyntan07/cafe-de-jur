import React from 'react'
import axios from '../hooks/AxiosConfig.js'
import { useEffect } from 'react'
import { useState } from 'react'

function CheckoutContactCard({ setLoading }) {
    const [contactDetails, setContactDetails] = useState({});

    useEffect(() => {
        const getUserData = async () => {
            try {
                setLoading(true);
                const res = await axios.get('/checkoutUserProfile');
                setContactDetails(res.data.userData);
            } catch (err) {
                console.error('Unexpected error:', err.message);
                setContactDetails([]);
            } finally {
                setLoading(false);
            }
        }

        getUserData();
    }, [setLoading])

    const profileForm = `bg-inputGray w-[90%] mt-5 flex flex-col pl-3 rounded-[10px] justify-center`;
    const labelStyle = 'font-noticia text-gray-500 text-sm';
    const inputStyle = 'outline-none font-noticia font-bold text-gray-600 text-base';

    return (
        <div className='w-full md:w-full rounded-[10px] bg-white shadow-lg flex flex-col items-center justify-center py-5'>
            <p className='w-full font-noticia font-bold text-lg pb-3 border-b-1 pl-5'>Contact Details</p>
            <div className='w-full xl:w-[90%] flex flex-col xl:flex-row xl:gap-3 items-center justify center'>
                <div className={profileForm}>
                    <label className={labelStyle} htmlFor="">First Name</label>
                    <input disabled type="text" className={inputStyle} name="firstname" value={contactDetails.firstname || ''} />
                </div>

                <div className={profileForm}>
                    <label className={labelStyle} htmlFor="">Last Name</label>
                    <input disabled type="text" className={inputStyle} name="lastname" value={contactDetails.lastname || ''} />
                </div>
            </div>
            <div className={profileForm}>
                <label className={labelStyle} htmlFor="">Last Name</label>
                <input disabled type="text" className={inputStyle} name="phoneNum" value={contactDetails.phoneNum || ''} />
            </div>
        </div>

    )
}

export default CheckoutContactCard