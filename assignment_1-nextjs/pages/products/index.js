import { useState } from 'react';
import client from '../../lib/contentful';
import ProductList from '../../components/ProductList';
import Link from 'next/link';

export default function Products({ products, total, currentPage, totalPages }) {
    return (
        <section className="card">
            <h1>All Products</h1>
            <p>Browse our complete collection. Showing {products.length} of {total} products.</p>

            <ProductList products={products} />

            {/* Pagination */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                {currentPage > 1 && (
                    <Link href={`/products?page=${currentPage - 1}`}>
                        <button>Previous Page</button>
                    </Link>
                )}

                <span style={{ padding: '1rem' }}>
                    Page {currentPage} of {totalPages}
                </span>

                {currentPage < totalPages && (
                    <Link href={`/products?page=${currentPage + 1}`}>
                        <button>Next Page</button>
                    </Link>
                )}
            </div>
        </section>
    );
}

export async function getServerSideProps({ query }) {
    const page = parseInt(query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    try {
        const response = await client.getEntries({
            content_type: 'product',
            limit: limit,
            skip: skip,
        });

        const totalPages = Math.ceil(response.total / limit);

        return {
            props: {
                products: response.items,
                total: response.total,
                currentPage: page,
                totalPages: totalPages,
            },
        };
    } catch (error) {
        console.error('Error fetching products:', error);
        return {
            props: {
                products: [],
                total: 0,
                currentPage: 1,
                totalPages: 1,
            },
        };
    }
}