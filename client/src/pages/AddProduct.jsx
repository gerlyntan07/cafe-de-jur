import React, { useEffect, useState } from 'react';
import AdminHeader from '../components/AdminHeader.jsx';
import axios from '../hooks/AxiosConfig.js';
import ImageKit from 'imagekit-javascript';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import RemoveIcon from '@mui/icons-material/Remove';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function AddProduct() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [imgUrl, setImgUrl] = useState('');
    const [values, setValues] = useState({
        productName: '',
        description: '',
        category: 'Beverage',
        price: null,
        image: '',
    });
    const [selectedCategory, setSelectedCategory] = useState('Beverage');
    const [selectedDrinkType, setSelectedDrinkType] = useState('Coffee');
    const [variants, setVariants] = useState([]);

    useEffect(() => {
        document.title = 'Add Product | CAFÉ de JÚR';
    }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = values.image;
            if(file){
                const authResponse = await fetch('http://localhost:3001/api/auth');
                const auth = await authResponse.json();

                const imagekit = new ImageKit({
                    publicKey: auth.publicKey,
                    urlEndpoint: 'https://ik.imagekit.io/cafedejur',
                });

                const uploadResponse = await imagekit.upload({
                    file: file,
                    fileName: `${Date.now()}-${file.name}`,
                    useUniqueFileName: true,
                    folder: "/menu",
                    token: auth.token,
                    signature: auth.signature,
                    expire: auth.expire,
                });

                if (uploadResponse?.url) {
                    imageUrl = uploadResponse.url;
                    console.log("Image uploaded to:", imageUrl);
                } else {
                    throw new Error("Upload failed.");
                }
            }

            const productData = {
                productName: values.productName,
                description: values.description,
                category: values.category,
                price: parseFloat(values.price),
                image: imageUrl,
                variants: selectedCategory === 'Beverage' ? variants : null,
                drinkType: selectedDrinkType
            };

            const res = await axios.post('/addProduct', { productData });
            if (res.data.success) {
                navigate('/admin-products');
            } else {
                console.error("Failed to add product:", res.data.message);
            }
        } catch (err) {
            console.error("Error adding product:", err);
        } finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (imgUrl) {
                URL.revokeObjectURL(imgUrl);
            }
        };
    }, [imgUrl]);

    const handleValuesOnChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });

        // Update selectedCategory when category changes
        if (name === 'category') {
            setSelectedCategory(value);
        }

        if (name === 'drinkType') {
            setSelectedDrinkType(value);
        }
    };

    const handleAddVariant = () => {
        const newVariant = {
            size: getDefaultSize(selectedDrinkType),
            price: ''
        };
        setVariants([...variants, newVariant]);
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const handleRemoveVariant = (index) => {
        const newVariants = variants.filter((_, i) => i !== index);
        setVariants(newVariants);
    };

    const getDefaultSize = (drinkType) => {
        switch (drinkType) {
            case 'Coffee': return '16oz';
            case 'Non-Coffee': return '16oz';
            case 'Fruity Fritz': return 'Regular';
            default: return '16oz';
        }
    };

    const getSizeOptions = () => {
        switch (selectedDrinkType) {
            case 'Coffee':
                return ['16oz', '22oz', 'Hot'];
            case 'Non-Coffee':
                return ['16oz', '22oz'];
            case 'Fruity Fritz':
                return ['Regular', 'Large'];
            default:
                return [];
        }
    };

    const handleCancel = () => {
        setValues({
            productName: '',
            description: '',
            category: 'Beverage',
            price: null,
        });
        setFile(null);
        setImgUrl('');
        setVariants([]); // Reset variants
        navigate('/admin-products');
    };

    const inputDivStyle = `flex flex-row justify-between items-start w-full mt-5`;
    const labelStyle = `font-noticia text-base`;
    const inputFieldStyle = `p-2 font-noticia bg-white text-gray-600 w-2/3 outline-none border-1 border-gray-400 rounded-md text-base`;
    const addCancelBtn = `py-2 px-4 font-noticia text-base rounded-md cursor-pointer`;

    return (
        <div className='flex flex-col w-full lg:flex-row bg-gray-100 items-start justify-start'>
            <AdminHeader />
            {loading && (
                <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
            <section id='add-product' className='w-full h-screen pt-35 flex flex-col items-center justify-start xl:h-screen xl:pt-15 overflow-y-auto'>
                <form onSubmit={handleAddProduct} className='w-[90%] flex flex-col items-start justify-start pb-15 xl:w-[70%] 2xl:w-[60%]'>
                    <p className='font-noticia text-xl font-bold mb-3'>Add Product</p>

                    <div className='w-full flex flex-col items-start justify-start'>
                        <div className={inputDivStyle}>
                            <label htmlFor="productName" className={labelStyle}>Name: </label>
                            <input type="text" name="productName" className={inputFieldStyle} onChange={handleValuesOnChange} required />
                        </div>
                        <div className={inputDivStyle}>
                            <label htmlFor="description" className={labelStyle}>Description: </label>
                            <textarea name="description" rows={5} className={inputFieldStyle} onChange={handleValuesOnChange} required />
                        </div>
                        <div className={inputDivStyle}>
                            <label htmlFor="category" className={labelStyle}>Category: </label>
                            <select name="category" className={`${inputFieldStyle} cursor-pointer`} onChange={handleValuesOnChange} required>
                                <option value="Beverage">Beverage</option>
                                <option value="Croffle">Croffle</option>
                                <option value="Pasta">Pasta</option>
                                <option value="Silog">Silog</option>
                            </select>
                        </div>

                        {selectedCategory === 'Beverage' && (
                            <>
                                <div className={inputDivStyle}>
                                    <label htmlFor="drinkType" className={labelStyle}>Drink Type: </label>
                                    <select name="drinkType" className={`${inputFieldStyle} cursor-pointer`} onChange={handleValuesOnChange} required>
                                        <option value="Coffee">Coffee</option>
                                        <option value="Non-Coffee">Non-Coffee</option>
                                        <option value="Fruity Fritz">Fruity Fritz</option>
                                    </select>
                                </div>

                                <TableContainer component={Paper} sx={{ marginTop: 3 }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontFamily: 'Noticia Text', fontWeight: 'bold', width: '34%' }}>Size</TableCell>
                                                <TableCell sx={{ fontFamily: 'Noticia Text', fontWeight: 'bold', width: '33%' }}>Price ₱</TableCell>
                                                <TableCell sx={{ fontFamily: 'Noticia Text', fontWeight: 'bold', width: '33%' }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {variants.map((variant, index) => (
                                                <TableRow key={index}>
                                                    <TableCell sx={{ fontFamily: 'Noticia Text' }}>
                                                        <select
                                                            value={variant.size}
                                                            onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                                            className={`${inputFieldStyle} w-full cursor-pointer`}
                                                            required
                                                        >
                                                            {getSizeOptions().map(size => (
                                                                <option key={size} value={size}>{size}</option>
                                                            ))}
                                                        </select>
                                                    </TableCell>
                                                    <TableCell sx={{ fontFamily: 'Noticia Text' }}>
                                                        <input
                                                            type="number"
                                                            value={variant.price}
                                                            onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                                            step="0.01"
                                                            min="0"
                                                            placeholder="0.00"
                                                            className='w-full p-2 font-noticia bg-white text-gray-600 outline-none text-base rounded-md' required
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ fontFamily: 'Noticia Text' }}>
                                                        <button
                                                            type="button"
                                                            className='text-white px-4 py-2 bg-red-400 rounded-sm font-noticia'
                                                            onClick={() => handleRemoveVariant(index)}
                                                        >
                                                            <RemoveIcon />
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}

                                            {/* Add new row */}
                                            <TableRow>
                                                <TableCell colSpan={3} sx={{ textAlign: 'center' }}>
                                                    <button
                                                        type="button"
                                                        className='mt-2 px-4 py-1 bg-lightBrownBG rounded-sm font-noticia text-base'
                                                        onClick={handleAddVariant}
                                                    >
                                                        Add Variant
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>

                                    </Table>
                                </TableContainer>
                            </>
                        )}

                        {selectedCategory !== 'Beverage' && (
                            <div className={inputDivStyle}>
                                <label htmlFor="price" className={labelStyle}>Price: </label>
                                <div className='flex flex-row font-noticia bg-white items-center justify-start text-gray-600 w-2/3 outline-none border-1 border-gray-400 rounded-md'>
                                    <p className='font-noticia text-base px-4 border-r-2 border-gray-300 py-2'>₱</p>
                                    <input
                                        type="number"
                                        name="price"
                                        step="0.01"
                                        min="0"
                                        className='w-full p-2 font-noticia bg-white text-gray-600 outline-none text-base rounded-md'
                                        onChange={handleValuesOnChange}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className={inputDivStyle}>
                            <label htmlFor="image" className={labelStyle}>Image: </label>
                            <div className='flex flex-col w-2/3'>
                                <input
                                    className='p-2 font-noticia bg-white text-gray-600 outline-none border-1 border-gray-400 rounded-md text-base cursor-pointer'
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const selectedFile = e.target.files[0];
                                        setFile(selectedFile);
                                        if (selectedFile) {
                                            setImgUrl(URL.createObjectURL(selectedFile));
                                        } else {
                                            setImgUrl('');
                                        }
                                    }}
                                    required
                                />
                                {imgUrl && (
                                    <div className='mt-3'>
                                        <p className='font-noticia text-sm text-gray-500 mb-1'>Preview:</p>
                                        <img
                                            src={imgUrl}
                                            alt="Selected Preview"
                                            className='w-[200px] h-auto border border-gray-300 rounded-md shadow'
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='w-full flex flex-row items-center justify-end gap-4 mt-3'>
                        <button type="submit" className={`${addCancelBtn} bg-lightBrownBG hover:bg-[#dec9a0] transition-colors`}>Add Product</button>
                        <button type='button' className={`${addCancelBtn} border-1 border-gray-400 hover:bg-gray-200 transition-colors`} onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default AddProduct;
