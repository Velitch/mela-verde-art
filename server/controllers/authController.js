import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);        if (rows.length === 0) return res.status(401).json({ message: "Credenziali errate" });

        const admin = rows[0];
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message: "Credenziali errate" });

        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );
        res.json({ token, username: admin.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};