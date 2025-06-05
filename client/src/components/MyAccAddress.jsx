import axios from 'axios';
import hook from '../hooks/AxiosConfig.js';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';

const MyAccAddress = () => {
    const [isAdd, setIsAdd] = useState(false);
    const [noAddress, setNoAddress] = useState(false);
    const [addressInfo, setAddressInfo] = useState('');
    const [isNCR, setIsNCR] = useState(false);

    const [regionLists, setRegionLists] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [brgys, setBrgys] = useState([]);

    const [selectedRegionCode, setSelectedRegionCode] = useState('');
    const [selectedRegionName, setSelectedRegionName] = useState('');
    const [selectedProvinceCode, setSelectedProvinceCode] = useState('');
    const [selectedProvinceName, setSelectedProvinceName] = useState('');
    const [selectedCityCode, setSelectedCityCode] = useState('');
    const [selectedCityName, setSelectedCityName] = useState('');
    const [selectedBrgyCode, setSelectedBrgyCode] = useState('');
    const [selectedBrgyName, setSelectedBrgyName] = useState('');
    const [village, setVillage] = useState('');
    const [street, setStreet] = useState('');

    useEffect(() => {
        const getAddress = async () => {
            try {
                const res = await hook.get('/getAddress');
                if (res.data.message === 'Address not found') {
                    setNoAddress(true);
                } else if (res.data.message === 'Address found') {
                    setNoAddress(false);
                    setAddressInfo(res.data.userAddress);
                }
            } catch (err) {
                console.error('Error getting address:', err);
            }
        }

        getAddress();
    }, []);

    useEffect(() => {
        axios.get('https://psgc.gitlab.io/api/island-groups/luzon/regions/')
            .then((res) => {
                setRegionLists(res.data);
            })
            .catch((err) => {
                console.error('Error getting regions:', err);
            })
    }, []);

    const onRegionChange = (e) => {
        const selectedCode = e.target.value;
        const selectedName = regionLists.find(r => r.code === selectedCode)?.name || '';

        setSelectedRegionCode(selectedCode);
        setSelectedRegionName(selectedName);

        if (e.target.value === '130000000') {
            setIsNCR(true);
            setSelectedProvinceCode('');
            setSelectedProvinceName('');
        } else {
            setIsNCR(false);
        }        
    };

    useEffect(() => {
        if (selectedRegionCode && !isNCR) {
            axios.get(`https://psgc.gitlab.io/api/regions/${selectedRegionCode}/provinces/`)
                .then((res) => {
                    setProvinces(res.data);
                })
                .catch((err) => {
                    console.error('Error getting provinces:', err);
                });
        }
    }, [selectedRegionCode, isNCR]);

    const onProvinceChange = (e) => {
        const selectedCode = e.target.value;
        const selectedName = provinces.find(r => r.code === selectedCode)?.name || '';

        setSelectedProvinceCode(selectedCode);
        setSelectedProvinceName(selectedName);
        
    }

    useEffect(() => {
        if (selectedProvinceCode && !isNCR) {
            axios.get(`https://psgc.gitlab.io/api/provinces/${selectedProvinceCode}/cities-municipalities/`)
                .then((res) => {
                    setCities(res.data);
                })
                .catch((err) => {
                    console.error('Error getting provinces:', err);
                });
        } else if (isNCR) {
            axios.get(`https://psgc.gitlab.io/api/regions/${selectedRegionCode}/cities-municipalities/`)
                .then((res) => {
                    setCities(res.data);
                })
                .catch((err) => {
                    console.error('Error getting provinces:', err);
                });
        }
    }, [selectedProvinceCode, isNCR, selectedRegionCode]);

    const onCityChange = (e) => {
        const selectedCode = e.target.value;
        const selectedName = cities.find(r => r.code === selectedCode)?.name || '';

        setSelectedCityCode(selectedCode);
        setSelectedCityName(selectedName);
        
    }

    useEffect(() => {
        if (selectedCityCode) {
            axios.get(`https://psgc.gitlab.io/api/cities-municipalities/${selectedCityCode}/barangays/`)
                .then((res) => {
                    setBrgys(res.data);
                })
                .catch((err) => {
                    console.error('Error getting provinces:', err);
                });
        }
    }, [selectedCityCode]);

    const onBrgyChange = (e) => {
        const selectedCode = e.target.value;
        const selectedName = brgys.find(r => r.code === selectedCode)?.name || '';

        setSelectedBrgyCode(selectedCode);
        setSelectedBrgyName(selectedName);
        
    }

    const handleCancel = () => {
        setIsAdd(false);
        setVillage('');
        setStreet('');
        setSelectedRegionCode('');
        setSelectedRegionName('');
        setSelectedProvinceCode('');
        setSelectedProvinceName('');
        setSelectedCityCode('');
        setSelectedCityName('');
        setSelectedBrgyCode('');
        setSelectedBrgyName('');
        setIsNCR(false);
        setProvinces([]);
        toast.dismiss();
    }

    const handleSaveAddress = async () => {
        if (
            selectedRegionName === '' ||
            (!isNCR && selectedProvinceName === '') ||
            selectedCityName === '' ||
            selectedBrgyName === '' ||
            village === '' ||
            street === ''
        ) {
            toast.error('All fields are required.', {
                autoClose: 3000
            })
            return;
        }

        const formattedAddress = `${street}, ${village}, ${selectedBrgyName}, ${selectedCityName}, ${isNCR ? selectedRegionName : `${selectedProvinceName}, ${selectedRegionName}`}`;        

        try {
            const res = await hook.post('/saveAddress', { formattedAddress });
            if (res.data.message === 'successful') {
                toast.success('Address added successfully.', {
                    autoClose: 2000
                })
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } catch (err) {
            console.error('Error adding new address:', err);
            toast.error('Error adding new address.', {
                autoClose: 3000
            });
        }
    }

    const cancelSaveBtn = `w-full font-noticia font-bold text-sm md:text-md text-gray-700 rounded-full py-2 mt-5 cursor-pointer`;
    const profileForm = `${isAdd ? 'ring-1 ring-gray-400 ring-offset-2' : ``} bg-inputGray w-[90%] mt-5 flex flex-col pl-3 rounded-[10px] justify-center`;
    const inputStyle = 'outline-none font-noticia font-bold text-gray-600 text-md py-2';
    return (
        <div className='w-[90%] md:w-[60%] lg:w-[40%] rounded-[10px] bg-white shadow-lg flex flex-col items-center justify-center py-5'>
            <p className='w-full font-noticia font-bold text-md pb-3 border-b-1 pl-5 mb-5 lg:text-lg'>My Address</p>
            {noAddress && !isAdd && (
                <p className='mt-5 font-noticia text-gray-500 text-md italic'>No address found</p>
            )}
            {!noAddress && !isAdd && (
                <div className='w-[90%] flex flex-col items-center justify-center xl:flex-row xl:py-10 xl:justify-between xl:gap-5'>
                    <p className='font-noticia text-md md:text-lg xl:w-[70%]'>{addressInfo}</p>
                    <button className={`${cancelSaveBtn} bg-lightBrownBG xl:mt-0 xl:w-[30%]`} onClick={() => setIsAdd(true)}>Edit</button>
                </div>
            )}

            {isAdd && (
                <>
                    <div className={profileForm}>
                        <select className={inputStyle} id="" name='region' value={selectedRegionCode} onChange={onRegionChange}>
                            <option value="" disabled>Region</option>
                            {regionLists.map((region, index) => {
                                return (<option key={index} value={region.code}>{region.name}</option>)
                            })}
                        </select>
                    </div>

                    {!isNCR && (
                        <div className={profileForm}>
                            <select className={inputStyle} id="" name='province' value={selectedProvinceCode} onChange={onProvinceChange}>
                                <option value="" disabled>Province</option>
                                {provinces.map((province, index) => {
                                    return (<option key={index} value={province.code}>{province.name}</option>)
                                })}
                            </select>
                        </div>
                    )}

                    <div className={profileForm}>
                        <select className={inputStyle} id="" name='city' value={selectedCityCode} onChange={onCityChange}>
                            <option value="" disabled>City</option>
                            {cities.map((city, index) => {
                                return (<option key={index} value={city.code}>{city.name}</option>)
                            })}
                        </select>
                    </div>

                    <div className={profileForm}>
                        <select className={inputStyle} id="" name='brgy' value={selectedBrgyCode} onChange={onBrgyChange}>
                            <option value="" disabled>Barangay</option>
                            {brgys.map((brgy, index) => {
                                return (<option key={index} value={brgy.code}>{brgy.name}</option>)
                            })}
                        </select>
                    </div>

                    <div className={profileForm}>
                        <input className={inputStyle} type="text" placeholder='Village/Subdivision' name='village' value={village} onChange={(e) => setVillage(e.target.value)} />
                    </div>

                    <div className={profileForm}>
                        <input className={inputStyle} type="text" placeholder='House No./Floor/Room No./Street' name='street' value={street} onChange={(e) => setStreet(e.target.value)} />
                    </div>
                </>
            )}

            <div className={`${isAdd ? `flex` : `hidden`} w-[90%] flex-row items-center justify-center gap-3`}>
                <button className={`${cancelSaveBtn} border-1`}
                    onClick={handleCancel}>Cancel</button>
                <button className={`${cancelSaveBtn} bg-lightBrownBG`} onClick={handleSaveAddress}>Save</button>
            </div>
            {noAddress && (
                <button className={`${!isAdd ? `flex` : `hidden`} justify-center items-center text-center font-noticia font-bold text-gray-700 rounded-full py-2 bg-lightBrownBG w-[90%] mt-10 text-md cursor-pointer`} onClick={() => setIsAdd(true)}>Add Address</button>
            )}
        </div>
    )
}

export default MyAccAddress
