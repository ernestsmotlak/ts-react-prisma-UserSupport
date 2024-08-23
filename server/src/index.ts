import express from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import expenseRoutes from './routes/expenseRoutes';

const app = express();
const port = 3012;

app.use(express.json());

app.use("/", authRoutes);
app.use("/", userRoutes);
app.use('/api', expenseRoutes);

app.get("/", (req, res) => {
  res.send("Hi!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
