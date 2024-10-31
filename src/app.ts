import express from "express";
import path from "path";
import cors from "cors";
import itemRoutes from "./routes/item.routes";
import categoryRoutes from "./routes/category.routes";
import roomRoutes from "./routes/room.routes";
import printerRoutes from "./routes/printer.routes";
import orderRoutes from "./routes/order.routes";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        // Allow requests with no origin (like mobile apps or curl requests)
        callback(null, true);
      } else {
        // Allow all origins
        callback(null, origin);
      }
    },
    credentials: true, // Reflect the request's origin and allow credentials
  })
);

// Middleware to parse JSON bodies
app.use(express.json());

app.use(express.urlencoded({ extended: true })); 

// Middleware to serve static files from the "assets" directory
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// Middleware to serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Use item routes
app.use("/api", itemRoutes);

// Use category routes
app.use("/api", categoryRoutes);

// Use room routes
app.use("/api", roomRoutes);

// Use printer routes
app.use("/api", printerRoutes);

// Use order routes
app.use("/api", orderRoutes);

// Use user routes
app.use("/api", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`🚀 App listening on the port ${PORT}`);
    console.log(`=================================`);
});

export default app;
