import express from 'express';
import path from 'path';
import itemRoutes from './routes/item.routes';
import categoryRoutes from './routes/category.routes';
import roomRoutes from './routes/room.routes';
import printerRoutes from './routes/printer.routes';
import orderRoutes from './routes/order.routes';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to serve static files from the "assets" directory
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Middleware to serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Use item routes
app.use('/api', itemRoutes);

// Use category routes
app.use('/api', categoryRoutes);

// Use room routes
app.use('/api', roomRoutes);

// Use printer routes
app.use('/api', printerRoutes);

// Use order routes
app.use('/api', orderRoutes);

export default app;