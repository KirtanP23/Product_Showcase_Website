import Link from 'next/link';
import client from '../lib/contentful';
import ProductList from '@/components/ProductList';


export default function Home({ featuredProducts }) {
    return (
        <>
            <section className="card">
                <h1>Welcome to Elite Motors</h1>
                <p>Discover the world's most exclusive exotic and luxury vehicles.</p>
                <Link href="/products">
                    <button>Explore Our Collection</button>
                </Link>
            </section>

            <section className="card">
                <h2>Featured Products</h2>
                <ProductList products={featuredProducts} />
            </section>

            <section className="card">
                <h2>About Elite Motors</h2>
                <p>We specialize in curating the finest collection of products.</p>
            </section>
        </>
    );
}

export async function getStaticProps() {
    try {
        const response = await client.getEntries({
            content_type: 'product',
            limit: 3,
        });

        return {
            props: {
                featuredProducts: response.items,
            },
            revalidate: 60, // Revalidate every 60 seconds
        };
    } catch (error) {
        console.error('Error fetching products:', error);
        return {
            props: {
                featuredProducts: [],
            },
        };
    }
}