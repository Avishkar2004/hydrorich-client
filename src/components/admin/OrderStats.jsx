import React from 'react';
import CircularStats from './CircularStats';

const OrderStats = ({ orders = [] }) => {
    // Calculate order status statistics
    const calculateStatusStats = () => {
        const statusCounts = {
            delivered: 0,
            processing: 0,
            shipped: 0,
            cancelled: 0
        };

        orders.forEach(order => {
            statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
        });

        const total = orders.length || 1; // Avoid division by zero

        return {
            delivered: (statusCounts.delivered / total) * 100,
            processing: (statusCounts.processing / total) * 100,
            shipped: (statusCounts.shipped / total) * 100,
            cancelled: (statusCounts.cancelled / total) * 100
        };
    };

    // Calculate payment statistics
    const calculatePaymentStats = () => {
        const paymentCounts = {
            completed: 0,
            pending: 0,
            failed: 0
        };

        orders.forEach(order => {
            paymentCounts[order.payment_status] = (paymentCounts[order.payment_status] || 0) + 1;
        });

        const total = orders.length || 1; // Avoid division by zero

        return {
            completed: (paymentCounts.completed / total) * 100,
            pending: (paymentCounts.pending / total) * 100,
            failed: (paymentCounts.failed / total) * 100
        };
    };

    const statusStats = calculateStatusStats();
    const paymentStats = calculatePaymentStats();

    return (
        <div className="space-y-8">
            {/* Order Status Section */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <CircularStats
                        percentage={statusStats.delivered}
                        color="green"
                        label="Delivered"
                        value={`${Math.round(statusStats.delivered)}%`}
                    />
                    <CircularStats
                        percentage={statusStats.processing}
                        color="blue"
                        label="Processing"
                        value={`${Math.round(statusStats.processing)}%`}
                    />
                    <CircularStats
                        percentage={statusStats.shipped}
                        color="yellow"
                        label="Shipped"
                        value={`${Math.round(statusStats.shipped)}%`}
                    />
                    <CircularStats
                        percentage={statusStats.cancelled}
                        color="red"
                        label="Cancelled"
                        value={`${Math.round(statusStats.cancelled)}%`}
                    />
                </div>
            </div>

            {/* Payment Status Section */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <CircularStats
                        percentage={paymentStats.completed}
                        color="green"
                        label="Completed"
                        value={`${Math.round(paymentStats.completed)}%`}
                    />
                    <CircularStats
                        percentage={paymentStats.pending}
                        color="yellow"
                        label="Pending"
                        value={`${Math.round(paymentStats.pending)}%`}
                    />
                    <CircularStats
                        percentage={paymentStats.failed}
                        color="red"
                        label="Failed"
                        value={`${Math.round(paymentStats.failed)}%`}
                    />
                </div>
            </div>
        </div>
    );
};



export default OrderStats;
