import React from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const PaymentStatus = ({ stats }) => {
    const paymentStatusData = {
        labels: ['Completed', 'Pending', 'Failed'],
        datasets: [
            {
                data: [65, 25, 10],
                backgroundColor: [
                    'rgba(16, 185, 134, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderColor: [
                    'rgb(16, 185, 134)',
                    'rgb(245, 158, 11)',
                    'rgb(239, 68, 68)'
                ],
                borderWidth: 2,
                hoverOffset: 15
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 25,
                    font: {
                        size: 13,
                        weight: '600'
                    },
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1f2937',
                bodyColor: '#4b5563',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        },
        animation: {
            animateScale: true,
            animateRotate: true,
            duration: 2000,
            easing: 'easeInOutQuart'
        }
    };

    const statusDetails = [
        { label: 'Completed', count: 65, color: 'bg-emerald-500' },
        { label: 'Pending', count: 25, color: 'bg-amber-500' },
        { label: 'Failed', count: 10, color: 'bg-red-500' }
    ];

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Status Distribution</h2>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="w-[600px] h-[500px] flex items-center justify-center">
                    <Doughnut data={paymentStatusData} options={chartOptions} />
                </div>
                <div className="flex-1 space-y-4">
                    {statusDetails.map((status, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${status.color}`} />
                                <span className="font-medium text-gray-700">{status.label}</span>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold text-gray-900">{status.count}</div>
                                <div className="text-sm text-gray-500">
                                    {Math.round((status.count / 100) * 100)}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PaymentStatus; 