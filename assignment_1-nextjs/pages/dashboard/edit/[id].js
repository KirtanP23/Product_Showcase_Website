import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { client } from '@/lib/contentful';

export default function EditProduct({ product }) {
    // Debug: Log the product fields to see the structure
    console.log('Product fields:', product.fields);
    console.log('price field:', product.fields.price);
    console.log('keyFeatures field:', product.fields.keyFeatures);

    const [title, setTitle] = useState(product.fields.title || '');
    const [description, setDescription] = useState(product.fields.description || '');
    const [price, setPrice] = useState(product.fields.price || '');
    const [features, setFeatures] = useState(
        product.fields.keyFeatures && Array.isArray(product.fields.keyFeatures)
            ? product.fields.keyFeatures.join('\n')
            : ''
    );
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Not logged in');
            })
            .then(data => {
                setUser(data.user);
                // Client-side ownership check
                if (data.user.role !== 'admin' && data.user.email !== product.fields.author) {
                    alert('You are not authorized to edit this product');
                    router.push('/dashboard');
                }
            })
            .catch(() => router.push('/login'));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Convert features from newline-separated string to array
        const featuresArray = features
            .split('\n')
            .map(f => f.trim())
            .filter(f => f.length > 0);

        try {
            const res = await fetch(`/api/posts/${product.sys.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    title,
                    description,
                    price: parseFloat(price) || 0,
                    features: featuresArray
                }),
            });

            if (res.ok) {
                router.push('/dashboard');
            } else {
                const data = await res.json();
                console.error('Update failed:', data);
                alert(data.error || data.message || 'Failed to update product');
            }
        } catch (error) {
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-semibold">Title *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-pink-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-semibold">Description *</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded h-32 focus:outline-none focus:border-pink-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-semibold">Price</label>
                    <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-pink-500"
                        placeholder="Enter price (e.g., 125000)"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-semibold">Features</label>
                    <textarea
                        value={features}
                        onChange={(e) => setFeatures(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded h-40 focus:outline-none focus:border-pink-500"
                        placeholder="Enter each feature on a new line&#10;Example:&#10;Engine: 5.0L V8&#10;Horsepower: 471 HP&#10;0-60: 4.4s"
                    />
                    <p className="text-sm text-gray-500 mt-1">Enter each feature on a new line</p>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-semibold">Author (Read-only)</label>
                    <input
                        type="text"
                        value={product.fields.author || 'Unknown'}
                        disabled
                        className="w-full p-3 border border-gray-300 rounded bg-gray-100 text-gray-600"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-pink-600 text-white px-6 py-3 rounded font-semibold hover:bg-pink-700 disabled:bg-pink-300 transition-colors"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard')}
                        className="bg-gray-500 text-white px-6 py-3 rounded font-semibold hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export async function getServerSideProps({ params, req }) {
    const { parseCookies } = require('../../../lib/cookies');
    const { verifyToken } = require('../../../lib/auth');

    const cookies = parseCookies(req);
    const token = cookies.token;

    if (!token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    const user = verifyToken(token);
    if (!user) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    const response = await client.getEntry(params.id);

    return {
        props: {
            product: response,
        },
    };
}
