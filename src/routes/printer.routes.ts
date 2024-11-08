import { Router } from 'express';
import { PrinterModel } from '../model/printer.model';
import { Printer } from '../interfaces/basic';

const router = Router();
const printerModel = new PrinterModel();

// Get all printers
router.get('/printers', async (req, res) => {
  try {
    const printers: Printer[] = await printerModel.getAll();
    res.json(printers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch printers' });
  }
});

// Get printer by ID
router.get('/printers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const printer: Printer = await printerModel.getById(id);
    if (printer) {
      res.json(printer);
    } else {
      res.status(404).json({ error: 'Printer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch printer' });
  }
});

// Create a new printer
router.post('/printers', async (req, res) => {
  try {
    const newPrinter: Printer = req.body;
    const ids = await printerModel.create(newPrinter);
    res.status(201).json({ id: ids[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create printer' });
  }
});

// Update a printer
router.put('/printers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updatedPrinter: Printer = req.body;
    const count = await printerModel.update(id, updatedPrinter);
    if (count) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Printer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update printer' });
  }
});

// Delete a printer
router.delete('/printers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const count = await printerModel.delete(id);
    if (count) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Printer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete printer' });
  }
});

export default router;