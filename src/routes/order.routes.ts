import { Router } from "express";
import { Order, OrderItem } from "../interfaces/basic";
import { OrderModel } from "../model/order.model";

const router = Router();
const orderModel = new OrderModel();

// Get all orders
router.get("/orders", async (req, res) => {
  try {
    const orders: Order[] = await orderModel.getAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Get order by ID
router.get("/orders/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const order: Order = await orderModel.getById(id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// Create a new order
router.post("/orders", async (req, res) => {
  try {
    const newOrder: Order = req.body.order;
    const items: OrderItem[] = req.body.items;
    const ids = await orderModel.create(newOrder, items);
    res.status(201).json({ id: ids[0] });
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Update an order
router.put("/orders/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updatedOrder: Order = req.body.order;
    const items: OrderItem[] = req.body.items;
    const count = await orderModel.update(id, updatedOrder, items);
    if (count) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update order" });
  }
});

// Delete an order
router.delete("/orders/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const count = await orderModel.delete(id);
    if (count) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete order" });
  }
});

export default router;
