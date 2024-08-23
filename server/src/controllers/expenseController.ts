import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getExpensesForUser = async (req: Request, res: Response) => {
  const { username } = req.params; // Username as a URL parameter

  try {
    const expenses = await prisma.expense.findMany({
      where: {
        paidBy: {
          username: username,
        },
      },
      include: {
        group: true,
        paidBy: true,
      },
    });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};
