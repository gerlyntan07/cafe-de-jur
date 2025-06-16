import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../hooks/AxiosConfig.js';

function ProductSearchCard({ product }) {
    const navigate = useNavigate();

    const handleProductClick = (id) => {
        navigate(`/view-product?productID=${encodeURIComponent(id)}`);
    };

    return (
        <>
            
                <div
                    key={product.productID}
                    className="flex flex-col w-[45%] md:w-[30%] lg:w-[25%] xl:w-[20%] 2xl:w-[17%] bg-productBG p-2 lg:p-3 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                    onClick={() => handleProductClick(product.productID)}
                >
                    <img
                        src={product.productImgURL}
                        alt={product.productName}
                        className="h-40 w-full md:h-50 lg:h-60 object-cover border-1 border-gray-400 rounded"
                    />
                    <h3 className="w-full font-noticia text-sm md:text-md lg:text-lg mt-2 border-b-1 truncate">{product.productName}</h3>
                    <p className="font-noticia font-bold text-sm md:text-md lg:text-lg">
                        {product.min_price && product.max_price
                            ? (product.min_price === product.max_price
                                ? `₱${Number(product.min_price).toFixed(2)}`
                                : `₱${Number(product.min_price).toFixed(2)} - ₱${Number(product.max_price).toFixed(2)}`)
                            : `₱${Number(product.base_price).toFixed(2)}`}
                    </p>
                </div>            
        </>
    );
}

export default ProductSearchCard;
