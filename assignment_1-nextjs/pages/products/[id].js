import client from '../../lib/contentful';
import ProductDetail from '../../components/ProductDetail';

export default function ProductPage({ product }) {
    return <ProductDetail product={product} />;
}

export async function getStaticPaths() {
    try {
        const response = await client.getEntries({
            content_type: 'product',
        });

        const paths = response.items.map(item => ({
            params: { id: item.sys.id },
        }));

        return {
            paths,
            fallback: false,
        };
    } catch (error) {
        console.error('Error fetching paths:', error);
        return {
            paths: [],
            fallback: false,
        };
    }
}

export async function getStaticProps({ params }) {
    try {
        const response = await client.getEntry(params.id, {
            include: 10, // Increase from 2 to 10 to get all nested content
        });

        // DEBUG: Log to terminal to see what we get
        console.log('=== PRODUCT DATA FROM CONTENTFUL ===');
        console.log('Entry ID:', response.sys.id);
        console.log('Fields:', Object.keys(response.fields));
        console.log('Full fields:', JSON.stringify(response.fields, null, 2));
        console.log('===================================');

        return {
            props: {
                product: response,
            },
            revalidate: 60,
        };
    } catch (error) {
        console.error('Error fetching product:', error);
        return {
            props: {
                product: null,
            },
        };
    }
}