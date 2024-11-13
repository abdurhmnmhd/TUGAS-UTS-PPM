import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import dotenv from "dotenv";

const cors = require("cors");
const db = require("../connection/connection");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Middleware autentikasi
const isAuth: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader === "kanjut") {
    next();
  } else {
    res.status(401).json({ msg: "Unauthorized access" });
  }
};

// CREATE event
app.post("/events", (req: Request, res: Response) => {
  const { eventName, eventPrice, description, status } = req.body;

  db.query(
    "INSERT INTO events (eventName, eventPrice, description, status) VALUES (?, ?, ?, ?)",
    [eventName, eventPrice, description, status],
    (error: Error | null, result: any) => {
      if (error) {
        console.error("Database insertion error:", error);
        return res.status(500).json({ error: "Database insertion error" });
      }
      const newEvent = {
        id: result.insertId,
        eventName,
        eventPrice,
        description,
        status,
      };
      res.status(201).json(newEvent);
    }
  );
});

// READ all events
app.get("/events", (req: Request, res: Response) => {
  db.query("SELECT * FROM events", (error: Error | null, result: any) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ error: "Database query error" });
    }
    res.status(200).json(result);
  });
});

// UPDATE event by id
app.put("/events/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { eventName, eventPrice, description, status } = req.body;

  db.query(
    "UPDATE events SET eventName = ?, eventPrice = ?, description = ?, status = ? WHERE id = ?",
    [eventName, eventPrice, description, status, id],
    (error: Error | null, result: any) => {
      if (error) {
        console.error("Database update error:", error);
        return res.status(500).json({ error: "Database update error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(200).json({ msg: "Event updated successfully" });
    }
  );
});

// DELETE event by id
app.delete("/events/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  db.query(
    "DELETE FROM events WHERE id = ?",
    [id],
    (error: Error | null, result: any) => {
      if (error) {
        console.error("Database deletion error:", error);
        return res.status(500).json({ error: "Database deletion error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(200).json({ msg: "Event deleted successfully" });
    }
  );
});

// GET event by id
app.get("/events/:id", isAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  db.query(
    "SELECT * FROM events WHERE id = ?",
    [id],
    (error: Error | null, result: any) => {
      if (error) {
        console.error("Database query error:", error);
        return res.status(500).json({ error: "Database query error" });
      }
      if (result.length === 0) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(200).json(result[0]);
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
