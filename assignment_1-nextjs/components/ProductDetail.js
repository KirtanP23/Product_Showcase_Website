import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

function ProductDetail({ product }) {
    const router = useRouter();

    if (!product) {
        return (
            <section className="card">
                <h2>Product Not Found</h2>
                <p>The product you're looking for doesn't exist.</p>
                <Link href="/products">
                    <button>Back to Products</button>
                </Link>
            </section>
        );
    }

    // Debugging — check what Contentful actually returned
    console.log('Product fields:', product.fields);
    console.log('KeyFeatures:', product.fields.keyFeatures);
    console.log('KeyFeatures type:', typeof product.fields.keyFeatures);

    // Handle image (comes as array)
    const imageData = Array.isArray(product.fields.image)
        ? product.fields.image[0]
        : product.fields.image;

    const isValidImage = imageData?.fields?.file?.contentType?.startsWith('image/');
    const hasImage = isValidImage && imageData?.fields?.file?.url;
    const imageUrl = hasImage ? `https:${imageData.fields.file.url}` : null;

    // --- Handle Features field ---
    let featuresArray = [];

    if (product.fields.keyFeatures) {
        if (typeof product.fields.keyFeatures === 'string') {
            // If it's a string, split by newlines
            featuresArray = product.fields.keyFeatures
                .split(/\r?\n+/)
                .map(line => line.trim())
                .filter(line => line !== '');
        } else if (Array.isArray(product.fields.keyFeatures)) {
            // If it's already an array, use it directly
            featuresArray = product.fields.keyFeatures
                .map(item => typeof item === 'string' ? item.trim() : String(item))
                .filter(item => item !== '');
        } else if (typeof product.fields.keyFeatures === 'object') {
            // If it's an object, try to get a text property
            featuresArray = [JSON.stringify(product.fields.keyFeatures)];
        }
    }

    console.log('Parsed features:', featuresArray);

    return (
        <section className="card">
            <div className="car-detail">
                <div>
                    {imageUrl ? (
                        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
                            <Image
                                src={imageUrl}
                                alt={product.fields.title}
                                fill
                                style={{ objectFit: 'cover', borderRadius: '8px' }}
                            />
                        </div>
                    ) : (
                        <div
                            style={{
                                width: '100%',
                                height: '400px',
                                background: 'linear-gradient(135deg, #e1015d 0%, #e40195 100%)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '1.5rem',
                                fontWeight: 'bold'
                            }}
                        >
                            {product.fields.title}
                        </div>
                    )}
                </div>

                <div className="car-detail-info">
                    <h1>{product.fields.title}</h1>
                    <p className="car-detail-category">By {product.fields.author}</p>

                    {product.fields.price && (
                        <p className="car-detail-price">
                            ${product.fields.price.toLocaleString()}
                        </p>
                    )}

                    <p>{product.fields.description}</p>

                    {/* Display Features */}
                    {featuresArray.length > 0 ? (
                        <div className="car-detail-specs">
                            <h3>Features & Specifications</h3>
                            <ul className="car-detail-spec-list">
                                {featuresArray.map((feature, index) => {
                                    const parts = feature.split(':');
                                    if (parts.length >= 2) {
                                        return (
                                            <li key={index}>
                                                <span className="spec-label">{parts[0].trim()}</span>
                                                <span className="spec-value">{parts.slice(1).join(':').trim()}</span>
                                            </li>
                                        );
                                    } else {
                                        return (
                                            <li key={index}>
                                                <span className="spec-value">{feature}</span>
                                            </li>
                                        );
                                    }
                                })}
                            </ul>
                        </div>
                    ) : (
                        <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                            No features listed for this product.
                        </p>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button onClick={() => router.push('/products')}>
                            Back to Products
                        </button>
                        <Link href="/">
                            <button>Go Home</button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProductDetail;