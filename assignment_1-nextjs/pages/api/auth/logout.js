import { clearCookie } from '@/lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    clearCookie(res, 'token');

    return res.status(200).json({ message: 'Logged out successfully' });
}
