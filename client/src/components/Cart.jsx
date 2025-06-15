// Cart.jsx
import React from 'react';

function Cart({ toggleCart }) {
  return (
    <div className="fixed bottom-0 right-0 h-full w-full md:w-1/2 xl:w-1/3 bg-cartBG shadow-lg z-50 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Cart</h2>
        <button 
          onClick={toggleCart}
          className="text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          ✕
        </button>
      </div>
      
      {/* Cart content goes here */}
      <div>Cart items will appear here</div>
    </div>
  );
}

export default Cart;