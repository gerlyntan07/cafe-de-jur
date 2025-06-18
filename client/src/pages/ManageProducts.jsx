import React, { useEffect, useState } from 'react'
import AdminHeader from '../components/AdminHeader.jsx';
import SearchIcon from '@mui/icons-material/Search';
import axios from '../hooks/AxiosConfig.js';

function ManageProducts() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRequests, setFilteredRequests] = useState([]);
    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await axios.get('/getProducts');
                setFilteredRequests(res.data.productList);
            } catch (err) {
                console.error('Failed to fetch products:', err);
            }
        }

        getProducts();
    }, []);

    return (
        <div className='flex flex-col w-full lg:flex-row bg-gray-100 items-start justify-start'>
            <AdminHeader />
            <section id='admin-dashboard' className='w-full pt-35 flex flex-col items-center justify-center'>
                <div className='w-[90%] flex flex-col items-start justify-start'>
                    <form className='flex w-[60%] items-center px-2 border-b-2 border-gray-300 py-1'>
                        <SearchIcon className='text-gray-600 mr-2' />
                        <input
                            className='font-noticia w-full text-base focus:outline-none'
                            type='text'
                            placeholder='Search here'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    <button className='bg-lightBrownBG py-2 px-4 font-noticia cursor-pointer mt-4'>Add Product</button>
                </div>
            </section>
        </div>
    )
}

export default ManageProducts