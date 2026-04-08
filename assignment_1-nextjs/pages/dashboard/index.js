import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { client } from '@/lib/contentful';

export default function Dashboard({ products }) {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Simple client-side check, real protection is in middleware/API
        fetch('/api/auth/me')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Not logged in');
            })
            .then(data => setUser(data.user))
            .catch(() => router.push('/login'));
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        const res = await fetch(`/api/posts/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (res.ok) {
            router.reload();
        } else {
            alert('Failed to delete product');
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen text-xl text-gray-500">
                Loading...
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-10">
            {/* Top bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="mb-4 md:mb-0">
                    <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage your inventory and settings</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                        <span className="text-sm font-semibold text-gray-700">
                            👤 {user.name}{" "}
                            <span className="text-pink-600">({user.role})</span>
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-full font-semibold transition-all text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        Logout
                    </button>
                    <Link
                        href="/"
                        className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full font-semibold transition-all text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 no-underline"
                    >
                        View Site
                    </Link>
                </div>
            </div>

            {/* Product cards */}
            <div className="products-grid">
                {products.map((product) => {
                    const imageData = Array.isArray(product.fields.image)
                        ? product.fields.image[0]
                        : product.fields.image;

                    const isValidImage = imageData?.fields?.file?.contentType?.startsWith('image/');
                    const hasImage = isValidImage && imageData?.fields?.file?.url;
                    const imageUrl = hasImage ? `https:${imageData.fields.file.url}` : null;

                    return (
                        <div
                            key={product.sys.id}
                            className="card product-card"
                            style={{ cursor: 'default' }}
                        >
                            {/* Image header */}
                            {imageUrl ? (
                                <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                                    <Image
                                        src={imageUrl}
                                        alt={product.fields.title}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            ) : (
                                <div
                                    style={{
                                        width: '100%',
                                        height: '220px',
                                        background: 'linear-gradient(135deg, #e1015d 0%, #e40195 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {product.fields.title}
                                </div>
                            )}

                            <div className="product-card-content">
                                <h3>{product.fields.title}</h3>
                                <p className="category">
                                    By {product.fields.author || 'Unknown'}
                                </p>
                                <p className="specs">
                                    {product.fields.description?.substring(0, 100)}
                                    {product.fields.description?.length > 100 ? '...' : ''}
                                </p>

                                {/* EDIT + DELETE buttons */}
                                <div className="flex flex-col gap-3 mt-4">
                                    {(user.role === 'admin' || user.email === product.fields.author) && (
                                        <>
                                            <Link
                                                href={`/dashboard/edit/${product.sys.id}`}
                                                className="uppercase w-full bg-pink-600 text-white px-6 py-3 rounded font-bold hover:bg-pink-700 transition-colors shadow-md tracking-wider text-center block"
                                                style={{ textDecoration: 'none' }}
                                            >
                                                EDIT
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(product.sys.id)}
                                                className="uppercase w-full bg-pink-500 text-white px-6 py-3 rounded font-bold hover:bg-pink-700 transition-colors shadow-md tracking-wider"
                                            >
                                                DELETE
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {products.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 text-xl font-semibold">
                            No products found
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    const { req } = context;
    const { parseCookies } = require('../../lib/cookies');
    const { verifyToken } = require('../../lib/auth');

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

    if (user.role === 'viewer') {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const response = await client.getEntries({ content_type: 'product' });

    return {
        props: {
            products: response.items,
        },
    };
}
