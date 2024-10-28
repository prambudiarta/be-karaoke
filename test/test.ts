import request from 'supertest';
import path from 'path';
import app from '../src/app';
import { Category } from '../src/interfaces/basic';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import db from '../src/database/db';

describe('Category Routes', () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.migrate.rollback();
    await db.destroy();
  });

  it('should create a new category with an image', async () => {
    const newCategory: Category = {
      category: 'New Category',
      imageUrl: '',
    };
    const response = await request(app)
      .post('/api/categories')
      .field('category', newCategory.category)
      .attach('image', path.resolve(__dirname, 'example.jpg'));
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should fetch all categories', async () => {
    const response = await request(app).get('/api/categories');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should fetch a category by ID', async () => {
    const response = await request(app).get('/api/categories/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });

  it('should update a category', async () => {
    const updatedCategory: Category = {
      category: 'Updated Category',
      imageUrl: 'http://example.com/image.jpg',
    };
    const response = await request(app)
      .put('/api/categories/1')
      .send(updatedCategory);
    expect(response.status).toBe(204);
  });

  it('should delete a category', async () => {
    const response = await request(app).delete('/api/categories/1');
    expect(response.status).toBe(204);
  });
});