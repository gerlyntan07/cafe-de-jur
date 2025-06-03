import React, { useEffect, useState } from 'react'
import Header from '../components/Header.jsx';
import menubg from '../assets/menubg.png';
import axios from '../hooks/AxiosConfig.js';
import { ToastContainer, toast } from 'react-toastify';
import MyAccAddress from '../components/MyAccAddress.jsx';

function MyAccount({ userData, isAuthenticated }) {
  const [tab, setTab] = useState(1);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
  })
  const [origData, setOrigData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    document.title = "Account | CAFÉ de JÚR";
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/getUserData');
        if (res.data.message === 'successful') {
          const user = res.data.customerData;
          const fetchedData = {
            firstname: user.firstname || '',
            lastname: user.lastname || '',
            phone: user.phoneNum || '',
            email: user.email || '',
          };
          setFormData(fetchedData);
          setOrigData(fetchedData);
        }
      } catch (err) {
        console.error('Error getting user data:', err);
      }
    }
    fetch();
  }, [])

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleSaveProfile = async () => {
    try {
      if (formData.firstname.trim() === '' || formData.lastname.trim() === '' || formData.phone.trim() === '' || formData.email.trim() === '') {
        toast.error('All fields are required.', {
          autoClose: 3000,
        })
        return;
      }
      const res = await axios.post('/updateProfile', formData);
      if (res.data.message === "Profile updated successfully.") {
        setIsEdit(false);
        console.log(formData);
        setOrigData(formData);
        toast.success(res.data.message, {
          autoClose: 3000,
        })
      }
    } catch (err) {
      console.error('Error updating user data:', err);
      toast.error('Unable to update user account. Please try again.', {
        autoClose: 3000,
      })
    }
  }

  const tabButtonClass = (tabIndex) =>
    `font-noticia px-3 py-2 rounded transition-colors text-black lg:text-lg lg:ml-10 cursor-pointer ${tab === tabIndex ? 'bg-lightBrownBG font-bold' : 'bg-transparent'
    }`;

  const profileForm = `${isEdit ? 'ring-1 ring-gray-400 ring-offset-2' : ``} bg-inputGray w-[90%] mt-5 flex flex-col pl-3 rounded-[10px] justify-center`;
  const labelStyle = 'font-noticia text-gray-500 text-sm';
  const inputStyle = 'outline-none font-noticia font-bold text-gray-600 text-md';
  const cancelSaveBtn = `w-full font-noticia font-bold text-sm md:text-md text-gray-700 rounded-full py-2 mt-5 cursor-pointer`;

  //change pass
  const [isChangePass, setIsChangePass] = useState(false);
  const [wrongOldPass, setWrongOldPass] = useState(false);
  const [passForm, setPassForm] = useState({
    currPass: '',
    newPass: '',
    confirmNewPass: ''
  })
  const [isPassValid, setIsPassValid] = useState(false);

  const handlePassChange = (e) => {
    const { name, value } = e.target;
    setPassForm({
      ...passForm,
      [name]: value
    });
  }
  useEffect(() => {
    if (passForm.newPass && passForm.confirmNewPass) {
      setIsPassValid(passForm.newPass === passForm.confirmNewPass);
    } else {
      setIsPassValid(true);
    }
  }, [passForm.newPass, passForm.confirmNewPass]);

  const handleSavePass = async (e) => {
    e.preventDefault();

    const passwordMatch = passForm.newPass === passForm.confirmNewPass;
    setIsPassValid(passwordMatch);

    if (!passwordMatch) return;
    if (isPassValid) {
      try {
        const res = await axios.post('/changePass', passForm);
        if (res.data.message === 'Your password has been changed successfully.') {
          setIsChangePass(false);
          setWrongOldPass(false);
          setPassForm({
            currPass: '',
            newPass: '',
            confirmNewPass: ''
          });
          toast.success(res.data.message, {
            autoClose: 3000
          })
        }
      } catch (err) {
        console.error('Error changing password:', err);

        if (err.response && err.response.data && err.response.data.message === 'Incorrect password. Please try again.') {
          setWrongOldPass(true);
        } else {
          toast.error('Error changing password.', {
            autoClose: 3000
          });
        }
      }
    }
  }

  const passProfileForm = `ring-1 ring-gray-400 ring-offset-2 bg-inputGray w-[90%] mt-5 flex flex-col pl-3 rounded-[10px] justify-center`;

  return (
    <>
      <Header isAuthenticated={isAuthenticated} userName={userData?.firstname} />
      <ToastContainer position="bottom-right" />
      <section id='myAcc' style={{ backgroundImage: `url(${menubg})` }} className='w-full h-screen flex flex-col lg:flex-row items-center justify-center py-35 lg:items-start lg:gap-10 lg:pt-45 2xl:pt-60'>
        <div className='w-full flex flex-col lg:w-[20%] items-center justify-center lg:items-start'>
          <p className='font-noticia text-lg font-bold mb-5 lg:text-xl'>My Account</p>

          <div className='w-full flex flex-row items-center justify-evenly border-y-1 mb-10 lg:flex-col lg:border-0 lg:items-start'>
            <button className={tabButtonClass(1)} onClick={() => setTab(1)}>My Profile</button>
            <button className={tabButtonClass(2)} onClick={() => { setTab(2) }}>My Addresses</button>
            <button className={tabButtonClass(3)} onClick={() => { setTab(3) }}>Order History</button>
          </div>
        </div>

        {/* TODO */}
        {tab === 1 && isChangePass === false && (
          <div className='w-[90%] md:w-[60%] lg:w-[40%] rounded-[10px] bg-white shadow-lg flex flex-col items-center justify-center py-5'>
            <p className='w-full font-noticia font-bold text-md pb-3 border-b-1 pl-5'>Contact Details</p>
            <div className={profileForm}>
              <label className={labelStyle} htmlFor="">First Name</label>
              <input disabled={!isEdit} type="text" className={inputStyle} name="firstname" value={formData.firstname} onChange={handleFormChange} />
            </div>

            <div className={profileForm}>
              <label className={labelStyle} htmlFor="">Last Name</label>
              <input disabled={!isEdit} type="text" className={inputStyle} name="lastname" value={formData.lastname} onChange={handleFormChange} />
            </div>

            <div className={profileForm}>
              <label className={labelStyle} htmlFor="">Mobile Number</label>
              <input disabled={!isEdit} type="text" className={inputStyle} name="phone" value={formData.phone} onChange={handleFormChange} />
            </div>

            <div className={profileForm}>
              <label className={labelStyle} htmlFor="">Email</label>
              <input disabled={!isEdit} type="email" className={inputStyle} name="email" value={formData.email} onChange={handleFormChange} />
            </div>

            <div className={`${isEdit ? `flex` : `hidden`} w-[90%] flex-row items-center justify-center gap-3`}>
              <button className={`${cancelSaveBtn} border-1`}
                onClick={() => {
                  setFormData(origData);
                  setIsEdit(false);
                  toast.dismiss();
                }}>Cancel</button>
              <button className={`${cancelSaveBtn} bg-lightBrownBG`} onClick={handleSaveProfile}>Save</button>
            </div>

            <button className={`${!isEdit ? `flex` : `hidden`} justify-center items-center text-center font-noticia font-bold text-gray-700 rounded-full py-2 bg-lightBrownBG w-[90%] mt-5 text-md cursor-pointer`} onClick={() => setIsEdit(true)}>Edit</button>
            <button className='font-noticia font-bold uppercase text-md mt-3 cursor-pointer' onClick={() => { setIsChangePass(true); setIsEdit(false); }}>Change Password</button>
          </div>
        )}

        {tab === 1 && isChangePass === true && (
          <div className='w-[90%] md:w-[60%] lg:w-[40%] rounded-[10px] bg-white shadow-lg flex flex-col items-center justify-center py-5'>
            <p className='w-full font-noticia font-bold text-md pb-3 border-b-1 pl-5'>Change Password</p>
            <div className={passProfileForm}>
              <label className={labelStyle} htmlFor="">Current Password</label>
              <input type="password" className={inputStyle} name="currPass" value={passForm.currPass} onChange={handlePassChange} />
            </div>
            {wrongOldPass && (
              <p className='w-[90%] mt-2 text-left text-red-600 text-[12px] font-inika md:text-[14px] leading-none'>Wrong password</p>
            )}

            <div className={passProfileForm}>
              <label className={labelStyle} htmlFor="">New Password</label>
              <input type="password" className={inputStyle} name="newPass" value={passForm.newPass} onChange={handlePassChange} />
            </div>

            <div className={passProfileForm}>
              <label className={labelStyle} htmlFor="">Confirm New Password</label>
              <input type="password" className={inputStyle} name="confirmNewPass" value={passForm.confirmNewPass} onChange={handlePassChange} />
            </div>
            {!isPassValid && (
              <p className='w-[90%] mt-2 text-left text-red-600 text-[12px] font-inika md:text-[14px] leading-none'>Passwords do not match.</p>
            )}

            <div className={`w-[90%] flex flex-row items-center justify-between gap-3`}>
              <button className={`${cancelSaveBtn} border-1`}
                onClick={() => {
                  setPassForm({
                    currPass: '',
                    newPass: '',
                    confirmNewPass: ''
                  })
                  setIsChangePass(false);
                  toast.dismiss();
                }}>Cancel</button>
              <button className={`${cancelSaveBtn} bg-lightBrownBG`} onClick={handleSavePass}>Save Changes</button>
            </div>
          </div>
        )}

        {tab === 2 && (
          <MyAccAddress />
        )}
      </section>
    </>

  )
}

export default MyAccount
