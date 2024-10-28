import request from 'supertest';
import path from 'path';
import app from '../src/app';
import { Item, Category, Room, Printer, Order, OrderItem } from '../src/interfaces/basic';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import db from '../src/database/db';

describe('API Routes', () => {
  beforeAll(async () => {
    // Run migrations to set up the database schema
    await db.migrate.latest();
  });

  afterAll(async () => {
    // Rollback migrations and close the database connection
    await db.migrate.rollback();
    await db.destroy();
  });

  beforeEach(async () => {
    // Clear existing data and seed the database with initial data before each test
    await db('items').del();
    await db('categories').del();
    await db('rooms').del();
    await db('printers').del();
    await db('order_item').del();
    await db('order').del();

    await db('categories').insert([
      { id: 1, category: 'Category 1', imageUrl: 'http://example.com/image1.jpg' },
      { id: 2, category: 'Category 2', imageUrl: 'http://example.com/image2.jpg' },
    ]);

    await db('items').insert([
      { id: 1, category_id: 1, imageUrl: 'http://example.com/image1.jpg', name: 'Item 1', price: 10 },
      { id: 2, category_id: 1, imageUrl: 'http://example.com/image2.jpg', name: 'Item 2', price: 20 },
    ]);

    await db('rooms').insert([
      { id: 1, description: 'Room 1', price: 100, isAvailable: true },
      { id: 2, description: 'Room 2', price: 200, isAvailable: false },
    ]);

    await db('printers').insert([
      { id: 1, description: 'Printer 1', ip: '192.168.1.1' },
      { id: 2, description: 'Printer 2', ip: '192.168.1.2' },
    ]);

    await db('order').insert([
      { order_id: 1, room_id: 1, duration_hours: 2, start_time: new Date(), end_time: new Date(), room_rate: 100, room_total_price: 200, grand_total_price: 220, status: 'ongoing' },
    ]);

    await db('order_item').insert([
      { id: 1, order_id: 1, item_id: 1, quantity: 2, price: 10, total_price: 20 },
      { id: 2, order_id: 1, item_id: 2, quantity: 1, price: 20, total_price: 20 },
    ]);
  });

  // Test categories
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

  // Test items
  it('should create a new item', async () => {
    const newItem: Item = {
      category_id: 1,
      imageUrl: 'http://example.com/image.jpg',
      name: 'New Item',
      price: 12,
    };
    const response = await request(app).post('/api/items').send(newItem);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should fetch all items', async () => {
    const response = await request(app).get('/api/items');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should fetch an item by ID', async () => {
    const response = await request(app).get('/api/items/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });

  it('should update an item', async () => {
    const updatedItem: Item = {
      category_id: 1,
      imageUrl: 'http://example.com/image.jpg',
      name: 'Updated Item',
      price: 12.99,
    };
    const response = await request(app).put('/api/items/1').send(updatedItem);
    expect(response.status).toBe(204);
  });

  it('should delete an item', async () => {
    const response = await request(app).delete('/api/items/1');
    expect(response.status).toBe(204);
  });

  // Test rooms
  it('should create a new room', async () => {
    const newRoom: Room = {
      description: 'New Room',
      price: 150,
      isAvailable: true,
    };
    const response = await request(app).post('/api/rooms').send(newRoom);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should fetch all rooms', async () => {
    const response = await request(app).get('/api/rooms');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should fetch a room by ID', async () => {
    const response = await request(app).get('/api/rooms/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });

  it('should update a room', async () => {
    const updatedRoom: Room = {
      description: 'Updated Room',
      price: 180,
      isAvailable: false,
    };
    const response = await request(app).put('/api/rooms/1').send(updatedRoom);
    expect(response.status).toBe(204);
  });

  it('should delete a room', async () => {
    const response = await request(app).delete('/api/rooms/1');
    expect(response.status).toBe(204);
  });

  // Test printers
  it('should create a new printer', async () => {
    const newPrinter: Printer = {
      description: 'New Printer',
      ip: '192.168.1.3',
    };
    const response = await request(app).post('/api/printers').send(newPrinter);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should fetch all printers', async () => {
    const response = await request(app).get('/api/printers');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should fetch a printer by ID', async () => {
    const response = await request(app).get('/api/printers/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });

  it('should update a printer', async () => {
    const updatedPrinter: Printer = {
      description: 'Updated Printer',
      ip: '192.168.1.4',
    };
    const response = await request(app).put('/api/printers/1').send(updatedPrinter);
    expect(response.status).toBe(204);
  });

  it('should delete a printer', async () => {
    const response = await request(app).delete('/api/printers/1');
    expect(response.status).toBe(204);
  });

  // Test orders
  it('should create a new order with items', async () => {
    const newOrder: Order = {
      room_id: 1,
      duration_hours: 3,
      start_time: new Date(),
      end_time: new Date(),
      room_rate: 100,
      room_total_price: 300,
      grand_total_price: 330,
      status: 'ongoing',
    };
    const items: OrderItem[] = [
      {
        item_id: 1, quantity: 2, price: 10, total_price: 20,
        order_id: 0
      },
      {
        item_id: 2, quantity: 1, price: 20, total_price: 20,
        order_id: 0
      },
    ];
    const response = await request(app).post('/api/orders').send({ order: newOrder, items });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should fetch all orders', async () => {
    const response = await request(app).get('/api/orders');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should fetch an order by ID', async () => {
    const response = await request(app).get('/api/orders/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('order_id', 1);
  });

  it('should update an order with items', async () => {
    const updatedOrder: Order = {
      room_id: 1,
      duration_hours: 4,
      start_time: new Date(),
      end_time: new Date(),
      room_rate: 100,
      room_total_price: 400,
      grand_total_price: 440,
      status: 'ongoing',
    };
    const items: OrderItem[] = [
      {
        item_id: 1, quantity: 3, price: 10, total_price: 30,
        order_id: 0
      },
      {
        item_id: 2, quantity: 2, price: 20, total_price: 40,
        order_id: 0
      },
    ];
    const response = await request(app).put('/api/orders/1').send({ order: updatedOrder, items });
    expect(response.status).toBe(204);
  });

  it('should delete an order', async () => {
    const response = await request(app).delete('/api/orders/1');
    expect(response.status).toBe(204);
  });
});