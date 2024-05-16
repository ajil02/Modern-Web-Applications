const express = require('express');
const router = express.Router();
const Item = require('C:\Users\student\Desktop\Ajil\exp9\inventory-system\models\Item.js');

// Create new inventory item
router.post('/', async (req, res) => {
    const { name, quantity } = req.body;

    try {
        const newItem = new Item({ name, quantity });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Retrieve all inventory items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an inventory item
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, quantity } = req.body;

    try {
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (name) item.name = name;
        if (quantity) item.quantity = quantity;

        await item.save();
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an inventory item
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const item = await Item.findByIdAndDelete(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
