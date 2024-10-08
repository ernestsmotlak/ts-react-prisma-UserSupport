import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { group } from "console";

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

export const addExpense = async (req: Request, res: Response) => {
  const { userId } = req.params; // Get userId from URL parameters
  const { groupId, amountPaid, paidFor, expenseName } = req.body; // Get other data from request body

  console.log("userId:", userId);
  console.log("groupId:", groupId);
  console.log("amountPaid:", amountPaid);
  console.log("paidFor:", paidFor);
  console.log("expenseName:", expenseName);

  try {
    // Convert the values to the correct types
    const groupIdInt = parseInt(groupId, 10);
    const userIdInt = parseInt(userId, 10);
    const amountPaidFloat = parseFloat(amountPaid);

    // Check if the conversions are successful and if expenseName is provided
    if (
      isNaN(groupIdInt) ||
      isNaN(userIdInt) ||
      isNaN(amountPaidFloat) ||
      !expenseName ||
      expenseName.trim() === ""
    ) {
      return res
        .status(400)
        .json({ error: "Invalid input data or missing expenseName" });
    }

    // Create a new expense linked to the userId from params
    const newExpense = await prisma.expense.create({
      data: {
        groupId: groupIdInt,
        paidById: userIdInt,
        amountPaid: amountPaidFloat,
        paidFor: paidFor,
        expenseName: expenseName, // Explicitly require this field
      },
    });

    res.status(201).json(newExpense); // Respond with the created expense
  } catch (error) {
    console.error("Error adding expense:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the expense" });
  }
};


// this one will most likely be useless, DELETE ME!!!
export const updateExpense = async (req: Request, res: Response) => {
  const { expenseId } = req.params; // Get expenseId from URL parameters
  const { amountPaid } = req.body; // Get amountPaid from the request body

  try {
    // Convert and validate input
    const idOfExpense = Number(expenseId);
    const paidAmount = parseFloat(amountPaid);

    // Validate input data
    if (isNaN(idOfExpense) || isNaN(paidAmount)) {
      return res.status(400).json({ error: "Invalid input data!" });
    }

    // Update Expense record
    const expenseUpdate = await prisma.expense.update({
      where: { id: idOfExpense },
      data: {
        amountPaid: paidAmount, // Update the amountPaid field
      },
    });

    // Respond with the updated expense
    res.status(200).json({ expenseUpdate });
  } catch (error) {
    console.error("Error updating expense!", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the expense!" });
  }
};

export const updateExpense2 = async (req: Request, res: Response) => {
  const { expenseId } = req.params;
  const { groupId, paidById, amountPaid, paidFor, expenseName } = req.body;

  try {
    const expenseId2 = Number(expenseId);
    const groupId2 = Number(groupId);
    const paidById2 = Number(paidById);
    const amountPaid2 = parseFloat(amountPaid);

    if (isNaN(groupId2) || isNaN(paidById2) || isNaN(amountPaid2)) {
      return res.status(400).json({ error: "Error in data!" });
    }

    const expenseUpdate2 = await prisma.expense.update({
      where: { id: expenseId2 },
      data: {
        groupId: groupId2,
        paidById: paidById2,
        amountPaid: amountPaid2,
        paidFor: paidFor,
        expenseName: expenseName,
      },
    });

    res.status(200).json({ expenseUpdate2 });
  } catch (error) {
    console.error("Error updating2!", error);
    res.status(500).jsonp({ error: "An error occured upon updating2!" });
  }
};
