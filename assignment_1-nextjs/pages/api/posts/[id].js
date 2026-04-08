import { client, managementClient } from '@/lib/contentful';
import { parseCookies } from '@/lib/cookies';
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
    const { id } = req.query;

    // Authenticate user
    const cookies = parseCookies(req);
    const token = cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token' });
    }

    const user = verifyToken(token);
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }


    const userEmail = user.email;
    const userRole = user.role;

    if (req.method === 'PUT') {
        try {
            const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
            const environment = await space.getEnvironment('master');
            const entry = await environment.getEntry(id);

            const author = entry.fields.author?.['en-US'];

            // Ownership check: Admin can edit all, Author can only edit own
            if (userRole !== 'admin' && author !== userEmail) {
                return res.status(403).json({ message: 'Forbidden: You do not own this product' });
            }

            const { title, description, price, features } = req.body;

            // Update all editable fields
            entry.fields.title['en-US'] = title;
            entry.fields.description['en-US'] = description;

            // Update price if provided
            if (price !== undefined && price !== null) {
                entry.fields.price = entry.fields.price || {};
                entry.fields.price['en-US'] = parseFloat(price);
            }

            // Update keyFeatures if provided
            if (features && Array.isArray(features)) {
                entry.fields.keyFeatures = entry.fields.keyFeatures || {};
                entry.fields.keyFeatures['en-US'] = features;
            }

            const updatedEntry = await entry.update();
            await updatedEntry.publish();

            return res.status(200).json(updatedEntry);
        } catch (error) {
            console.error('Error updating product:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            console.error('Error message:', error.message);
            return res.status(500).json({
                message: 'Error updating product',
                error: error.message,
                details: error.details || null
            });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
            const environment = await space.getEnvironment('master');
            const entry = await environment.getEntry(id);

            const author = entry.fields.author?.['en-US'];

            // Ownership check: Admin can delete all, Author can only delete own
            if (userRole !== 'admin' && author !== userEmail) {
                return res.status(403).json({ message: 'Forbidden: You do not own this product' });
            }

            await entry.unpublish();
            await entry.delete();

            return res.status(200).json({ message: 'Product deleted' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error deleting product' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
