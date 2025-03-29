import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;
const authServiceUrl = process.env.AUTH_SERVICE_URL;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// MongoDB Connection
let db;
async function connectToMongo() {
  try {
    const client = await MongoClient.connect(mongoUri);
    db = client.db("crypto_hunter");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}
connectToMongo();

// Middleware to verify token
async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split("Bearer ")[1];
  console.log("Token:", token);
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const response = await axios.get(`${authServiceUrl}/auth/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    req.user = response.data; // { id, email, first_name, last_name }
    next();
  } catch (error) {
    console.error("Token verification failed:", error.response?.data || error.message);
    res.status(401).json({ error: "Invalid token" });
  }
}

// POST /api/transactions
app.post("/api/transactions", verifyToken, async (req, res) => {
  const { description, amount, category, type } = req.body;
  const userId = req.user.id;

  if (!description || !amount || !category || !type) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const transaction = {
    user_id: userId,
    description,
    amount,
    category,
    type,
    created_at: new Date().toISOString(),
  };

  try {
    const result = await db.collection("transactions").insertOne(transaction);
    res.status(201).json({ message: "Transaction saved", id: result.insertedId });
  } catch (error) {
    console.error("Error saving transaction:", error);
    res.status(500).json({ error: "Failed to save transaction" });
  }
});

// GET /api/transactions
app.get("/api/transactions", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const transactions = await db.collection("transactions")
      .find({ user_id: userId })
      .toArray();
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// GET /api/transactions/:id
app.get("/api/transactions/:id", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const transactionId = req.params.id;

  try {
    const transaction = await db.collection("transactions").findOne({
      _id: new ObjectId(transactionId),
      user_id: userId,
    });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
});

// PUT /api/transactions/:id
app.put("/api/transactions/:id", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const transactionId = req.params.id;
  const { description, amount, category, type } = req.body;

  if (!description || !amount || !category || !type) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await db.collection("transactions").updateOne(
      { _id: new ObjectId(transactionId), user_id: userId },
      { $set: { description, amount, category, type, updated_at: new Date().toISOString() } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction updated" });
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ error: "Failed to update transaction" });
  }
});

app.listen(port, () => {
  console.log(`Transaction service running on http://localhost:${port}`);
});