import React, {useEffect} from 'react'
import UseLogout from '../hooks/UseLogout.js';
import Header from '../components/Header.jsx';

function MyAccount({userData, isAuthenticated}) {
    const logout = UseLogout();
    useEffect(() => {
        document.title = "Account | CAFÉ de JÚR";
      }, []);
  return (
    <>
    <Header isAuthenticated={isAuthenticated} userName={userData?.firstname} />
    <section id='myAcc'>
      meow
      <button className='py-3 bg-blue-300' onClick={logout}>logout</button>
    </section>
    </>
    
  )
}

export default MyAccount
