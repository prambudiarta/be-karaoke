import { Router } from 'express';
import { ItemModel } from '../model/item.model';
import { Item } from '../interfaces/basic';
import upload from '../config/multer';
import fs from 'fs';
import path from 'path';

const router = Router();
const itemModel = new ItemModel();

// Get all items
router.get('/items', async (req, res) => {
  try {
    const items: Item[] = await itemModel.getAll();
    res.json(items);
  } catch (error) {
    console.log('error : ', error);
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
    const file: Express.Multer.File = req.file;

    const uploadsDir = path.join(__dirname, '../../uploads/items');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    if (file) {
      newItem.imageUrl = `/uploads/items/${file.filename}`;
    }

    const ids = await itemModel.create(newItem);
    res.status(201).json({ id: ids[0] });
  } catch (error) {
    console.log('error : ', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Update an item
router.put('/items/:id', upload.single('image'), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updatedItem: Item = req.body;
    const file: Express.Multer.File = req.file;

    const uploadsDir = path.join(__dirname, '../../uploads/items');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Fetch existing item to get current imageUrl
    const existingItem = await itemModel.getById(id);
    if (!existingItem) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    // If there's a new file, update imageUrl, and delete the old image if it exists
    if (file) {
      // Set new imageUrl
      updatedItem.imageUrl = `/uploads/items/${file.filename}`;

      // Delete the old image if it exists
      if (existingItem.imageUrl) {
        const oldImagePath = path.join(__dirname, '../../', existingItem.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);  // Delete old image
        }
      }
    } else {
      // Retain the existing image URL if no new file is uploaded
      updatedItem.imageUrl = existingItem.imageUrl;
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