import Link from 'next/link';
import Image from 'next/image';

function ProductList({ products }) {
    if (!products || products.length === 0) {
        return <p>No products found.</p>;
    }

    return (
        <div className="products-grid">
            {products.map(product => {
                // FIX: Image comes as an array, get the first element
                const imageData = Array.isArray(product.fields.image)
                    ? product.fields.image[0]
                    : product.fields.image;

                // Check if it's actually an image file (not PDF, etc.)
                const isValidImage = imageData?.fields?.file?.contentType?.startsWith('image/');
                const hasImage = isValidImage && imageData?.fields?.file?.url;
                const imageUrl = hasImage ? `https:${imageData.fields.file.url}` : null;

                return (
                    <div key={product.sys.id} className="card product-card">
                        <Link href={`/products/${product.sys.id}`}>
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
                                <div style={{
                                    width: '100%',
                                    height: '220px',
                                    background: 'linear-gradient(135deg, #e1015d 0%, #e40195 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold'
                                }}>
                                    {product.fields.title}
                                </div>
                            )}
                            <div className="product-card-content">
                                <h3>{product.fields.title}</h3>
                                <p className="category">By {product.fields.author}</p>
                                <p className="specs">
                                    {product.fields.description.substring(0, 100)}
                                    {product.fields.description.length > 100 ? '...' : ''}
                                </p>
                                <button>View Details</button>
                            </div>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}

export default ProductList;