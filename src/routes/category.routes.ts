import { Router } from 'express';
import { CategoryModel } from '../model/category.model';
import { Category } from '../interfaces/basic';
import upload from '../config/multer';
import fs from 'fs';
import path from 'path';

const router = Router();
const categoryModel = new CategoryModel();

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories: Category[] = await categoryModel.getAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get category by ID
router.get('/categories/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const category: Category = await categoryModel.getById(id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Create a new category
router.post('/categories', upload.single('image'), async (req, res) => {
  try {
    const newCategory: Category = req.body;
    const file: Express.Multer.File = req.file;

    const uploadsDir = path.join(__dirname, '../../uploads/categories');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    if (file) {
      newCategory.imageUrl = `/uploads/categories/${req.file.filename}`;
    }
    const ids = await categoryModel.create(newCategory);
    res.status(201).json({ id: ids[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update a category
// Update a category
router.put('/categories/:id', upload.single('image'), async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const updatedCategory: Category = req.body;
    const file: Express.Multer.File = req.file;

    const uploadsDir = path.join(__dirname, '../../uploads/categories');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Fetch existing category to get current imageUrl
    const existingCategory = await categoryModel.getById(id);
    if (!existingCategory) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    // If there's a new file, update imageUrl, and delete the old image if it exists
    if (file) {
      // Set new imageUrl
      updatedCategory.imageUrl = `/uploads/categories/${file.filename}`;

      // Delete the old image if it exists
      if (existingCategory.imageUrl) {
        const oldImagePath = path.join(__dirname, '../../', existingCategory.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);  // Delete old image
        }
      }
    } else {
      // Retain the existing image URL if no new file is uploaded
      updatedCategory.imageUrl = existingCategory.imageUrl;
    }

    // Update the category in the database
    const count = await categoryModel.update(id, updatedCategory);
    if (count) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});


// Delete a category
router.delete('/categories/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const count = await categoryModel.delete(id);
    if (count) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;