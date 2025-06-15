import React, { useEffect, useState } from 'react';
import axios from '../hooks/AxiosConfig.js';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

function Cart({ toggleCart }) {
  const [cartDetails, setCartDetails] = useState([]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = ''; // Reset on unmount
    };
  }, []);

  useEffect(() => {
    const getCart = async () => {
      try {
        const res = await axios.get('/getCart');
        if (res.data.message === 'No items') {
          setCartDetails([]);
        } else if (res.data.message === 'items fetched') {
          const grouped = groupCartItems(res.data.cartList);
          setCartDetails(grouped);
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    };

    getCart();
  }, []);

  // Group by cartItemID
  const groupCartItems = (items) => {
    const grouped = {};

    items.forEach(item => {
      if (!grouped[item.cartItemID]) {
        grouped[item.cartItemID] = {
          ...item,
          addOns: [],
        };
      }

      if (item.addOnID) {
        grouped[item.cartItemID].addOns.push({
          addOnID: item.addOnID,
          cartAddOnID: item.cartAddOnID,
          addOnName: item.addOnName,
        });
      }
    });

    return Object.values(grouped);
  };

  const handleDelete = async(cartItem) => {
    console.log(cartItem);
    try{
      const res = await axios.post('/deleteCartItem', {cartItem});
      console.log('deleted');
      setCartDetails(prev => prev.filter(item => item.cartItemID !== cartItem));
    } catch(err){
      console.error('Login failed:', err.response?.data || err.message);      
    }
  }

  const totalCartPrice = cartDetails.reduce((sum, item) => sum + Number(item.totalPrice), 0);
  const totalLbl = `font-noticia text-lg font-bold`;

  return (
    <div className="fixed bottom-0 right-0 h-full w-full md:w-1/2 xl:w-1/3 bg-cartBG shadow-lg z-50 p-4">
      <div className='w-full h-full flex flex-col items-center justify-between'>
        <div className="w-full h-[10%] flex flex-col justify-center items-end mb-4">
          <button
            onClick={toggleCart}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            ✕
          </button>
          <h2 className="w-full font-noticia text-center text-xl font-bold">My Cart</h2>
        </div>

        {/* cart lists */}
        <div className='w-full h-[80%] flex flex-col items-center justify-start overflow-y-auto'>
          {cartDetails.length === 0 ? (
            <p className="text-gray-600 font-noticia">Your cart is empty</p>
          ) : (
            cartDetails.map(item => (
              <div key={item.cartItemID} className="w-full flex flex-row gap-5 items-center justify-center border-b border-gray-300 mb-4 pb-4">
                <button className='w-[10%] flex items-center justify-center' onClick={() => handleDelete(item.cartItemID)}>
                  <DeleteOutlinedIcon sx={{ color: 'black', cursor: 'pointer' }} />
                </button>
                <div className='w-[65%] overflow-hidden'>
                  <h3 className="font-inika text-lg font-semibold">{item.productName} {item.variantSize ? `(${item.variantSize})` : ''}</h3>
                  {item.addOns.length > 0 && (
                    <p className="text-sm font-noticia text-gray-600 truncate">
                      {item.addOns.map(addon => addon.addOnName).join(', ')}
                    </p>
                  )}
                </div>
                <p className='w-[15%] font-noticia'>₱{item.totalPrice}</p>
              </div>
            ))
          )}
        </div>

        {/* total */}
        <div className='w-full px-5 h-[10%] flex flex-row items-center justify-between border-t border-gray-300'>
          <p className={totalLbl}>Total: </p>
          <p className={totalLbl}>₱{totalCartPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default Cart;
