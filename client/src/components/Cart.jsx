import React, { useEffect, useState } from 'react';
import axios from '../hooks/AxiosConfig.js';
import { useNavigate } from 'react-router-dom';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { ToastContainer, toast } from 'react-toastify';

function Cart({ toggleCart }) {
  const navigate = useNavigate();
  const [cartDetails, setCartDetails] = useState([]);
  const [confirmDelModal, setConfirmDelModal] = useState(false);

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

  const handleDelete = async (cartItem) => {
    console.log(cartItem);
    try {
      const res = await axios.post('/deleteCartItem', { cartItem });
      if (res.data.message === 'Successfully deleted') {
        setCartDetails(prev => prev.filter(item => item.cartItemID !== cartItem));
      }
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
    }
  }

  const totalCartPrice = cartDetails.reduce((sum, item) => sum + Number(item.totalPrice), 0);
  const totalLbl = `font-noticia text-lg font-bold`;

  const deleteAllItems = async () => {
    try {
      const res = await axios.post('/deleteAllCartItems');
      if (res.data.message === 'Cart deleted') {
        setCartDetails([]);
        setConfirmDelModal(false);
        toast.success('Successfully deleted all items.', {
          autoClose: 2000
        })
      }
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
    }
  }

  const cancelDelBtn = `font-noticia cursor-pointer rounded-md py-2 w-[45%]`;

  const handleProceedToCheckout = () => {
  if (cartDetails.length === 0) {
    toast.error('Your cart is empty');
    return;
  }

  const normalizedItems = cartDetails.map(item => ({
    cartID: item.cartItemID,
  productID: item.productID,
  variant: item.variantSize,
  variantID: item.variantID,
  category: item.category,
  quantity: item.quantity,
  addOns: (item.addOns || []).map(addOn => ({
    addOnID: addOn.addOnID,
    name: addOn.addOnName,
    price: parseFloat(addOn.price)
  })),
  price: parseFloat(item.totalPrice),
  name: item.productName,
  img: item.productImgURL
}));


  console.log(cartDetails);

  navigate('/checkout', { state: { items: normalizedItems } });
};


  return (
    <>
      <ToastContainer position='bottom-center' hideProgressBar={true} />
      {confirmDelModal && (
        <div className='fixed top-0 left-0 h-full w-full flex items-center justify-center z-100 bg-black/50'>
          <div className='bg-white px-5 py-10 rounded-xl shadow-lg w-3/4 md:w-2/4 xl:w-1/3 text-center items-center justify-center'>
            <DeleteTwoToneIcon sx={{ color: 'red', fontSize: 50 }} />
            <p className='font-inika font-bold text-lg'>Are you sure you want to remove all items from your cart?</p>
            <p className='font-inika text-base pt-2 pb-5'>This action cannot be undone.</p>

            <div className='flex flex-row justify-center gap-5'>
              <button className={`${cancelDelBtn} border-gray-300 border-2`} onClick={() => setConfirmDelModal(false)}>Cancel</button>
              <button className={`${cancelDelBtn} bg-red-500 text-white`} onClick={deleteAllItems}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 right-0 h-full w-full md:w-1/2 xl:w-1/3 bg-cartBG shadow-lg z-50 p-4">
        <div className='w-full h-full flex flex-col items-center justify-between'>
          <div className="w-full h-auto flex flex-col justify-center items-end mb-4">
            <button
              onClick={toggleCart}
              className="text-gray-500 hover:text-gray-700 cursor-pointer mr-3"
            >
              ✕
            </button>
            <h2 className="w-full font-noticia text-center text-xl font-bold">My Cart</h2>
          </div>

          {/* cart lists */}
          <div className='w-full h-[80%] flex flex-col items-center justify-start overflow-y-auto'>
            {cartDetails.length !== 0 && (
              <div className='w-full flex items-end justify-end'>
                <button className='font-noticia text-red-500 text-base font-semibold cursor-pointer' onClick={() => setConfirmDelModal(true)}>Delete all</button>
              </div>
            )}
            {cartDetails.length === 0 ? (
              <p className="text-gray-600 font-noticia">Your cart is empty</p>
            ) : (
              cartDetails.map(item => {
                const unitPrice = item.totalPrice / item.quantity;
                const updateCartItemInDB = async (cartItemID, quantity, totalPrice) => {
                  try {
                    await axios.put('/updateCartItemQuantity', {
                      cartItemID,
                      quantity,
                      totalPrice
                    });
                  } catch (err) {
                    console.error("Failed to update cart item in DB:", err.message);
                  }
                };

                const handleIncrement = (cartItemID) => {
                  setCartDetails(prev => prev.map(item => {
                    if (item.cartItemID === cartItemID) {
                      const unitPrice = item.totalPrice / item.quantity;
                      const newQuantity = item.quantity + 1;
                      const newTotalPrice = unitPrice * newQuantity;

                      updateCartItemInDB(cartItemID, newQuantity, newTotalPrice);

                      return {
                        ...item,
                        quantity: newQuantity,
                        totalPrice: newTotalPrice
                      };
                    }
                    return item;
                  }));
                };

                const handleDecrement = (cartItemID) => {
                  setCartDetails(prev => prev.map(item => {
                    if (item.cartItemID === cartItemID && item.quantity > 1) {
                      const unitPrice = item.totalPrice / item.quantity;
                      const newQuantity = item.quantity - 1;
                      const newTotalPrice = unitPrice * newQuantity;

                      updateCartItemInDB(cartItemID, newQuantity, newTotalPrice);

                      return {
                        ...item,
                        quantity: newQuantity,
                        totalPrice: newTotalPrice
                      };
                    }
                    return item;
                  }));
                };


                return (
                  <div key={item.cartItemID} className="w-full flex flex-col items-center justify-center border-b border-gray-300 mb-4 pb-4">
                    <div className='w-full flex flex-row gap-5'>
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
                      <p className='w-[20%] font-noticia text-base font-bold'>₱{(unitPrice * item.quantity).toFixed(2)}</p>
                    </div>

                    <div className='w-full flex flex-row items-center justify-between pl-[15%]'>
                      <div className='flex items-center gap-3'>
                        <button
                          onClick={() => handleDecrement(item.cartItemID)}
                          className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer'
                          disabled={item.quantity <= 1}
                        >
                          <span className='text-lg font-semibold'>-</span>
                        </button>
                        <p className='font-noticia w-8 text-center'>{item.quantity}</p>
                        <button
                          onClick={() => handleIncrement(item.cartItemID)}
                          className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer'
                        >
                          <span className='text-lg font-semibold'>+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* total */}
          <div className='w-full px-5 pt-3 h-auto flex flex-col items-center justify-center border-t border-gray-300'>
            <div className='w-full flex flex-row items-center justify-between'>
              <p className={totalLbl}>Total: </p>
              <p className={totalLbl}>₱{totalCartPrice.toFixed(2)}</p>
            </div>

            <button className='font-noticia text-base rounded-full mt-5 mb-5 bg-lightBrown p-3 cursor-pointer' onClick={handleProceedToCheckout}>Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
