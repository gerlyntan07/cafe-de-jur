import hook from '../hooks/AxiosConfig.js';
import React, { useEffect, useState } from 'react'

const MyAccAddress = () => {
    const [isAdd, setIsAdd] = useState(false);
    const [noAddress, setNoAddress] = useState(false);

    useEffect(() => {
        const getAddress = async () => {
            try {
                const res = await hook.get('/getAddress');
                if (res.data.message === 'Address not found') {
                    setNoAddress(true);
                } else if (res.data.message === 'Address found') {
                    setNoAddress(false);
                }
            } catch (err) {
                console.error('Error getting address:', err);
            }
        }

        getAddress();
    }, []);

    const cancelSaveBtn = `w-full font-noticia font-bold text-sm md:text-md text-gray-700 rounded-full py-2 mt-5 cursor-pointer`;
    const profileForm = `${isAdd ? 'ring-1 ring-gray-400 ring-offset-2' : ``} bg-inputGray w-[90%] mt-5 flex flex-col pl-3 rounded-[10px] justify-center`;
    const inputStyle = 'outline-none font-noticia font-bold text-gray-600 text-md py-3';
    return (
        <div className='w-[90%] md:w-[60%] lg:w-[40%] rounded-[10px] bg-white shadow-lg flex flex-col items-center justify-center py-5'>
            <p className='w-full font-noticia font-bold text-md pb-3 border-b-1 pl-5'>Contact Details</p>
            {noAddress && !isAdd && (
                <p className='mt-5 font-noticia text-gray-500 text-md italic'>No address found.</p>
            )}

            {isAdd && (
                <div className={profileForm}>
                    <input type="text" className={inputStyle} placeholder='Street Name/Floor/Room #' />
                </div>
            )}

            <div className={`${isAdd ? `flex` : `hidden`} w-[90%] flex-row items-center justify-center gap-3`}>
                <button className={`${cancelSaveBtn} border-1`}
                    onClick={() => {
                        setIsAdd(false);
                    }}>Cancel</button>
                <button className={`${cancelSaveBtn} bg-lightBrownBG`}>Save</button>
            </div>


            <button className={`${!isAdd ? `flex` : `hidden`} justify-center items-center text-center font-noticia font-bold text-gray-700 rounded-full py-2 bg-lightBrownBG w-[90%] mt-10 text-md cursor-pointer`} onClick={() => setIsAdd(true)}>Add New Address</button>
        </div>
    )
}

export default MyAccAddress
