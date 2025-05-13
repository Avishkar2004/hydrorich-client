import React, { useState } from 'react';
import useCartStore from '../store/cartStore.js';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

const AddToCart = ({ product, variant }) => {
    const { user } = useAuth(); // get user from auth hook
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Adding to cart:', { product, variant, user });
            await addToCart(user?.id, product, variant, 1); // ✅ fix here
            console.log('Successfully added to cart');
        } catch (err) {
            console.error('Error adding to cart:', err);
            setError(err.message || 'Failed to add item to cart');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <button onClick={handleAddToCart}
                disabled={!user || loading}
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