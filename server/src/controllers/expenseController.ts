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
        paidBy: {
          select: {
            username: true, // Include only the username from the User model
            password: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true, // Include the group name
          },
        },
      },
    });

    // Format the response to include only the desired fields
    const formattedExpenses = expenses.map((expense) => ({
      paidByUsername: expense.paidBy.username, // Add the full username to each expense
      password: expense.paidBy.password,
      groupId: expense.group.id, // Add the group ID
      groupName: expense.group.name, // Add the group name
      amountPaid: expense.amountPaid, // Add the amount paid
      paidFor: expense.paidFor, // Add the paid for field
    }));

    res.json(formattedExpenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
