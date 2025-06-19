import React, { useEffect, useState } from 'react'
import AdminHeader from '../components/AdminHeader.jsx';
import { HashLink } from 'react-router-hash-link';
import SearchIcon from '@mui/icons-material/Search';
import axios from '../hooks/AxiosConfig.js';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function ManageProducts() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [prodCategory, setProdCategory] = useState('All');
    const [searchValue, setSearchValue] = useState('');
    const [confirmDelModal, setConfirmDelModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        document.title = `Products | CAFÉ de JÚR`;
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await axios.get('/getProducts');
                setProducts(res.data.productList);
            } catch (err) {
                console.error('Failed to fetch products:', err);
            }
        }

        getProducts();
    }, []);


    const filteredProducts = products.filter(product => {
        const categoryMatch = prodCategory === 'All' || product.category === prodCategory;

        const searchMatch =
            product.productName.toLowerCase().includes(searchValue.toLowerCase()) ||
            product.category.toLowerCase().includes(searchValue.toLowerCase()) ||
            (product.min_price && product.min_price.toString().includes(searchValue)) ||
            (product.max_price && product.max_price.toString().includes(searchValue)) ||
            (product.base_price && product.base_price.toString().includes(searchValue));

        return categoryMatch && (searchValue === '' || searchMatch);
    }).sort((a, b) => {
        const priceA = a.min_price ?? a.base_price ?? 0;
        const priceB = b.min_price ?? b.base_price ?? 0;
        return priceA - priceB;
    });

    const cancelDelBtn = `font-noticia cursor-pointer rounded-md py-2 w-[45%]`;

    const handleDeleteProduct = async(productID) => {
        try{
            const res = await axios.put('/deleteProduct', {productID});
            if(res.data.message === 'Product deleted'){
                toast.success('Product deleted', {
                    autoClose: 2000
                })
                setProducts(prev => 
                    prev.filter(p => p.productID !== selectedProduct.productID)
                );
                setConfirmDelModal(false);
            }
        } catch(err){
            console.error('Failed to delete product:', err);
        }
    }

    const handleEditProduct = async(product) => {
        navigate('/edit-product', { state: { product } });
    }

    return (
        <div className='flex flex-col w-full lg:flex-row bg-gray-100 items-start justify-start'>
            <AdminHeader />
            <ToastContainer position='bottom-center' hideProgressBar={true} />
            {confirmDelModal && selectedProduct && (
                <div className='fixed top-0 left-0 h-full w-full flex items-center justify-center z-100 bg-black/50'>
                    <div className='bg-white px-5 py-10 rounded-xl shadow-lg w-3/4 md:w-2/4 xl:w-1/3 text-center items-center justify-center'>
                        <DeleteTwoToneIcon sx={{ color: 'red', fontSize: 50 }} />
                        <p className='font-inika font-bold text-lg'>Are you sure you want to remove <span className='text-red-500'>{selectedProduct.productName}</span> from the product list?</p>
                        <p className='font-inika text-base pt-2 pb-5'>This action cannot be undone.</p>

                        <div className='flex flex-row justify-center gap-5'>
                            <button className={`${cancelDelBtn} border-gray-300 border-2`} onClick={() => setConfirmDelModal(false)}>Cancel</button>
                            <button className={`${cancelDelBtn} bg-red-500 text-white`} onClick={() => handleDeleteProduct(selectedProduct.productID)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
            <section id='admin-products' className='w-full h-screen pt-35 flex flex-col items-center justify-start xl:h-screen xl:pt-15 overflow-y-auto'>
                <div className='w-[90%] xl:w-[85%] flex flex-col items-start justify-start'>
                    <form className='flex w-[60%] items-center px-2 border-b-2 border-gray-300 py-1'>
                        <SearchIcon className='text-gray-600 mr-2' />
                        <input
                            className='font-noticia w-full text-base focus:outline-none'
                            type='text'
                            placeholder='Search here'
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </form>

                    <HashLink to='/add-products' className='bg-lightBrownBG py-2 px-4 font-noticia cursor-pointer mt-4 rounded-md'>Add Product</HashLink>

                    <div className='flex flex-col w-full pb-10 pt-5 mt-5 xl:pb-20'>
                        <div className='flex flex-row mb-3'>
                            <p className='font-noticia'>Filter: </p>
                            <select className='font-noticia ml-2 outline-none border-1 border-gray-500 px-5 cursor-pointer bg-white' name="" value={prodCategory} onChange={e => setProdCategory(e.target.value)}>
                                <option value="All">All</option>
                                <option value="Beverage">Beverage</option>
                                <option value="Croffle">Croffle</option>
                                <option value="Pasta">Pasta</option>
                                <option value="Silog">Silog</option>
                            </select>
                        </div>

                        <Paper className='w-full overflow-auto'>
                            <TableContainer className='max-h-300' style={{ minWidth: '100%' }}>
                                <Table stickyHeader aria-label="sticky table" style={{ minWidth: 'max-content' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontFamily: 'Noticia Text', fontSize: '1rem', fontWeight: 'bold' }}>Name</TableCell>
                                            <TableCell sx={{ fontFamily: 'Noticia Text', fontSize: '1rem', fontWeight: 'bold' }}>Price</TableCell>
                                            <TableCell sx={{ fontFamily: 'Noticia Text', fontSize: '1rem', fontWeight: 'bold' }}>Category</TableCell>
                                            <TableCell sx={{ fontFamily: 'Noticia Text', fontSize: '1rem', fontWeight: 'bold' }}>Sold</TableCell>
                                            <TableCell sx={{ fontFamily: 'Noticia Text', fontSize: '1rem', fontWeight: 'bold' }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {filteredProducts
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((product) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={product.productID}>
                                                        <TableCell sx={{ fontFamily: 'Noticia Text', fontSize: '1rem' }}>{product.productName}</TableCell>
                                                        <TableCell sx={{ fontFamily: 'Noticia Text', fontSize: '1rem' }}>{product.min_price && product.max_price
                                                            ? (product.min_price === product.max_price
                                                                ? `₱${Number(product.min_price).toFixed(2)}`
                                                                : `₱${Number(product.min_price).toFixed(2)} - ₱${Number(product.max_price).toFixed(2)}`)
                                                            : `₱${Number(product.base_price).toFixed(2)}`}</TableCell>
                                                        <TableCell sx={{ fontFamily: 'Noticia Text', fontSize: '1rem' }}>{product.category}</TableCell>
                                                        <TableCell sx={{ fontFamily: 'Noticia Text', fontSize: '1rem' }}>{product.totalSold === null ? '0' : product.totalSold}</TableCell>
                                                        <TableCell sx={{ fontFamily: 'Noticia Text', fontSize: '1rem' }}>
                                                            <button className='cursor-pointer' onClick={() => handleEditProduct(product)}><EditTwoToneIcon className='text-green-600 cursor-pointer' /></button>
                                                            <button className='cursor-pointer' onClick={() => {setConfirmDelModal(true); setSelectedProduct(product)}}><DeleteTwoToneIcon className='text-red-500 cursor-pointer' /></button>
                                                        </TableCell>

                                                    </TableRow>)
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={filteredProducts.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ManageProducts