import axios from '../hooks/AxiosConfig.js';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'

function OrderHistory() {
    document.title = "Order History | CAFÉ de JÚR";

    const [paidOrders, setPaidOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [paymentDetails, setPaymentDetails] = useState(null);

    useEffect(() => {
        const getPaidOrders = async () => {
            try {
                const res = await axios.post('/getPaidOrders')
                setPaidOrders(res.data.paidOrders);
            } catch (err) {
                console.error("Error fetching paid orders:", err);
            }
        }
        getPaidOrders();
    }, [])

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        return new Date(dateString).toLocaleString('en-US', options);
    };

    const fetchSelectedOrder = async (orderID) => {
        try {
            const res = await axios.post('/getSelectedOrder', { orderID });
            setOrderDetails(res.data.orderDetails);
            setPaymentDetails(res.data.paymentDetails);
        } catch (err) {
            console.error("Error fetching selected order details:", err);
        }
    };

    const groupOrderItems = (details) => {
        const grouped = {};

        details.forEach(item => {
            const id = item.orderItemID;
            if (!grouped[id]) {
                grouped[id] = {
                    orderItemID: id,
                    productName: item.productName,
                    quantity: item.quantity,
                    size: item.size,
                    totalItemPrice: item.totalItemPrice,
                    addOns: item.addOnName ? [item.addOnName] : []
                };
            } else {
                if (item.addOnName && !grouped[id].addOns.includes(item.addOnName)) {
                    grouped[id].addOns.push(item.addOnName);
                }
            }
        });

        return Object.values(grouped);
    };


    return (
        <>
            <div className='w-[90%] md:w-[60%] lg:w-[40%] rounded-[10px] bg-white shadow-lg flex flex-col items-center justify-center py-5'>
                <p className='w-full font-noticia font-bold pb-3 border-b-1 pl-5 mb-5 text-xl'>Order History</p>

                {paidOrders.length > 0 ? (
                    paidOrders.map((order) => {
                        return (
                            <div className='w-[90%] flex flex-col-reverse items-start justify-between py-2 rounded-md bg-inputGray mb-3 px-3 gap-2 xl:flex-row cursor-pointer' key={order.orderID} onClick={() => { setSelectedOrder(order); fetchSelectedOrder(order.orderID) }}>
                                <div className='flex flex-col gap-1'>
                                    <p className='font-noticia'>Order ID: {order.orderID}</p>
                                    <p className='font-noticia'>Ordered At: {formatDate(order.orderedAt)}</p>
                                </div>

                                <p className='font-noticia font-bold text-lg'>₱{order.amountPaid}</p>
                            </div>)
                    })
                ) : (
                    <p>No orders.</p>
                )}
            </div>

            {selectedOrder && (
                <div className='absolute top-0 left-0 bg-black/50 w-full h-full flex items-center justify-center z-10000'>
                    <div className='mt-10 w-[90%] md:w-[60%] lg:w-[40%] 2xl:w-[30%] bg-white p-5 rounded-lg shadow-md h-[70%] 2xl:h-[60%] overflow-y-auto'>
                        <div className='flex flex-row w-full justify-between items-start mb-3'>
                            <h2 className='text-xl font-bold font-noticia'>Order #{selectedOrder.orderID}</h2>
                            <button className='font-semibold text-gray-400 text-xl cursor-pointer' onClick={() => setSelectedOrder(null)}>x</button>
                        </div>                        

                        <p className='font-noticia'><strong>Order Date:</strong> {formatDate(selectedOrder.orderedAt)}</p>
                        <p className='font-noticia'><strong>Total:</strong> ₱{paymentDetails?.amountPaid}</p>
                        <p className='font-noticia'><strong>Payment Method:</strong> {paymentDetails?.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Debit/Credit Card'}</p>
                        <p className='font-noticia'><strong>Delivery Address:</strong> {paymentDetails?.address}</p>

                        <hr className='my-4' />

                        <h3 className='font-bold text-lg mb-2 font-noticia'>Items:</h3>
                        {groupOrderItems(orderDetails).map((item, idx) => (
                            <div key={idx} className='mb-3 p-3 bg-inputGray rounded'>
                                <p className='font-noticia'><strong>{item.quantity}x {item.productName}</strong> — ₱{item.totalItemPrice}</p>
                                {item.addOns.length > 0 && (
                                    <p className='text-sm text-gray-600'>
                                        {item.addOns.join(', ')}
                                    </p>
                                )}
                                {item.size && <p className='text-sm text-gray-500'>Size: {item.size}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </>
    )
}

export default OrderHistory