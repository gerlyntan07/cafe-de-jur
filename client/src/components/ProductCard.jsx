import React, { useEffect, useState } from 'react';
import axios from '../hooks/AxiosConfig.js';

function ProductCard({ category }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/getProducts');
        if (res.data.message === 'Products fetched') {
          setProducts(res.data.productList);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter(p => p.category === category)
    .sort((a,b) => a.price - b.price);

  return (    
    <div className="w-full flex flex-wrap justify-center items-center gap-3 md:gap-5">
      {filteredProducts.map(product => (
        <div
          key={product.id}
          className="flex flex-col w-[45%] md:w-[30%] lg:w-[25%] xl:w-[20%] 2xl:w-[17%] bg-productBG p-2 lg:p-3 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
        >
          <img
            src={product.productImgURL}
            alt={product.productName}
            className="h-40 w-full md:h-50 lg:h-60 object-cover border-1 border-gray-400 rounded"
          />
          <h3 className="w-full font-noticia text-sm md:text-md lg:text-lg mt-2 border-b-1 truncate">{product.productName}</h3>   
          <p className="font-noticia font-bold text-sm md:text-md lg:text-lg">₱{product.price}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductCard;
