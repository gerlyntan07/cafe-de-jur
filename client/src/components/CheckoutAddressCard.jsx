import React from 'react'
import axios from '../hooks/AxiosConfig.js'
import { useEffect } from 'react'
import { useState } from 'react'

function CheckoutAddressCard({ setLoading }) {
    const [contactDetails, setContactDetails] = useState({});
    const [addressFields, setAddressFields] = useState({
        region: '',
        province: '',
        city: '',
        barangay: '',
        subdivision: '',
        street: ''
    });

    useEffect(() => {
        const getUserData = async () => {
            try {
                setLoading(true);
                const res = await axios.get('/checkoutUserProfile');
                const data = res.data.userData;
                setContactDetails(data);

                // Parse address
                const address = data.address || '';
                const parts = address.split(',').map(p => p.trim());

                if (parts.length === 5) {
                    const [street, subdivision, barangay, city, region] = parts;

                    setAddressFields({
                        region,
                        province: region === 'NCR' ? 'Metro Manila' : '[Insert Province Lookup Here]',
                        city,
                        barangay,
                        subdivision,
                        street
                    });
                }
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
        <div className='w-full md:w-[60%] lg:w-[40%] rounded-[10px] bg-white shadow-lg flex flex-col items-center justify-center py-5'>
            <p className='w-full font-noticia font-bold text-lg pb-3 border-b-1 pl-5'>Deliver to</p>

            <div className='w-full flex flex-col items-center justify-center'>
                <div className={profileForm}>
                    <label className={labelStyle}>Region</label>
                    <input disabled className={inputStyle} value={addressFields.region || ''} />
                </div>
                <div className={profileForm}>
                    <label className={labelStyle}>Province</label>
                    <input disabled className={inputStyle} value={addressFields.province || ''} />
                </div>
            </div>

            <div className='w-full flex flex-col items-center justify-center'>
                <div className={profileForm}>
                    <label className={labelStyle}>City</label>
                    <input disabled className={inputStyle} value={addressFields.city || ''} />
                </div>
                <div className={profileForm}>
                    <label className={labelStyle}>Barangay</label>
                    <input disabled className={inputStyle} value={addressFields.barangay || ''} />
                </div>
            </div>

            <div className={profileForm}>
                <label className={labelStyle}>Village/Subdivision</label>
                <input disabled className={inputStyle} value={addressFields.subdivision || ''} />
            </div>

            <div className={profileForm}>
                <label className={labelStyle}>Street</label>
                <input disabled className={inputStyle} value={addressFields.street || ''} />
            </div>
        </div>

    )
}

export default CheckoutAddressCard