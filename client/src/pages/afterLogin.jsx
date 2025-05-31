import React from 'react'
import UseLogout from '../hooks/UseLogout.js';

function afterLogin() {
    const logout = UseLogout();

    return (
        <div>afterLogin
            <button className='py-3 bg-blue-300' onClick={logout}>logout</button>
        </div>
    )
}

export default afterLogin