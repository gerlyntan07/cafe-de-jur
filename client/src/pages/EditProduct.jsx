import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader.jsx';
import axios from '../hooks/AxiosConfig.js';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ImageKit from 'imagekit-javascript';

function EditProduct() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [imgUrl, setImgUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const product = state?.product;
    const [variants, setVariants] = useState([]);

    const [values, setValues] = useState({
        productID: product?.productID || '',
        productName: product?.productName || '',
        category: product?.category || 'Beverage',
        base_price: product?.base_price?.toString() || '',
        image: product?.productImgURL || '',
        description: product?.description || "",
    });


    const handleEdit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = values.image;

            if (file) {
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
                productID: values.productID,
                productName: values.productName,
                description: values.description,
                category: values.category,
                base_price: parseFloat(values.base_price),
                variants,
                image: imageUrl,
            };

            const res = await axios.post("/editProduct", { productData });

            if (res.data.success) {
                navigate("/admin-products");
            } else {
                console.error("Failed to update:", res.data.message);
            }

        } catch (err) {
            console.error("Error editing product:", err);
        } finally {
            setLoading(false);
        }
    };





    useEffect(() => {
        if (!product || product.length === 0) {
            navigate('/admin-dashboard');
        }

        const getProductInfo = async () => {
            setLoading(true);
            try {
                const res = await axios.post('/getProductDetails', { productID: product.productID });

                const allVariants = res.data.productInfo;

                if (allVariants.length > 0) {
                    const { base_price } = allVariants[0];

                    setValues(prev => ({
                        ...prev,
                        description: res.data.description,
                        base_price: base_price?.toString() ?? prev.base_price
                    }));

                    setVariants(allVariants.map(v => ({
                        variantID: v.variantID,
                        size: v.size,
                        price: v.pricePerSize
                    })));
                }

            } catch (err) {
                console.error('Unable to get product details: ', err);
            } finally {
                setLoading(false);
            }
        };

        getProductInfo();

        document.title = `Edit Product | CAFÉ de JÚR`;
    }, [product, navigate]);

    const inputDivStyle = `flex flex-row justify-between items-start w-full mt-5`;
    const labelStyle = `font-noticia text-base`;
    const inputFieldStyle = `p-2 font-noticia bg-white text-gray-800 w-2/3 outline-none border-1 border-gray-400 rounded-md text-base`;
    const addCancelBtn = `py-2 px-4 font-noticia text-base rounded-md cursor-pointer`;

    const handleValuesOnChange = (e) => {
        const { name, value } = e.target;
        setValues((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        setValues({});
        setFile(null);
        setImgUrl("");
        navigate("/admin-products");
    };

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
                <form className='w-[90%] flex flex-col items-start justify-start pb-15 xl:w-[70%] 2xl:w-[60%]'>
                    <p className='font-noticia text-xl font-bold mb-3'>Add Product</p>

                    <div className='w-full flex flex-col items-start justify-start'>
                        <div className={inputDivStyle}>
                            <label htmlFor="" className={labelStyle}>Name: </label>
                            <input type="text" name="productName" className={inputFieldStyle} value={values.productName} onChange={handleValuesOnChange} required />
                        </div>
                        <div className={inputDivStyle}>
                            <label htmlFor="" className={labelStyle}>Description: </label>
                            <textarea name="description" rows={5} className={inputFieldStyle} value={values.description} onChange={handleValuesOnChange} required />
                        </div>
                        <div className={inputDivStyle}>
                            <label htmlFor="" className={labelStyle}>Category: </label>
                            <input type="text" className={inputFieldStyle} value={values.category} onChange={handleValuesOnChange} disabled />
                        </div>
                        {values.category === 'Beverage' ? (
                            <TableContainer component={Paper} sx={{ marginTop: 3 }}>
    <Table>
        <TableHead>
            <TableRow>
                <TableCell sx={{ fontFamily: 'Noticia Text', fontWeight: 'bold', width: '50%' }}>Size</TableCell>
                <TableCell sx={{ fontFamily: 'Noticia Text', fontWeight: 'bold', width: '50%' }}>Price ₱</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {variants.map((variant, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontFamily: 'Noticia Text', width: '50%' }}>
                        {variant.size}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'Noticia Text', width: '50%' }}>
                        <input type="text" value={variant.price} onChange={(e) => {
                            const newVariants = [...variants];
                            newVariants[index].price = e.target.value;
                            setVariants(newVariants);
                        }} />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
</TableContainer>

                        ) : (
                            <div className={inputDivStyle}>
                                <label htmlFor="" className={labelStyle}>Price: </label>
                                <div className='flex flex-row font-noticia bg-white items-center justify-start text-gray-600 w-2/3 outline-none border-1 border-gray-400 rounded-md'>
                                    <p className='font-noticia text-base px-4 border-r-2 border-gray-300 py-2'>₱</p>
                                    <input type="number" name="base_price" step="0.01" min="0" className='w-full p-2 font-noticia bg-white text-gray-600 outline-none text-base rounded-md' value={values.base_price} onChange={handleValuesOnChange} required />
                                </div>
                            </div>
                        )}
                        <div className={inputDivStyle}>
                            <label htmlFor="" className={labelStyle}>Image: </label>
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
                                />
                                {imgUrl ? (
                                    <div className='mt-3'>
                                        <p className='font-noticia text-sm text-gray-500 mb-1'>Preview:</p>
                                        <img
                                            src={imgUrl}
                                            alt="Selected Preview"
                                            className='w-[200px] h-auto border border-gray-300 rounded-md shadow'
                                        />
                                    </div>
                                ) : (
                                    <div className='mt-3'>
                                        <p className='font-noticia text-sm text-gray-500 mb-1'>Preview:</p>
                                        <img
                                            src={values.image}
                                            alt="Selected Preview"
                                            className='w-[200px] h-auto border border-gray-300 rounded-md shadow'
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='w-full flex flex-row items-center justify-end gap-4 mt-3'>
                        <button type='submit' className={`${addCancelBtn} bg-lightBrownBG hover:bg-[#dec9a0] transition-colors`} onClick={handleEdit}>Save Changes</button>
                        <button type='button' className={`${addCancelBtn} border-1 border-gray-400 hover:bg-gray-200 transition-colors`} onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default EditProduct;
