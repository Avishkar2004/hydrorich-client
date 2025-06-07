import React, { useState, useEffect } from 'react';
import useCartStore from '../../store/cartStore.js';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';

const AddToCart = ({ product, variant }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const addToCart = useCartStore((state) => state.addToCart);
    const navigate = useNavigate();

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            setLoading(true);
            setError(null);
            await addToCart(product, variant, 1);
        } catch (err) {
            console.error('Error adding to cart:', err);
            if (err.message === 'User not ') {
                navigate('/login');
            } else {
                setError(err.message || 'Failed to add item to cart');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={handleAddToCart}
                disabled={loading}
                className='flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
                {loading ? (
                    <>
                        <Loader2 className='animate-spin' size={20} />
                        Adding...
                    </>
                ) : (
                    user ? "Add to Cart" : "Login to Add to Cart"
                )}
            </button>
            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}
        </div>
    );
};

export default AddToCart; 