import { Router } from "express";
import { RoomModel } from "../model/room.model";
import { Room } from "../interfaces/basic";

const router = Router();
const roomModel = new RoomModel();

// Get all rooms
router.get("/rooms", async (req, res) => {
  try {
    const rooms: Room[] = await roomModel.getAll();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

// Get room by ID
router.get("/rooms/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const room: Room = await roomModel.getById(id);
    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ error: "Room not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch room" });
  }
});

// Create a new room
router.post("/rooms", async (req, res) => {
  try {
    const newRoom: Room = req.body;
    const ids = await roomModel.create(newRoom);
    res.status(201).json({ id: ids[0] });
  } catch (error) {
    res.status(500).json({ error: "Failed to create room" });
  }
});

// Update a room
router.put("/rooms/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updatedRoom: Room = req.body;
    const count = await roomModel.update(id, updatedRoom);
    if (count) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Room not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update room" });
  }
});

// Delete a room
router.delete("/rooms/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const count = await roomModel.delete(id);
    if (count) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Room not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete room" });
  }
});

export default router;
