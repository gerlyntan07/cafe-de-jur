import React, { useEffect, useState } from 'react';
import axios from '../hooks/AxiosConfig.js';

function ProductCard({ category }) {
  const [products, setProducts] = useState([]);
  const [drinkType, setDrinkType] = useState('All');

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
    .filter(p => {
      if (category === 'Beverage' && drinkType !== 'All') {
        return p.drinkType === drinkType;
      }
      return true;
    })
    .sort((a, b) => {
  const priceA = a.min_price ?? a.base_price ?? 0;
  const priceB = b.min_price ?? b.base_price ?? 0;
  return priceA - priceB;
});

  return (    
    <>
    {category === 'Beverage' && (
        <div className="w-[90%] lg:w-[80%] flex items-center justify-end mb-4">
          <label htmlFor="beverage-filter" className="mr-2 text-sm font-semibold">Filter by:</label>
          <select
            id="beverage-filter"
            value={drinkType}
            onChange={e => setDrinkType(e.target.value)}
            className="border px-5 py-1 rounded outline-none cursor-pointer"
          >
            <option value="All">All</option>
            <option value="Coffee">Coffee</option>
            <option value="Non-Coffee">Non-Coffee</option>
            <option value="Fruity Fritz">Fruity Fritz</option>
          </select>
        </div>
      )}
    <div className="w-full flex flex-wrap justify-center items-center gap-3 md:gap-5">
      {filteredProducts.map(product => (
        <div
          key={product.productID}
          className="flex flex-col w-[45%] md:w-[30%] lg:w-[25%] xl:w-[20%] 2xl:w-[17%] bg-productBG p-2 lg:p-3 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
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
      ))}
    </div>
    </>
  );
}

export default ProductCard;
