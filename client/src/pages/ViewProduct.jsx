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
    const [prodImg, setProdImg] = useState('');
    const [selectedVariant, setSelectedVariant] = useState('');
    const [currentPrice, setCurrentPrice] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const getSelectedProduct = async () => {
            try {
                const res = await axios.post('/getSelectedProduct', { selectedProductID });
                document.title = `${res.data.productDetails[0].productName} | CAFÉ de JÚR`;
                setProdName(res.data.productDetails[0].productName);
                setProdImg(res.data.productDetails[0].productImgURL);
                setProductDetails(res.data.productDetails);
            } catch (err) {
                console.error('Failed to fetch product details:', err);
            }
        }

        getSelectedProduct();
    }, [selectedProductID])

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

    const sizeQuanDiv = `flex flex-col w-[50%] mt-3`;
    const sizeQuanLbl = `font-noticia text-[1rem]`;

    const updatePrice = (size, qty) => {
  const variant = productDetails.find(v => v.size === size);
  if (variant) {
    setCurrentPrice((variant.price * qty).toFixed(2));
  } else {
    setCurrentPrice('');
  }
};

// When size changes
const handleSizeChange = (e) => {
  const selectedSize = e.target.value;
  setSelectedVariant(selectedSize);
  updatePrice(selectedSize, quantity);
};

// When quantity changes
const handleMinus = () => {
  setQuantity(prev => {
    const newQty = prev > 1 ? prev - 1 : 1;
    updatePrice(selectedVariant, newQty);
    return newQty;
  });
};

const handlePlus = () => {
  setQuantity(prev => {
    const newQty = prev + 1;
    updatePrice(selectedVariant, newQty);
    return newQty;
  });
};

    return (
        <>
            <Header toggleLogin={toggleLogin} isAuthenticated={isAuthenticated} userName={userName} />
            {isLoginOpen && <LoginPopup toggleLogin={toggleLogin} />}
            <section className='pt-35 w-full flex flex-col items-center justify-center'>
                <button className='w-full flex flex-row items-center justify-start pl-3' onClick={() => navigate(-1)}>
                    <ArrowBackIcon sx={{ fontSize: 20 }} />
                    <p className='font-noticia ml-2 text-sm'>Back</p>
                </button>

                <div className='w-[85%] flex flex-col items-center justify-center mt-5'>
                    <div className='mx-auto w-full max-w-sm aspect-square'>
                        <img src={prodImg || 'https://ik.imagekit.io/cafedejur/menu/image-placeholder.png?updatedAt=1749735075731'} alt="" className="w-full h-full object-cover" />
                    </div>

                    <div className='w-full mt-3 pb-3 border-b-1'>
                        <p className='font-noticia text-[1.3rem] leading-none'>{prodName}</p>
                        <p className='font-noticia text-[1.2rem]'>{currentPrice ? `₱${currentPrice}` : '₱0.00'}</p>
                    </div>

                    <div className='flex flex-col w-full'>
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

                        <div className={sizeQuanDiv}>
                            <p className={sizeQuanLbl}>Quantity</p>
                            <div className='flex flex-row items-center justify-between border-1 px-3 py-1'>
                                <button className={sizeQuanLbl} onClick={handleMinus} disabled={quantity === 1}>-</button>
                                <p className={sizeQuanLbl}>{quantity}</p>
                                <button className={sizeQuanLbl} onClick={handlePlus}>+</button>
                            </div>
                        </div>      
                    </div>
                </div>

            </section>
        </>
    )
}

export default ViewProduct