import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import axios from "axios";
import dotenv from "dotenv";
import promClient from "prom-client";

dotenv.config();

const app = express();
// Disable X-Powered-By header to prevent version disclosure
app.disable("x-powered-by");

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;
const authServiceUrl = process.env.AUTH_SERVICE_URL;

// Validate environment variables
if (!mongoUri || !authServiceUrl) {
  console.error("Missing required environment variables: MONGO_URI and AUTH_SERVICE_URL");
  process.exit(1);
}

// Enable Prometheus metrics collection
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const httpRequestDuration = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
});

const totalRequests = new promClient.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

const errorCounter = new promClient.Counter({
  name: "http_errors_total",
  help: "Total number of HTTP errors",
  labelNames: ["method", "route", "status"],
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
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

// Middleware to measure request duration
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on("finish", () => {
    const status = res.statusCode.toString();
    end({ method: req.method, route: req.path, status });
    totalRequests.inc({ method: req.method, route: req.path, status });
    if (res.statusCode >= 400) {
      errorCounter.inc({ method: req.method, route: req.path, status });
    }
  });
  next();
});

// Middleware to verify token
async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const response = await axios.get(`${authServiceUrl}/auth/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    req.user = response.data;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.response?.data || error.message);
    res.status(401).json({ error: "Invalid token" });
  }
}

// Expose metrics endpoint for Prometheus
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

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
    // Validate transactionId as a valid ObjectId string
    if (!ObjectId.isValid(transactionId)) {
      return res.status(400).json({ error: "Invalid transaction ID" });
    }

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
  const transactionId = req.id;
  const { description, amount, category, type } = req.body;

  if (!description || !amount || !category || !type) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Validate transactionId as a valid ObjectId string
    if (!ObjectId.isValid(transactionId)) {
      return res.status(400).json({ error: "Invalid transaction ID" });
    }

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