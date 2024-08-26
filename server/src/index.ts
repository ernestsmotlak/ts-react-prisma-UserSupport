import express from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import groupRoutes from "./routes/groupRoutes";

const app = express();
const port = 3012;

app.use(express.json());

app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/api", expenseRoutes);
app.use("/group", groupRoutes);

app.get("/", (req, res) => {
  res.send("Hi!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
