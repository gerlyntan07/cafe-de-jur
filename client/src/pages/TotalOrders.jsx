import React, { useEffect, useState } from 'react';
import axios from '../hooks/AxiosConfig';
import AdminHeader from '../components/AdminHeader.jsx';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

function AdminPaidOrders() {
    const [paidOrders, setPaidOrders] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    document.title = "Orders | CAFÉ de JÚR";

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        const fetchPaidOrders = async () => {
            try {
                const res = await axios.get('/admin-getPaidOrders');
                console.log(res.data.paidOrders);
                setPaidOrders(res.data.paidOrders);
            } catch (err) {
                console.error('Error fetching paid orders:', err);
            }
        };
        fetchPaidOrders();
    }, []);

    const formatDate = (date) =>
        new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });

    const filteredOrders = paidOrders.filter(order => {
        const orderMatch =
            order.orderID.toString().includes(searchValue.toLowerCase()) ||
            order.firstname.toLowerCase().includes(searchValue.toLowerCase()) ||
            order.lastname.toLowerCase().includes(searchValue.toLowerCase()) ||
            order.paymentMethod.toLowerCase().includes(searchValue.toLowerCase()) ||
            order.phoneNum.toLowerCase().includes(searchValue.toLowerCase());

        const itemMatch = order.items.some(item =>
            item.productName.toLowerCase().includes(searchValue.toLowerCase()) ||
            (item.category && item.category.toLowerCase().includes(searchValue.toLowerCase()))
        );

        return searchValue === '' || orderMatch || itemMatch;
    });


    return (
        <div className='flex flex-col w-full lg:flex-row bg-gray-100 items-start justify-start'>
            <AdminHeader />
            <div className='w-full h-screen pt-35 flex flex-col items-center justify-start xl:h-screen xl:pt-15 overflow-y-auto'>
                <div className='w-[90%] xl:w-[70%] flex flex-col items-start justify-start'>
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

                    <div className='flex flex-col w-full pb-10 pt-5 mt-5 xl:pb-20'>
                        <Paper className='w-full overflow-auto'>
                            <TableContainer className='max-h-300' style={{ minWidth: '100%' }}>
                                <Table stickyHeader aria-label="sticky table" style={{ minWidth: 'max-content' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontFamily: 'Noticia Text', fontSize: '1rem', fontWeight: 'bold' }}>Order ID</TableCell>
                                            <TableCell sx={{ fontFamily: 'Noticia Text', fontSize: '1rem', fontWeight: 'bold' }}>Customer</TableCell>
                                            <TableCell sx={{ fontFamily: 'Noticia Text', fontSize: '1rem', fontWeight: 'bold' }}>Total</TableCell>
                                            <TableCell sx={{ fontFamily: 'Noticia Text', fontSize: '1rem', fontWeight: 'bold' }}>Date</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {filteredOrders
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((order) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={order.orderID} onClick={() => { setSelectedOrder(order); setShowDetails(true) }}>
                                                        <TableCell sx={{ fontFamily: 'Noticia Text', fontSize: '1rem' }}>{order.orderID}</TableCell>
                                                        <TableCell sx={{ fontFamily: 'Noticia Text', fontSize: '1rem' }}>{order.firstname} {order.lastname}</TableCell>
                                                        <TableCell sx={{ fontFamily: 'Noticia Text', fontSize: '1rem' }}>₱{order.amountPaid}</TableCell>
                                                        <TableCell sx={{ fontFamily: 'Noticia Text', fontSize: '1rem' }}>{formatDate(order.orderedAt)}</TableCell>
                                                    </TableRow>)
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={filteredOrders.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </div>
                </div>
            </div>




            {showDetails && selectedOrder && (
                <div className="absolute top-0 left-0 bg-black/50 w-full h-full flex items-center justify-center z-10000">
                    <div className='mt-10 w-[90%] md:w-[60%] 2xl:w-[30%] lg:w-[40%] bg-white p-5 rounded-lg shadow-md h-[60%] md:h-[50%] lg:h-[40%] xl:h-[70%] overflow-y-auto'>
                        <div className='flex flex-row w-full justify-between items-start mb-3'>
                            <h2 className='text-xl font-bold font-noticia'>Order #{selectedOrder.orderID}</h2>
                            <button className='font-semibold text-lg text-gray-400 cursor-pointer' onClick={() => {setShowDetails(false); setSelectedOrder(null)}}>x</button>
                        </div>                        

                        <p className='font-noticia'><strong>Customer:</strong> {selectedOrder.firstname} {selectedOrder.lastname}</p>
                        <p className='font-noticia'><strong>Order Date:</strong> {formatDate(selectedOrder.orderedAt)}</p>
                        <p className='font-noticia'><strong>Total:</strong> ₱{selectedOrder.amountPaid}</p>                        
                        <p className='font-noticia'><strong>Phone:</strong> {selectedOrder.phoneNum}</p>
                        <p className='font-noticia'><strong>Delivery Address:</strong> {selectedOrder.address}</p>
                        <p className='font-noticia'><strong>Mode of Payment:</strong> {selectedOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Debit/Credit Card'}</p>

                        <hr className='my-4' />

                        <h3 className='font-bold text-lg mb-2 font-noticia'>Items:</h3>
                        {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className='mb-3 p-3 bg-inputGray rounded'>
                                <p className='font-noticia'><strong>{item.quantity}x {item.productName}</strong> ₱{item.totalItemPrice}</p>
                                {item.addOns.length > 0 && (
                                    <p className='text-sm text-gray-600'>
                                        {item.addOns.join(', ')}
                                    </p>
                                )}
                                {item.size && <p className='text-sm text-gray-500'>Size: {item.size}</p>}
                            </div>
                        ))}
                    </div>

                    {/* <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg relative">
                        <button
                            className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
                            onClick={() => setShowDetails(false)}
                        >
                            &times;
                        </button>

                        <h2 className="text-xl font-bold mb-3">Order #{selectedOrder.orderID}</h2>
                        <p className="text-sm text-gray-600 mb-1">Ordered At: {formatDate(selectedOrder.orderedAt)}</p>
                        <p className="text-sm text-gray-600 mb-1">Paid At: {formatDate(selectedOrder.paidAt)}</p>
                        <p className="text-sm text-gray-600 mb-1">Customer: {selectedOrder.firstname} {selectedOrder.lastname}</p>
                        <p className="text-sm text-gray-600 mb-1">Email: {selectedOrder.email}</p>
                        <p className="text-sm text-gray-600 mb-1">Phone: {selectedOrder.phoneNum}</p>
                        <p className="text-sm text-gray-600 mb-1">Address: {selectedOrder.address}</p>
                        <p className="font-bold mt-2">Total: ₱{selectedOrder.amountPaid}</p>

                        <hr className="my-4" />

                        <h3 className="font-semibold mb-2">Items Ordered:</h3>
                        {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="mb-2 ml-2">
                                <p><strong>{item.quantity}x {item.productName}</strong> ₱{item.totalItemPrice}</p>
                                {item.addOns.length > 0 && (
                                    <p className="text-sm text-gray-500 ml-4">Add-ons: {item.addOns.join(', ')}</p>
                                )}
                                {item.size && (
                                    <p className="text-sm text-gray-500 ml-4">Size: {item.size}</p>
                                )}
                            </div>
                        ))}
                    </div> */}
                </div>
            )}

        </div>
    );
}

export default AdminPaidOrders;
