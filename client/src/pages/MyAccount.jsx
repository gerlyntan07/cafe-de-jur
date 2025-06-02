import React, {useEffect, useState} from 'react'
import Header from '../components/Header.jsx';
import menubg from '../assets/menubg.png';
import axios from '../hooks/AxiosConfig.js';

function MyAccount({userData, isAuthenticated}) {  
  const [tab, setTab] = useState(1); 
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',    
  })

    useEffect(() => {
        document.title = "Account | CAFÉ de JÚR";
      }, []);    

      {/* TODO: Make inputs editable */}
    useEffect(() => {
      axios.get('/getUserData')
      .then((res) => {
        if(res.data.message === 'successful'){
          const user = res.data.customerData;
          setFormData({
            firstname: user.firstname || '',
            lastname: user.lastname || '',
            phone: user.phoneNum || '',
            email: user.email || '',
          });
        }
      })
      .catch((err) => {
        console.error('Error getting user data:', err);
      })
    })

    const handleFormChange = (e) => {
      const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

  const tabButtonClass = (tabIndex) =>
    `px-3 py-2 rounded font-medium transition-colors text-black ${
      tab === tabIndex ? 'bg-lightBrownBG' : 'bg-transparent'
    }`;

    const labelStyle = 'font-noticia text-gray-500 text-[15px]';
    const profileForm = 'bg-inputGray w-[90%] mt-3 flex flex-col';
    const inputStyle = 'outline-none font-noticia font-bold';

  return (
    <>
    <Header isAuthenticated={isAuthenticated} userName={userData?.firstname} />
    <section id='myAcc' style={{backgroundImage: `url(${menubg})`}} className='w-full flex flex-col items-center justify-center py-35'>
      <p className='font-noticia text-[20px] font-bold'>My Account</p>

      <div className='w-full flex flex-row items-center justify-evenly border-y-1'>
        <button className={tabButtonClass(1)} onClick={() => setTab(1)}>My Profile</button>
        <button className={tabButtonClass(2)} onClick={()=>{setTab(2)}}>My Addresses</button>
        <button className={tabButtonClass(3)} onClick={()=>{setTab(3)}}>Order History</button>
      </div>

      {/* TODO */}
      {tab === 1 && (
        <div className='w-[90%] rounded-[10px] bg-white shadow-lg flex flex-col items-center justify-center'>
          <p className='w-full font-noticia font-bold text-[17px] py-3 mt-5 border-b-1 pl-5'>Contact Details</p>
          <div className={profileForm}>
            <label className={labelStyle} htmlFor="">First Name</label>
            <input type="text" className={inputStyle} value={formData.firstname} onChange={handleFormChange} />
          </div>
        </div>
      )}
    </section>
    </>
    
  )
}

export default MyAccount
