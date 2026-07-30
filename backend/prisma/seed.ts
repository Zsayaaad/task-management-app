// import "dotenv/config";
// import { PrismaClient, Role, TaskStatus, TaskPriority } from "@prisma/client";
// import bcrypt from "bcryptjs";
// import { PrismaPg } from "@prisma/adapter-pg";

// const connectionString = `${process.env.DATABASE_URL}`;

// const adapter = new PrismaPg({ connectionString });

// const prisma = new PrismaClient({ adapter });

// async function main() {
//   console.log("Resetting database...");
//   await prisma.task.deleteMany();
//   await prisma.projectMember.deleteMany();
//   await prisma.project.deleteMany();
//   await prisma.user.deleteMany();

//   console.log("Seeding database...");

//   // 1) Hash passwords
//   const adminPassword = await bcrypt.hash("Admin123!", 10);
//   const memberPassword = await bcrypt.hash("Member123!", 10);

//   // 2) Create Admin user
//   const admin = await prisma.user.upsert({
//     where: { email: "admin@example.com" },
//     update: {},
//     create: {
//       name: "Admin User",
//       email: "admin@example.com",
//       password: adminPassword,
//       role: Role.ADMIN,
//     },
//   });

//   // 3) Create Member users
//   const member1 = await prisma.user.upsert({
//     where: { email: "member@example.com" },
//     update: {},
//     create: {
//       name: "Member One",
//       email: "member@example.com",
//       password: memberPassword,
//       role: Role.MEMBER,
//     },
//   });

//   const member2 = await prisma.user.upsert({
//     where: { email: "member2@example.com" },
//     update: {},
//     create: {
//       name: "Member Two",
//       email: "member2@example.com",
//       password: memberPassword,
//       role: Role.MEMBER,
//     },
//   });

//   // 4) Create a Project
//   const project = await prisma.project.create({
//     data: {
//       name: "Demo Project",
//       description: "Sample project created by seed script",
//     },
//   });

//   // 5) Add members to the project (Admin + both Members)
//   await prisma.projectMember.createMany({
//     data: [
//       { userId: admin.id, projectId: project.id },
//       { userId: member1.id, projectId: project.id },
//       { userId: member2.id, projectId: project.id },
//     ],
//     skipDuplicates: true,
//   });

//   // 6) Create sample tasks with different statuses/priorities
//   await prisma.task.createMany({
//     data: [
//       {
//         title: "Setup project repository",
//         description: "Initialize repo, install dependencies, configure env",
//         status: TaskStatus.DONE,
//         priority: TaskPriority.HIGH,
//         dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // +1 day
//         projectId: project.id,
//         creatorId: admin.id,
//         assigneeId: member1.id,
//       },
//       {
//         title: "Design database schema",
//         description: "Define models and relations in Prisma",
//         status: TaskStatus.IN_PROGRESS,
//         priority: TaskPriority.HIGH,
//         dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // +2 days
//         projectId: project.id,
//         creatorId: admin.id,
//         assigneeId: member2.id,
//       },
//       {
//         title: "Build task board UI",
//         description: "Implement frontend task board with filters",
//         status: TaskStatus.TODO,
//         priority: TaskPriority.MEDIUM,
//         dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // +5 days
//         projectId: project.id,
//         creatorId: member1.id,
//         assigneeId: member2.id,
//       },
//     ],
//   });

//   console.log("✅ Seed completed successfully!");
//   console.log("----------------------------------------");
//   console.log("Admin  -> email: admin@example.com   | password: Admin123!");
//   console.log("Member -> email: member@example.com  | password: Member123!");
//   console.log("Member -> email: member2@example.com | password: Member123!");
//   console.log("----------------------------------------");
// }

// main()
//   .catch((e) => {
//     console.error("❌ Seed failed:", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

import "dotenv/config";
import { PrismaClient, Role, TaskStatus, TaskPriority } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Resetting database...");
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding database...");

  // 1) Hash passwords
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const memberPassword = await bcrypt.hash("Member123!", 10);

  // 2) Create Admin and Team Members
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const member1 = await prisma.user.create({
    data: {
      name: "Alex Johnson",
      email: "member@example.com",
      password: memberPassword,
      role: Role.MEMBER,
    },
  });

  const member2 = await prisma.user.create({
    data: {
      name: "Sarah Smith",
      email: "member2@example.com",
      password: memberPassword,
      role: Role.MEMBER,
    },
  });

  const member3 = await prisma.user.create({
    data: {
      name: "David Chen",
      email: "member3@example.com",
      password: memberPassword,
      role: Role.MEMBER,
    },
  });

  const allUsers = [admin, member1, member2, member3];

  // 3) Define 5 Projects with structured tasks and assignees
  const projectsData = [
    {
      name: "E-Commerce Mobile App",
      description:
        "Cross-platform mobile application for online retail storefront.",
      tasks: [
        {
          title: "Setup React Native / Expo boilerplate",
          description:
            "Configure navigation, state management, and base theme.",
          status: TaskStatus.DONE,
          priority: TaskPriority.HIGH,
          dueDays: 1,
          creator: admin,
          assignee: member1,
        },
        {
          title: "Integrate Stripe payment gateway",
          description:
            "Implement checkout flows and webhooks for payment processing.",
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.HIGH,
          dueDays: 4,
          creator: member1,
          assignee: member2,
        },
        {
          title: "Design product catalog UI",
          description: "Build responsive grids and filtering components.",
          status: TaskStatus.TODO,
          priority: TaskPriority.MEDIUM,
          dueDays: 7,
          creator: admin,
          assignee: member3,
        },
      ],
    },
    {
      name: "Customer Support Dashboard",
      description:
        "Internal administrative tool for managing support tickets and SLA tracking.",
      tasks: [
        {
          title: "Configure REST API endpoints",
          description: "Expose query endpoints for ticket queues.",
          status: TaskStatus.DONE,
          priority: TaskPriority.HIGH,
          dueDays: -2, // Overdue task example
          creator: admin,
          assignee: member2,
        },
        {
          title: "Implement real-time chat widget",
          description:
            "WebSockets integration for live support agent communication.",
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.HIGH,
          dueDays: 3,
          creator: member2,
          assignee: member1,
        },
        {
          title: "Export ticket analytics to CSV",
          description: "Add data export functionality on reporting page.",
          status: TaskStatus.TODO,
          priority: TaskPriority.LOW,
          dueDays: 10,
          creator: admin,
          assignee: member3,
        },
      ],
    },
    {
      name: "AI Assistant Integration",
      description: "Embedding an LLM chatbot into the main SaaS platform.",
      tasks: [
        {
          title: "Evaluate LLM API options & pricing",
          description:
            "Compare latency, cost, and context limits across providers.",
          status: TaskStatus.DONE,
          priority: TaskPriority.MEDIUM,
          dueDays: -1,
          creator: admin,
          assignee: member3,
        },
        {
          title: "Build streaming response UI",
          description: "Render markdown and stream response tokens seamlessly.",
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.HIGH,
          dueDays: 2,
          creator: member3,
          assignee: member1,
        },
        {
          title: "Context window optimization",
          description:
            "Implement vector store semantic search for dynamic context injection.",
          status: TaskStatus.TODO,
          priority: TaskPriority.HIGH,
          dueDays: 6,
          creator: admin,
          assignee: member2,
        },
      ],
    },
    {
      name: "Cloud Infrastructure Migration",
      description:
        "Migrating legacy servers to containerized AWS infrastructure.",
      tasks: [
        {
          title: "Write Dockerfiles for Node backend",
          description: "Optimize multi-stage builds for minimal image size.",
          status: TaskStatus.DONE,
          priority: TaskPriority.HIGH,
          dueDays: 0,
          creator: admin,
          assignee: member2,
        },
        {
          title: "Configure Terraform scripts",
          description: "Provision VPC, ECS, and PostgreSQL RDS instances.",
          status: TaskStatus.TODO,
          priority: TaskPriority.HIGH,
          dueDays: 5,
          creator: admin,
          assignee: member2,
        },
        {
          title: "Setup CI/CD pipeline",
          description:
            "Automate build, test, and deploy steps in GitHub Actions.",
          status: TaskStatus.TODO,
          priority: TaskPriority.MEDIUM,
          dueDays: 8,
          creator: member1,
          assignee: member3,
        },
      ],
    },
    {
      name: "Marketing Landing Page Redesign",
      description:
        "Conversion-focused landing page overhaul with modern frontend tech.",
      tasks: [
        {
          title: "Figma design system handoff",
          description:
            "Review hero section and CTA components with UI designer.",
          status: TaskStatus.DONE,
          priority: TaskPriority.LOW,
          dueDays: -4,
          creator: admin,
          assignee: member1,
        },
        {
          title: "Implement Next.js static pages",
          description: "Build fast, SEO-friendly landing pages.",
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.MEDIUM,
          dueDays: 3,
          creator: member1,
          assignee: member1,
        },
        {
          title: "Configure analytics & funnel tracking",
          description: "Track button clicks and user conversion flow.",
          status: TaskStatus.TODO,
          priority: TaskPriority.LOW,
          dueDays: 9,
          creator: admin,
          assignee: member2,
        },
      ],
    },
  ];

  // 4) Loop through and populate database
  for (const projectInput of projectsData) {
    // Create Project
    const project = await prisma.project.create({
      data: {
        name: projectInput.name,
        description: projectInput.description,
      },
    });

    // Assign all team members to the created project
    await prisma.projectMember.createMany({
      data: allUsers.map((user) => ({
        userId: user.id,
        projectId: project.id,
      })),
      skipDuplicates: true,
    });

    // Create tasks for the project
    await prisma.task.createMany({
      data: projectInput.tasks.map((task) => ({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * task.dueDays),
        projectId: project.id,
        creatorId: task.creator.id,
        assigneeId: task.assignee.id,
      })),
    });
  }

  console.log("✅ Seed completed successfully!");
  console.log("----------------------------------------");
  console.log("Admin   -> email: admin@example.com   | password: Admin123!");
  console.log("Member1 -> email: member@example.com  | password: Member123!");
  console.log("Member2 -> email: member2@example.com | password: Member123!");
  console.log("Member3 -> email: member3@example.com | password: Member123!");
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
