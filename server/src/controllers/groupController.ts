import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { error } from "console";

const prisma = new PrismaClient();

export const createGroup = async (req: Request, res: Response) => {
  const { creatorId } = req.params;
  const { groupName, participants } = req.body;

  try {
    const creatorId2 = Number(creatorId);

    if (isNaN(creatorId2)) {
      return res.status(400).json({ error: "Invalid creatorId!" });
    }

    if (groupName === "" || participants === "") {
      return res
        .status(400)
        .json({ error: "Group name and/or patricipants can't be empty!" });
    }

    const addGroup = await prisma.group.create({
      data: {
        name: groupName,
        participants: participants,
        creator: {
          connect: {
            id: creatorId2,
          },
        },
      },
    });

    res.status(200).json({ addGroup });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occured!" });
  }
};
