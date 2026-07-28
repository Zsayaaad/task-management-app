import "dotenv/config";
import { PrismaClient, Role, TaskStatus, TaskPriority } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // 1) Hash passwords
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const memberPassword = await bcrypt.hash("Member123!", 10);

  // 2) Create Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // 3) Create Member users
  const member1 = await prisma.user.upsert({
    where: { email: "member@example.com" },
    update: {},
    create: {
      name: "Member One",
      email: "member@example.com",
      password: memberPassword,
      role: Role.MEMBER,
    },
  });

  const member2 = await prisma.user.upsert({
    where: { email: "member2@example.com" },
    update: {},
    create: {
      name: "Member Two",
      email: "member2@example.com",
      password: memberPassword,
      role: Role.MEMBER,
    },
  });

  // 4) Create a Project
  const project = await prisma.project.create({
    data: {
      name: "Demo Project",
      description: "Sample project created by seed script",
    },
  });

  // 5) Add members to the project (Admin + both Members)
  await prisma.projectMember.createMany({
    data: [
      { userId: admin.id, projectId: project.id },
      { userId: member1.id, projectId: project.id },
      { userId: member2.id, projectId: project.id },
    ],
    skipDuplicates: true,
  });

  // 6) Create sample tasks with different statuses/priorities
  await prisma.task.createMany({
    data: [
      {
        title: "Setup project repository",
        description: "Initialize repo, install dependencies, configure env",
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // +1 day
        projectId: project.id,
        creatorId: admin.id,
        assigneeId: member1.id,
      },
      {
        title: "Design database schema",
        description: "Define models and relations in Prisma",
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // +2 days
        projectId: project.id,
        creatorId: admin.id,
        assigneeId: member2.id,
      },
      {
        title: "Build task board UI",
        description: "Implement frontend task board with filters",
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // +5 days
        projectId: project.id,
        creatorId: member1.id,
        assigneeId: member2.id,
      },
    ],
  });

  console.log("✅ Seed completed successfully!");
  console.log("----------------------------------------");
  console.log("Admin  -> email: admin@example.com   | password: Admin123!");
  console.log("Member -> email: member@example.com  | password: Member123!");
  console.log("Member -> email: member2@example.com | password: Member123!");
  console.log("----------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
