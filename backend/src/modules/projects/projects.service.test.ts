// // The Fix
// // Use global jest.mock(...) at the top of the test file before importing projects.service.js.
// // Do not import jest from @jest/globals for top-level jest.mock() calls so SWC can recognize and hoist it properly.
// // 👇 Replace the real prisma module with a fake one
// // import { jest } from "@jest/globals";
// jest.mock("../../lib/prisma.js", () => ({
//   prisma: {
//     project: {
//       findUnique: jest.fn(),
//     },
//   },
// }));

// import { describe, expect, it, test } from "@jest/globals";
// import { prisma } from "../../lib/prisma.js";
// import { projectService } from "./projects.service.js";
// import { NotFoundError } from "../../errors/customErrors.js";

// describe("sum", () => {
//   it("should return 2 + 3 = 5", () => {
//     const result = projectService.sum(2, 3);
//     expect(result).toBe(5);
//     expect(result).toBeGreaterThan(4);
//     expect(result).toBeGreaterThanOrEqual(5);

//     expect(projectService.sum(0.102, 0.3)).toBeCloseTo(0.4);
//   });
// });

// test("greeting - should return hello ziad", () => {
//   expect(projectService.greeting("Ziad")).toMatch(/Hello Ziad!/);
// });

// describe("isEven", () => {
//   it("should return true for 4", () => {
//     expect(projectService.isEven(4)).toBeTruthy();
//   });

//   it("should return false for 3", () => {
//     expect(projectService.isEven(3)).toBeFalsy();
//   });
// });

// test("validation", () => {
//   let x = 1;

//   expect(x).not.toBeNull();
// });

// test("animals - should return true for cat", () => {
//   expect(projectService.ANIMALS).toContain("cat");
// });

// describe("getOrderById", () => {
//   it("should return order of id=1", () => {
//     const res = projectService.getOrderById(1);
//     expect(res).toMatchObject({ id: 1 });
//     expect(res).toHaveProperty("id", 1);
//   });

//   it("should throw error if id not defined", () => {
//     expect(() => projectService.getOrderById()).toThrow(
//       "id cannot be undefined",
//     );
//   });
// });

// describe("getOrders", () => {
//   it("should return some orders", async () => {
//     // const orders = await projectService.getOrders();
//     // expect((await projectService.getOrders()).length).toBe(2);
//     await expect(projectService.getOrders()).resolves.toContainEqual({
//       id: 1,
//       price: 10,
//     });
//   });
// });

// // // 👇 Get a typed version of the mocked function
// // const mockFindUnique = jest.mocked(prisma.project.findUnique);

// // const fakeProject = {
// //   id: "p1",
// //   name: "Test Project",
// //   description: "desc",
// //   creatorId: "u1",
// //   createdAt: new Date(),
// //   updatedAt: new Date(),
// // };

// // describe("getProjectName", () => {
// //   it("should return the project name", async () => {
// //     // You decide what the DB returns
// //     mockFindUnique.mockResolvedValue(fakeProject);

// //     const name = await projectService.getProjectName("p1");
// //     expect(name).toBe("Test Project");

// //     // Verify the service queried the DB with the right id
// //     expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: "p1" } });

// //     // const myFn = jest.fn();
// //     // myFn.mockReturnValue(5).mockReturnValueOnce(10);
// //     // console.log(myFn(), myFn(), myFn()); // 10 5 5
// //   });

// //   it("should throw when project not found", async () => {
// //     mockFindUnique.mockResolvedValue(null);

// //     await expect(projectService.getProjectName("missing")).rejects.toThrow(
// //       "Project not found",
// //     );
// //   });
// // });

// /**
//   1. Arrange → Prepare the mock  => mockResolvedValue(...)
//   ↓
//   2. Act → Run the function      => getProjectName(...)
//   ↓
//   3. Assert → Verify the result  => toBe(...)  , toHaveBeenCalledWith(...)
// */
// describe("getProjectName", () => {
//   it("should return project name when project exists", async () => {
//     // Arrange
//     (prisma.project.findUnique as jest.Mock).mockResolvedValue({
//       id: "project-123",
//       name: "My Project",
//     });

//     // Act
//     const result = await projectService.getProjectName("project-123");

//     // Assert
//     expect(result).toBe("My Project");

//     expect(prisma.project.findUnique).toHaveBeenCalledWith({
//       where: {
//         id: "project-123",
//       },
//     });
//   });

//   // NOT FOUND TEST
//   it("should throw NotFoundError when project does not exist", async () => {
//     // // Arrange
//     (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

//     // Act + Assert
//     await expect(projectService.getProjectName("project-123")).rejects.toThrow(
//       NotFoundError,
//     );

//     expect(prisma.project.findUnique).toHaveBeenCalledWith({
//       where: {
//         id: "project-123",
//       },
//     });
//   });
// });
