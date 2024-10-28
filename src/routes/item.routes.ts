import { Router, Request } from 'express';
import multer from 'multer';
import path from 'path';
import { ItemModel } from '../model/item.model';
import { Item } from '../interfaces/basic';

const router = Router();
const itemModel = new ItemModel();

const upload = multer({ dest: 'uploads/' });

// Get all items
router.get('/items', async (req, res) => {
  try {
    const items: Item[] = await itemModel.getAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get item by ID
router.get('/items/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const item: Item = await itemModel.getById(id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Create a new item
router.post('/items', upload.single('image'), async (req, res) => {
  try {
    const newItem: Item = req.body;
    if (req.file) {
      newItem.imageUrl = `/uploads/item/${req.file.filename}`;
    }
    const ids = await itemModel.create(newItem);
    res.status(201).json({ id: ids[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Update an item
router.put('/items/:id', upload.single('image'), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updatedItem: Item = req.body;
    if (req.file) {
      updatedItem.imageUrl = `/assets/item/${req.file.filename}`;
    }
    const count = await itemModel.update(id, updatedItem);
    if (count) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete an item
router.delete('/items/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const count = await itemModel.delete(id);
    if (count) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

export default router;