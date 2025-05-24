import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const PerformanceMetrics = ({ stats, previousStats }) => {
    const performanceData = {
        labels: ['Users', 'Orders', 'Products', 'Revenue'],
        datasets: [
            {
                label: 'Current Period',
                data: [
                    stats?.totalUsers || 0,
                    stats?.totalOrders || 0,
                    stats?.totalProducts || 0,
                    stats?.totalRevenue || 0
                ],
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 2,
                borderRadius: 8,
                barThickness: 40,
                maxBarThickness: 50,
            },
            {
                label: 'Previous Period',
                data: [
                    previousStats?.totalUsers || 0,
                    previousStats?.totalOrders || 0,
                    previousStats?.totalProducts || 0,
                    previousStats?.totalRevenue || 0
                ],
                backgroundColor: 'rgba(156, 163, 175, 0.7)',
                borderColor: 'rgb(156, 163, 175)',
                borderWidth: 2,
                borderRadius: 8,
                barThickness: 40,
                maxBarThickness: 50,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    padding: 20,
                    font: {
                        size: 12,
                        weight: '600'
                    }
                }
            },
            title: {
                display: true,
                text: 'Performance Comparison',
                font: {
                    size: 16,
                    weight: 'bold'
                },
                padding: {
                    top: 10,
                    bottom: 20
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
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== undefined) {
                            label += new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR'
                            }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    font: {
                        size: 12
                    },
                    padding: 10
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 12
                    },
                    padding: 10
                }
            }
        },
        animation: {
            duration: 2000,
            easing: 'easeInOutQuart'
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Metrics</h2>
            <div className="h-[500px]">
                <Bar data={performanceData} options={chartOptions} />
            </div>
        </div>
    );
};

export default PerformanceMetrics; 