import React, { useEffect, useState } from 'react'
import axios from '../hooks/AxiosConfig.js';
import { useNavigate } from 'react-router-dom';
import LoginPopup from '../components/LoginPopup.jsx';
import Header from '../components/Header';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ViewProduct() {
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const selectedProductID = queryParams.get('productID');
    const [productDetails, setProductDetails] = useState([]);
    const [prodName, setProdName] = useState('');
    const [prodDesc, setProdDesc] = useState('');
    const [prodImg, setProdImg] = useState('');
    const [prodCategory, setProdCategory] = useState('');
    const [selectedVariant, setSelectedVariant] = useState('');
    const [currentPrice, setCurrentPrice] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [addOns, setAddOns] = useState([]);
    const [selectedAddOns, setSelectedAddOns] = useState([]);
    const [isAddOns, setIsAddOns] = useState(false);
    const [basePrice, setBasePrice] = useState(null);


    const handleAddOnChange = (addonID) => {
        setSelectedAddOns(prev =>
            prev.includes(addonID)
                ? prev.filter(id => id !== addonID)
                : [...prev, addonID]
        );
    };

    const onAddOnClick = () => {
        setIsAddOns((prev) => !prev);
        setSelectedAddOns([]);
    }

    useEffect(() => {
        const getSelectedProduct = async () => {
            try {
                const res = await axios.post('/getSelectedProduct', { selectedProductID });
                const product = res.data.productDetails[0];

                document.title = `${product.productName} | CAFÉ de JÚR`;
                setProdName(product.productName);
                setProdImg(product.productImgURL);
                setProdDesc(product.description);
                setProdCategory(product.category);
                setProductDetails(res.data.productDetails);
                setAddOns(res.data.addOnsList);

                if (product.category !== 'Beverage') {
                    setBasePrice(product.base_price); // <--- set unit price
                    setCurrentPrice((product.base_price * quantity).toFixed(2)); // initialize total
                }

            } catch (err) {
                console.error('Failed to fetch product details:', err);
            }
        };

        getSelectedProduct();
    }, [selectedProductID, quantity]);

    useEffect(() => {
        updatePrice(selectedVariant, quantity);
    }, [selectedAddOns]);



    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState('');
    useEffect(() => {
        axios.get('/session')
            .then((res) => {
                if (res.data.loggedIn === false) {
                    setIsAuthenticated(false);
                } else {
                    setUserName(res.data.firstname);
                    setIsAuthenticated(true);
                }
            })
            .catch((error) => {
                console.error('Session validation failed:', error);
                setIsAuthenticated(false);
            })
    }, []);

    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const toggleLogin = () => {
        setIsLoginOpen(prev => !prev);
        if (isLoginOpen) {
            document.title = "CAFÉ de JÚR";
        }
    }

    const sizeQuanDiv = `flex flex-col w-[50%] md:w-[45%] lg:w-[30%] xl:w-[25%] mt-3`;
    const sizeQuanLbl = `font-noticia text-[1rem]`;


    const updatePrice = (input, qty) => {
        let base = 0;

        if (prodCategory === 'Beverage') {
            const variant = productDetails.find(v => v.size === input);
            if (variant) {
                base = Number(variant.price);
            } else {
                setCurrentPrice('');
                return;
            }
        } else {
            if (basePrice !== null) {
                base = Number(basePrice);
            } else {
                setCurrentPrice('');
                return;
            }
        }

        // ✅ Convert addOn.price to number safely
        const addOnTotal = selectedAddOns.reduce((sum, id) => {
            const addOn = addOns.find(a => a.addOnID === id);
            return addOn ? sum + Number(addOn.price) : sum;
        }, 0);

        const total = (base * qty) + addOnTotal;

        // ✅ Check if total is a valid number before formatting
        setCurrentPrice(
            isNaN(total) ? '0.00' : total.toFixed(2)
        );
    };



    // When size changes
    const handleSizeChange = (e) => {
        const selectedSize = e.target.value;
        setSelectedVariant(selectedSize);
        updatePrice(selectedSize, quantity);
    };

    // When quantity changes
    const handleMinus = () => {
        if (quantity > 1) {
            const newQty = quantity - 1;
            setQuantity(newQty);

            updatePrice(selectedVariant, newQty); // works for both cases now
        }
    };

    const handlePlus = () => {
        const newQty = quantity + 1;
        setQuantity(newQty);

        updatePrice(selectedVariant, newQty); // works for both cases now
    };



    return (
        <>
            <Header toggleLogin={toggleLogin} isAuthenticated={isAuthenticated} userName={userName} />
            {isLoginOpen && <LoginPopup toggleLogin={toggleLogin} />}
            <section className='pt-45 pb-20 2xl:pt-50 w-full flex flex-col items-center justify-center'>
                <button className='w-full md:w-[80%] lg:w-[90%] xl:w-[80%] flex flex-row items-center justify-start pl-3 cursor-pointer' onClick={() => navigate(-1)}>
                    <ArrowBackIcon sx={{ fontSize: 20 }} />
                    <p className='font-noticia ml-2 text-sm md:text-md lg:text-lg'>Back</p>
                </button>


                {/* mobile */}
                <div className='w-[85%] md:w-[70%] flex lg:hidden flex-col items-center justify-center mt-5'>
                    <div className='mx-auto w-full max-w-sm aspect-square'>
                        <img src={prodImg || 'https://ik.imagekit.io/cafedejur/menu/image-placeholder.png?updatedAt=1749735075731'} alt="" className="w-full h-full object-cover" />
                    </div>

                    <div className='w-full mt-3 pb-3 border-b-1'>
                        <p className='font-noticia text-[1.3rem] md:text-[1.5rem] leading-none'>{prodName}</p>
                        <p className='font-noticia text-[1.2rem]'>{currentPrice ? `₱${currentPrice}` : '₱0.00'}</p>
                    </div>

                    <div className="mt-4">
                        <p className="font-noticia text-sm md:text-md font-semibold text-gray-600 mb-1">Description</p>
                        <p className="font-noticia text-sm md:text-md text-gray-600">{prodDesc}</p>
                    </div>


                    <div className='flex flex-row w-full gap-2 md:gap-10'>
                        {prodCategory === 'Beverage' && (
                            <div className={sizeQuanDiv}>
                                <p className={sizeQuanLbl}>Size</p>
                                <select className="font-noticia text-[1rem]'> px-2 py-1 rounded border outline-none" value={selectedVariant} onChange={handleSizeChange}
                                >
                                    <option value="" disabled>Select a size</option>
                                    {productDetails.map((variant, index) => {
                                        if (variant.size) {
                                            return (
                                                <option key={index} value={variant.size}>
                                                    {variant.size}
                                                </option>
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}
                                </select>
                            </div>
                        )}

                        <div className={sizeQuanDiv}>
                            <p className={sizeQuanLbl}>Quantity</p>
                            <div className='flex flex-row items-center justify-between border-1 px-3 py-1'>
                                <button className={sizeQuanLbl} onClick={handleMinus} disabled={quantity === 1}>-</button>
                                <p className={sizeQuanLbl}>{quantity}</p>
                                <button className={sizeQuanLbl} onClick={handlePlus}>+</button>
                            </div>
                        </div>
                    </div>



                    <div className='w-full flex flex-col mt-5 bg-gray-200 p-5 rounded-lg'>
                        <button className={`font-noticia text-[1rem] outline-none ${isAddOns === true && `mb-5`}`} onClick={onAddOnClick}>ADD ONS</button>

                        {isAddOns === true && (
                            <div className="grid grid-cols-2 gap-2">
                                {addOns.map((a) => {
                                    const isSelected = selectedAddOns.includes(a.addOnID);

                                    return (
                                        <label
                                            key={a.addOnID}
                                            onClick={() => handleAddOnChange(a.addOnID)}
                                            className={`font-noticia text-[0.9rem] cursor-pointer block rounded border-2 transition text-center
          ${isSelected ? 'border-darkBrown bg-[#EADDCA]' : 'border-gray-400 bg-white'}
        `}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleAddOnChange(a.addOnID)}
                                                className="hidden"
                                            />
                                            <span>{a.name}<br />+₱{a.price}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}

                    </div>
                </div>

                <div className='fixed bottom-0 left-0 w-full flex justify-around z-50 lg:hidden'>
                    <button className='bg-lightBrown text-white w-[50%] py-3 font-noticia'>Add to cart</button>
                    <button className='bg-darkBrown text-white w-[50%] py-3 font-noticia'>Buy now</button>
                </div>

                {/* desktop */}
                <div className='w-[90%] xl:w-[80%] hidden lg:flex flex-row items-start justify-center mt-5 gap-10'>
                    <div className='mx-auto w-full max-w-[40%] aspect-square'>
                        <img src={prodImg || 'https://ik.imagekit.io/cafedejur/menu/image-placeholder.png?updatedAt=1749735075731'} alt="" className="w-full h-full object-cover" />
                    </div>

                    <div className='w-full flex flex-col'>
                        <p className='font-noticia text-[1.3rem] md:text-[1.5rem] lg:text-[2rem] leading-none'>{prodName}</p>
                        <p className='font-noticia text-[1.2rem] lg:text-[1.7rem] border-b-1 pb-5 mb-5'>{currentPrice ? `₱${currentPrice}` : '₱0.00'}</p>

                        <div className='flex flex-row w-full gap-2 md:gap-10'>
                            {prodCategory === 'Beverage' && (
                                <div className={sizeQuanDiv}>
                                    <p className={sizeQuanLbl}>Size</p>
                                    <select className="font-noticia text-[1rem]'> px-2 py-1 rounded border outline-none cursor-pointer" value={selectedVariant} onChange={handleSizeChange}
                                    >
                                        <option value="" disabled>Select a size</option>
                                        {productDetails.map((variant, index) => {
                                            if (variant.size) {
                                                return (
                                                    <option key={index} value={variant.size}>
                                                        {variant.size}
                                                    </option>
                                                );
                                            } else {
                                                return null;
                                            }
                                        })}
                                    </select>
                                </div>
                            )}

                            <div className={sizeQuanDiv}>
                                <p className={sizeQuanLbl}>Quantity</p>
                                <div className='flex flex-row items-center justify-between border-1 px-3 py-1'>
                                    <button className={`${sizeQuanLbl} cursor-pointer`} onClick={handleMinus} disabled={quantity === 1}>-</button>
                                    <p className={sizeQuanLbl}>{quantity}</p>
                                    <button className={`${sizeQuanLbl} cursor-pointer`} onClick={handlePlus}>+</button>
                                </div>
                            </div>
                        </div>

                        <div className='w-full flex flex-col mt-5 bg-gray-200 p-5 rounded-lg'>
                            <button className={`font-noticia text-[1rem] outline-none mb-5`}>ADD ONS</button>


                            <div className="grid grid-cols-3 gap-2">
                                {addOns.map((a) => {
                                    const isSelected = selectedAddOns.includes(a.addOnID);

                                    return (
                                        <label
                                            key={a.addOnID}
                                            onClick={() => handleAddOnChange(a.addOnID)}
                                            className={`font-noticia text-[0.9rem] cursor-pointer block rounded border-2 transition text-center
          ${isSelected ? 'border-darkBrown bg-[#EADDCA]' : 'border-gray-400 bg-white'}
        `}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleAddOnChange(a.addOnID)}
                                                className="hidden"
                                            />
                                            <span>{a.name}<br />+₱{a.price}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        <div className='w-full hidden flex-row justify-start mt-5 lg:flex gap-5'>
                            <button className='bg-lightBrown text-white px-10 py-3 font-noticia cursor-pointer'>Add to cart</button>
                            <button className='bg-darkBrown text-white px-10 py-3 font-noticia cursor-pointer'>Buy now</button>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex w-[90%] xl:w-[80%] flex-col mt-10">
                    <p className="font-noticia text-md font-semibold text-gray-600 mb-1">Description</p>
                    <p className="font-noticia text-md text-gray-600">{prodDesc}</p>
                </div>

            </section>
        </>
    )
}

export default ViewProduct