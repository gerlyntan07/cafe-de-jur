import React from 'react'
import AdminHeader from '../components/AdminHeader.jsx';
import axios from '../hooks/AxiosConfig.js';
import { useState } from 'react';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

function AdminDashboard() {
  const [prodCount, setProdCount] = useState(null);
  const [soldCount, setSoldCount] = useState(null);
  useEffect(() => {
    const fetchProdCount = async() => {
      try{
        const res = await axios.get('/getProductCount');
        setProdCount(res.data.product);
        setSoldCount(res.data.sold);
        
      } catch(err){
        console.error('Error getting product count:', err);
              toast.error('Unable to fetch values', {
                autoClose: 3000,
              })
      }
    }

    fetchProdCount();
  }, [prodCount, soldCount])

  const cardStyle = `bg-white shadow-md w-[70%] rounded-xl py-5 grid grid-row-2 place-items-center gap-1 lg:py-10`;
  const cardTitle = `font-noticia text-xl lg:text-[2xl]`;
  const cardValue = `font-noticia font-bold text-[3rem] lg:text-[5rem]`;
  return (
    <div className='flex flex-col w-full lg:flex-row'>
      <ToastContainer position="bottom-right" />
      <AdminHeader />
      <section id='admin-dashboard' className='bg-gray-100 w-full h-screen flex items-center justify-center lg:items-start'>
        <div className='flex flex-col w-full items-center justify-center gap-10 md:flex-row md:w-[90%] xl:w-[70%] 2xl:w-[60%] xl:gap-15 lg:mt-50'>
          <div className={cardStyle}>
          <p className={cardTitle}>Total Orders</p>
          <p className={cardValue}>{soldCount === null || soldCount === 0 ? '0' : soldCount}</p>
        </div>

        <div className={cardStyle}>
          <p className={cardTitle}>Total Products</p>
          <p className={cardValue}>{prodCount}</p>
        </div>
        </div>        
      </section>
    </div>
  )
}

export default AdminDashboard