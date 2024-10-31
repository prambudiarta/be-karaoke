import { Router } from 'express';
import { User } from '../interfaces/basic';
import { UserModel } from '@/model/user.model';
import bcrypt from 'bcrypt';

const router = Router();
const userModel = new UserModel();

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users: User[] = await userModel.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Login
router.post('/users/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user: User = await userModel.getByUsername(username);
        
        if (user && await bcrypt.compare(password, user.password)) {
            res.json(user);
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const user: User = await userModel.getById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create a new user
router.post('/users', async (req, res) => {
  try {
    const newUser: User = req.body;
    const ids = await userModel.create(newUser);
    res.status(201).json({ id: ids[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update a user
router.put('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updatedUser: User = req.body;
    const count = await userModel.update(id, updatedUser);
    if (count) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const count = await userModel.delete(id);
    if (count) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;