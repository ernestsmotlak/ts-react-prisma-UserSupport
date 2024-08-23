import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create users
  const alice = await prisma.user.create({
    data: {
      username: "alice",
      password: "alicepassword",
    },
  });

  const bob = await prisma.user.create({
    data: {
      username: "bob",
      password: "bobpassword",
    },
  });

  const charlie = await prisma.user.create({
    data: {
      username: "charlie",
      password: "charliepassword",
    },
  });

  const dave = await prisma.user.create({
    data: {
      username: "dave",
      password: "davepassword",
    },
  });

  // Create groups
  const groupA = await prisma.group.create({
    data: {
      name: "Group A",
      creatorId: alice.id,
      participants: "alice,bob,charlie",
    },
  });

  const groupB = await prisma.group.create({
    data: {
      name: "Group B",
      creatorId: bob.id,
      participants: "bob,dave",
    },
  });

  // Create expenses
  await prisma.expense.create({
    data: {
      groupId: groupA.id,
      paidById: alice.id,
      amountPaid: 100.5,
      paidFor: "alice,bob",
    },
  });

  await prisma.expense.create({
    data: {
      groupId: groupA.id,
      paidById: bob.id,
      amountPaid: 50.0,
      paidFor: "charlie",
    },
  });

  await prisma.expense.create({
    data: {
      groupId: groupB.id,
      paidById: bob.id,
      amountPaid: 75.0,
      paidFor: "bob,dave",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
