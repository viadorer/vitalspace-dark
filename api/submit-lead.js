export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const API_URL = 'https://api-production-88cf.up.railway.app/api/v1/public/api-leads/submit';
    const API_KEY = process.env.REALVISOR_API_KEY;

    if (!API_KEY) {
        console.error('REALVISOR_API_KEY env variable is not set');
        return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        return res.status(response.status).json(data);
    } catch (err) {
        console.error('Realvisor proxy error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
