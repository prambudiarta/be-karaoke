import { Router } from 'express';
import { CategoryModel } from '../model/category.model';
import { Category } from '../interfaces/basic';
import upload from '../config/multer';

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
    if (req.file) {
      newCategory.imageUrl = `/uploads/categories/${req.file.filename}`;
    }
    const ids = await categoryModel.create(newCategory);
    res.status(201).json({ id: ids[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update a category
router.put('/categories/:id', upload.single('image'), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updatedCategory: Category = req.body;
    if (req.file) {
      updatedCategory.imageUrl = `/uploads/categories/${req.file.filename}`;
    }
    const count = await categoryModel.update(id, updatedCategory);
    if (count) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
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