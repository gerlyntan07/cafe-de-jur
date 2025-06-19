import React, { useEffect, useState } from 'react'
import AdminHeader from '../components/AdminHeader.jsx';
import axios from '../hooks/AxiosConfig.js';
import ImageKit from 'imagekit-javascript';

function AddProduct() {
    const [file, setFile] = useState(null);
    const [imgUrl, setImgUrl] = useState('');

    const handleUpload = async () => {
        const auth = await axios.get('/auth');

        const imagekit = new ImageKit({
            publicKey: 'public_kmsnL4qBvga+0fwoVrqxUbM8c94=',
            urlEndpoint: 'https://ik.imagekit.io/cafedejur',
            authenticationEndpoint: 'http://localhost:3001/api/auth',
        });

        imagekit.upload(
            {
                file: file,
                fileName: file.name,
            },
            (err, result) => {
                if (err) console.error(err);
                else console.log('Upload success:', result.url);
            }
        );
    };

    useEffect(() => {
        return () => {
            if (imgUrl) {
                URL.revokeObjectURL(imgUrl);
            }
        };
    }, [imgUrl]);

    const inputDivStyle = `flex flex-row justify-between items-start w-full mt-5`;
    const labelStyle = `font-noticia text-base`;
    const inputFieldStyle = `p-2 font-noticia bg-white text-gray-600 w-2/3 outline-none border-1 border-gray-400 rounded-md text-base`;

    return (
        <div className='flex flex-col w-full lg:flex-row bg-gray-100 items-start justify-start'>
            <AdminHeader />
            <section id='add-product' className='w-full h-screen pt-35 flex flex-col items-center justify-start xl:h-screen xl:pt-15 overflow-y-auto'>
                <div className='w-[90%] flex flex-col items-start justify-start pb-15 xl:w-[70%] 2xl:w-[60%]'>
                    <p className='font-noticia text-xl font-bold mb-3'>Add Product</p>

                    <div className='w-full flex flex-col items-start justify-start'>
                        <div className={inputDivStyle}>
                            <label htmlFor="" className={labelStyle}>Name: </label>
                            <input type="text" className={inputFieldStyle} />
                        </div>
                        <div className={inputDivStyle}>
                            <label htmlFor="" className={labelStyle}>Description: </label>
                            <textarea rows={5} className={inputFieldStyle} />
                        </div>
                        <div className={inputDivStyle}>
                            <label htmlFor="" className={labelStyle}>Category: </label>
                            <select name="" id="" className={inputFieldStyle}>
                                <option value="Beverage">Beverage</option>
                                <option value="Croffle">Croffle</option>
                                <option value="Pasta">Pasta</option>
                                <option value="Silog">Silog</option>
                            </select>
                        </div>
                        <div className={inputDivStyle}>
                            <label htmlFor="" className={labelStyle}>Price: </label>
                            <div className='flex flex-row font-noticia bg-white items-center justify-start text-gray-600 w-2/3 outline-none border-1 border-gray-400 rounded-md'>
                                <p className='font-noticia text-base px-4 border-r-2 border-gray-300 py-2'>₱</p>
                                <input type="number" className='p-2 font-noticia bg-white text-gray-600 w-2/3 outline-none text-base' />
                            </div>
                        </div>
                        <div className={inputDivStyle}>
                            <label htmlFor="" className={labelStyle}>Image: </label>
                            <div className='flex flex-col w-2/3'>
                                <input
                                    className='p-2 font-noticia bg-white text-gray-600 outline-none border-1 border-gray-400 rounded-md text-base'
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const selectedFile = e.target.files[0];
                                        setFile(selectedFile);
                                        if (selectedFile) {
                                            setImgUrl(URL.createObjectURL(selectedFile)); // <-- preview without upload
                                        } else {
                                            setImgUrl('');
                                        }
                                    }}
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
                </div>
            </section>
        </div>
    )
}

export default AddProduct