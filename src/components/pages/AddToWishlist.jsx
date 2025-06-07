import React, { useState, useEffect } from "react"
import useWishlistStore from "../../store/wishlistStore.js"
import { Heart, Loader2 } from "lucide-react"
import { useAuth } from "../../hooks/useAuth.js"
import { useNavigate } from "react-router-dom"

const AddToWishlist = ({ product, variant }) => {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const addToWishlist = useWishlistStore((state) => state.addToWishlist)
    const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist)
    const wishlistItems = useWishlistStore((state) => state.items)
    const navigate = useNavigate()

    // Check if product is in wishlist
    const isInWishlist = wishlistItems?.some(
        (item) => item.product.id === product.id &&
            (!variant || item.variant?.id === variant.id)
    )

    const handleWishlist = async () => {
        if (!user) {
            navigate("/login")
            return
        }
        try {
            setLoading(true)
            setError(null)
            if (isInWishlist) {
                await removeFromWishlist(product._id, variant?._id)
            } else {
                await addToWishlist(product, variant, 1)
            }
        } catch (err) {
            console.error("Error updating wishlist:", err)
            if (err.message === "User not authenticated") {
                navigate("/login")
            } else {
                setError(err.message || "Failed to update wishlist")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={handleWishlist}
                disabled={loading}
                className={`flex items-center justify-center gap-2 ${isInWishlist
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                    } text-white px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                ) : (
                    <>
                        <Heart className={isInWishlist ? "fill-white" : ""} size={20} />
                        {user
                            ? isInWishlist
                                ? "Remove from Wishlist"
                                : "Add to Wishlist"
                            : "Login to Add to Wishlist"
                        }
                    </>
                )}
            </button>
            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}
        </div>
    )
}

export default AddToWishlist