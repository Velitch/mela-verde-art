import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    // ✅ Cambiato email in username (deve coincidere con quello che invia il frontend)
    const { username, password } = req.body;

    try {
        // ✅ Cambiata la query: cerchiamo per username
        const [rows] = await db.execute('SELECT * FROM admins WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Credenziali errate" });
        }

        const admin = rows[0];

        // Verifica password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Credenziali errate" });
        }

        // Generazione Token
        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ token, username: admin.username });
    } catch (err) {
        // Questo è il famoso errore 500 che vedevi prima!
        console.error("Login Error:", err);
        res.status(500).json({ error: err.message });
    }
};