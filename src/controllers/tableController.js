const db = require('../config/db');

exports.getAllTables = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM tables');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTableById = async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await db.query('SELECT * FROM tables WHERE id = ?', [id]);
        res.json(results[0] || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createTable = async (req, res) => {
    const { table_number, restaurant_id } = req.body;
    if (!table_number || !restaurant_id) {
        return res.status(400).json({ error: 'Table number and restaurant ID are required' });
    }
    
    try {
        const [results] = await db.query(
            'INSERT INTO tables (table_number, restaurant_id) VALUES (?, ?)', 
            [table_number, restaurant_id]
        );
        res.json({ message: 'Table added successfully', id: results.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTable = async (req, res) => {
    const { id } = req.params;
    const { table_number, restaurant_id } = req.body;
    if (!table_number || !restaurant_id) {
        return res.status(400).json({ error: 'Table number and restaurant ID are required' });
    }

    try {
        await db.query(
            'UPDATE tables SET table_number = ?, restaurant_id = ? WHERE id = ?', 
            [table_number, restaurant_id, id]
        );
        res.json({ message: 'Table updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTable = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM tables WHERE id = ?', [id]);
        res.json({ message: 'Table deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
