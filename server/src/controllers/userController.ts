import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Route to get user by ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params; // Extract the user ID from the URL parameters

  try {
    // Ensure the logged-in user can only access their own data
    if (req.user?.id !== Number(id)) {
      return res.status(403).json({
        message: "Access forbidden: You aren't authorized to view this data.",
      });
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
};
