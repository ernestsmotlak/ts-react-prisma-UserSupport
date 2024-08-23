import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { authenticateToken } from "./middleware/authMiddleware";

const app = express();
const prisma = new PrismaClient();
const port = 3012;

const JWT_SECRET = "burek";

app.use(express.json());

// Route to handle user login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // Fetch user from the database
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/", async (req, res) => {
  res.send("Hi!");
});

// app.get("/users", authenticateToken, async (req, res) => {
//   const {username} = req.body;
//   try {
//     // Ensure req.user is correctly typed
//     const user = await prisma.user.findUnique({ where: {username}});
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: "An error occurred" });
//   }
// });

// app.get("/users/:id", authenticateToken, async (req, res) => {
//   const { id } = req.params; // Extract the user ID from the URL parameters

//   try {
//     // Ensure the logged-in user cannot access other users' data if their id is 1
//     if (req.user?.id === 1 && req.user.id !== Number(id)) {
//       return res.status(403).json({
//         message: "Access forbidden: You cannot view other users' data.",
//       });
//     }

//     // Find the user by ID
//     const user = await prisma.user.findUnique({ where: { id: Number(id) } });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: "An error occurred" });
//   }
// });

app.get("/users/:id", authenticateToken, async (req, res) => {
  const { id } = req.params; // Extract the user ID from the URL parameters

  try {
    // Ensure the logged-in user can only access their own data
    if (req.user?.id !== Number(id)) {
      return res.status(403).json({ message: "Access forbidden: You can only view your own data." });
    }

    // Find the user by ID
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
