import { client, managementClient } from '@/lib/contentful';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const userEmail = req.headers['x-user-email'];
        const userRole = req.headers['x-user-role'];

        if (!userEmail) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { title, description, image } = req.body;

        try {
            const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
            const environment = await space.getEnvironment('master');

            const entry = await environment.createEntry('product', {
                fields: {
                    title: { 'en-US': title },
                    description: { 'en-US': description },
                    author: { 'en-US': userEmail },
                    // Image handling would require asset upload first, skipping for simplicity in this demo unless requested
                },
            });

            // Auto-publish for simplicity
            await entry.publish();

            return res.status(201).json(entry);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error creating product' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
