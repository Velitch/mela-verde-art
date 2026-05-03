import db from '../config/db.js';

// Aumenta il contatore di un evento (Pubblico)
export const incrementEventView = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('UPDATE events SET views = views + 1 WHERE id = ?', [id]);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Recupera i dati aggregati per la Dashboard (Admin)
export const getStats = async (req, res) => {
    try {
        // Query parallele per velocizzare la risposta
        const [totalEvents] = await db.execute('SELECT COUNT(*) as count FROM events');
        const [totalViews] = await db.execute('SELECT SUM(views) as count FROM events');
        const [upcoming] = await db.execute('SELECT COUNT(*) as count FROM events WHERE date >= CURDATE()');

        // Bonus: Prendi anche i 3 eventi più visti
        const [topEvents] = await db.execute('SELECT name, views FROM events ORDER BY views DESC LIMIT 3');

        res.json({
            totalEvents: totalEvents[0].count,
            totalViews: totalViews[0].count || 0,
            upcomingEvents: upcoming[0].count,
            topEvents: topEvents
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};