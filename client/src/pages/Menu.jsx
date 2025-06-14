import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../hooks/AxiosConfig.js';
import LoginPopup from '../components/LoginPopup.jsx';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';

const Menu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const selectedType = queryParams.get('type');
    useEffect(() => {
        document.title = `${selectedType} | CAFÉ de JÚR`;
    }, [selectedType]);

    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        if (selectedType) {
            setActiveTab(selectedType);
        }
    }, [selectedType]);

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

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        navigate(`/menu?type=${encodeURIComponent(tab)}`);
    };

    const menuTypesTab = (tab) =>
        `font-noticia px-2 py-2 lg:py-3 transition-colors text-black text-md lg:text-lg lg:ml-10 cursor-pointer ${activeTab === tab ? 'border-b-4 border-red-400 font-bold' : 'bg-transparent'
        }`;

    const productListsStyle = `w-full md:w-[95%] lg:w-full 2xl:w-[90%] flex flex-col items-center justify-center gap-3 mt-10`;

    return (
        <>
            <Header toggleLogin={toggleLogin} isAuthenticated={isAuthenticated} userName={userName} />
            {isLoginOpen && <LoginPopup toggleLogin={toggleLogin} />}
            <div className='pt-40 pb-10 lg:pt-38 2xl:pt-45 w-full flex flex-col items-center justify-evenly'>
                <div id='menu' className='w-full bg-inputGray flex flex-row items-center justify-evenly shadow-md'>
                    <button className={menuTypesTab('Beverages')} onClick={() => handleTabClick('Beverages')}>Beverages</button>
                    <button className={menuTypesTab('Croffles')} onClick={() => handleTabClick('Croffles')}>Croffles</button>
                    <button className={menuTypesTab('Silog Meals')} onClick={() => handleTabClick('Silog Meals')}>Silog Meals</button>
                    <button className={menuTypesTab('Pasta')} onClick={() => handleTabClick('Pasta')}>Pasta</button>
                </div>

                {activeTab === 'Beverages' && (
                    <div className={productListsStyle}>                                   
                    <ProductCard category='Beverage' />
                    </div>
                )}

                {activeTab === 'Croffles' && (
                    <div className={productListsStyle}>
                    <ProductCard category='Croffle' />
                    </div>
                )}

                {activeTab === 'Silog Meals' && (
                    <div className={productListsStyle}>
                    <ProductCard category='Silog' />
                    </div>
                )}

                {activeTab === 'Pasta' && (
                    <div className={productListsStyle}>
                    <ProductCard category='Pasta' />
                    </div>
                )}
            </div>

        </>
    );
};

export default Menu;
