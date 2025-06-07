import React, { useState } from "react"
import { Heart, Loader2 } from "lucide-react"
import useWishlistStore from "../../store/wishlistStore.js"
import { useAuth } from "../../hooks/useAuth.js"
import { useNavigate } from "react-router-dom"

const AddToWishlist = ({ product, variant }) => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const addToWishlist = useWishlistStore((state) => state.addToWishlist)
    const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist)
    const isInWishlist = useWishlistStore((state) =>
        state.isInWishlist(product?.id, variant?.id)
    )

    const handleWishlist = async () => {
        if (!user) {
            navigate("/login")
            return
        }
        if (!product || !variant) {
            setError("Product or variant information is missing")
            return
        }
        try {
            setLoading(true)
            setError(null)

            if (isInWishlist) {
                await removeFromWishlist(product.id, variant.id)
            } else {
                await addToWishlist(product, variant)
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