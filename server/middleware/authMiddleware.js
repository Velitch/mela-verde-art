import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // Prendi il token dall'header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Accesso negato. Token mancante." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token non valido o scaduto." });
    }
};

// ESPORTO COME DEFAULT PER I MODULI ES
export default authMiddleware;