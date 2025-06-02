import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useSearchStore from '../../store/searchStore';

export default function SearchResults() {
    const { searchResults, isLoading, error } = useSearchStore();

    if (isLoading) {
        return (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg p-4 mt-2">
                <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg p-4 mt-2">
                <p className="text-red-600 text-center py-2">{error}</p>
            </div>
        );
    }

    if (!searchResults.length) {
        return <div className='absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg p-4 mt-2 max-h-96 overflow-y-auto'>
            <h2 className='text-gray-600 text-sm font-medium'>No results found</h2>
        </div>;
    }

    return (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg p-4 mt-2 max-h-96 overflow-y-auto">
            <div className="space-y-2">
                {searchResults.map((product) => (
                    <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition"
                    >
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                            <h3 className="font-medium text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-600">₹{product.price}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
} 