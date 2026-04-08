import { signToken, setCookie } from '@/lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password } = req.body;

    // Hardcoded credentials for demo purposes
    // In a real app, you would check against a database
    if (email === 'admin@blog.com' && password === 'admin123') {
        const user = {
            email,
            role: 'admin',
            name: 'Admin User',
        };

        const token = signToken(user);

        setCookie(res, 'token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 1000, // 1 day
            sameSite: 'lax',
            path: '/',
        });

        return res.status(200).json({ user });
    }

    if (email === 'author@blog.com' && password === 'author123') {
        const user = {
            email,
            role: 'author',
            name: 'Author User',
        };

        const token = signToken(user);

        setCookie(res, 'token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 1000, // 1 day
            sameSite: 'lax',
            path: '/',
        });

        return res.status(200).json({ user });
    }

    if (email === 'viewer@gmail.com' && password === 'viewer123') {
        const user = {
            email,
            role: 'viewer',
            name: 'Viewer User',
        };

        const token = signToken(user);

        setCookie(res, 'token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 1000, // 1 day
            sameSite: 'lax',
            path: '/',
        });

        return res.status(200).json({ user });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
}
