import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const DashboardGraph = ({ stats }) => {
    const growthData = {
        labels: ['Users', 'Orders', 'Products', 'Revenue'],
        datasets: [
            {
                label: 'Growth Rate (%)',
                data: [
                    stats?.usersGrowth || 0,
                    stats?.ordersGrowth || 0,
                    stats?.productsGrowth || 0,
                    stats?.revenueGrowth || 0,
                ],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.3)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const totalData = {
        labels: ['Users', 'Orders', 'Products', 'Revenue'],
        datasets: [
            {
                label: 'Users / Orders / Products',
                data: [
                    stats?.totalUsers || 0,
                    stats?.totalOrders || 0,
                    stats?.totalProducts || 0,
                    null, // Don't plot revenue in this dataset
                ],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1,
                yAxisID: 'y',
            },
            {
                label: 'Revenue (INR)',
                data: [null, null, null, stats?.totalRevenue || 0],
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderColor: 'rgb(255, 206, 86)',
                borderWidth: 1,
                yAxisID: 'y1',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' },
            title: {
                display: true,
                text: 'Dashboard Analytics',
                font: {
                    size: 18,
                    weight: 'bold',
                },
                padding: {
                    top: 10,
                    bottom: 30,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Count',
                },
            },
            y1: {
                beginAtZero: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
                title: {
                    display: true,
                    text: 'Revenue (INR)',
                },
            },
        },
    };

    return (
        <div className="space-y-10">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Total Metrics Overview</h3>
                <Bar data={totalData} options={options} />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">📈 Growth Rate Analysis</h3>
                <Line data={growthData} options={options} />
            </div>
        </div>
    );
};

export default DashboardGraph;
