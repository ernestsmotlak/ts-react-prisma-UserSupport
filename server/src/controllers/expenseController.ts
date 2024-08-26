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

export const addExpense = async (req: Request, res: Response) => {
  const { userId } = req.params; // Get userId from URL parameters
  const { groupId, amountPaid, paidFor } = req.body; // Get other data from request body

  console.log("userId:", userId);
  console.log("groupId:", groupId);
  console.log("amountPaid:", amountPaid);
  console.log("paidFor:", paidFor);

  try {
    // Convert the values to the correct types
    const groupIdInt = parseInt(groupId, 10);
    const userIdInt = parseInt(userId, 10);
    console.log("!! userIDint: ", userIdInt);
    const amountPaidFloat = parseFloat(amountPaid);

    // Check if the conversions are successful
    if (isNaN(groupIdInt) || isNaN(userIdInt) || isNaN(amountPaidFloat)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Create a new expense linked to the userId from params
    const newExpense = await prisma.expense.create({
      data: {
        groupId: groupIdInt,
        paidById: userIdInt, // Use the parsed integer value
        amountPaid: amountPaidFloat, // Use the parsed float value
        paidFor: paidFor,
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

// export const updateExpense = async (req: Request, res: Response) => {
//   const { expenseId } = req.params;
//   const { groupName, paidById, amountPaid } = req.body;

//   console.log(expenseId);
//   console.log(groupName);
//   console.log(paidById);
//   console.log(amountPaid);

//   try {
//     const nameOfGroup = groupName;
//     const idOfExpense = Number(expenseId);
//     const idOfPayer = Number(paidById);
//     const paidAmount = parseFloat(amountPaid);

//     if (
//       nameOfGroup === "" ||
//       isNaN(idOfExpense) ||
//       isNaN(idOfPayer) ||
//       isNaN(paidAmount)
//     ) {
//       return res.status(400).json({ error: "Invalid input data!" });
//     }

//     const expenseUpdate = await prisma.expense.update({
//       where: { id: idOfExpense },
//       data: {
//         group: {
//           update: {
//             name: groupName,
//           },
//         },
//         paidBy: {
//           connect: {
//             id: idOfPayer,
//           },
//         },
//       },
//       include: {
//         group: true,
//       },
//     });

//     res.status(200).json({ expenseUpdate });
//   } catch (error) {
//     console.error("Error updating expense!", error);
//     res
//       .status(500)
//       .json({ error: "An error occured while updating the expense!" });
//   }
// };
