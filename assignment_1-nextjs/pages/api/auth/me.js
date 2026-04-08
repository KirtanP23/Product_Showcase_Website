import { verifyToken } from '@/lib/auth';
import { parseCookies } from '@/lib/cookies';

export default function handler(req, res) {
    const cookies = parseCookies(req);
    const token = cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Not logged in' });
    }

    const user = verifyToken(token);

    if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    return res.status(200).json({ user });
}
