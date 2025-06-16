// src/pages/SearchResults.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../hooks/AxiosConfig';
import Header from '../components/Header';
import LoginPopup from '../components/LoginPopup.jsx';
import ProductSearchCard from '../components/ProductSearchCard';
import { useParams } from "react-router-dom";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

function ProductSearch() {
    const location = useLocation();
    const navigate = useNavigate();
    const { search } = useParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = `${search} | CAFÉ de JÚR`;
    }, [search]);

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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/productSearch/${search}`);
                setResults(res.data.results);
                console.log(res.data.results);
                setLoading(false);
                setError(null);
            } catch (error) {
                console.error("Error occurred:", error);
                setError("Error occurred while fetching products.");
                setResults([]);
            }
        };
        fetchData();
    }, [search]);

    return (
        <>
            <Header toggleLogin={toggleLogin} isAuthenticated={isAuthenticated} userName={userName} />
            {isLoginOpen && <LoginPopup toggleLogin={toggleLogin} />}
            <div className="pt-45 lg:pt-50 2xl:pt-55 pb-10 lg:pt-38 2xl:pt-45 w-full flex flex-col items-center justify-evenly">
                <h1 className="font-noticia w-[90%] text-left text-base font-bold mb-5">
                    Search results for "{search}"
                </h1>

                {loading ? (
                    <Backdrop
                        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                        open={open}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : results.length === 0 ? (
                    <p className='font-noticia text-base'>No products found matching your search.</p>
                ) : (
                    <div className='w-full md:w-[95%] lg:w-full 2xl:w-[90%] flex flex-col items-center justify-center gap-3'>
                        <div className="w-full flex flex-wrap justify-center items-center gap-3 md:gap-5">
                        {results.map(product => (
                            <ProductSearchCard
                                key={product.productID}
                                product={product}
                            />
                        ))}
                    </div>
                    </div>                    
                )}
            </div>
        </>
    );
}

export default ProductSearch;