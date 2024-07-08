"use server";
import { db } from "../../prisma/src/db";

// Function to fetch all projects
export async function fetchProjects() {
  try {
    const projects = await db.project.findMany();
    return projects;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch projects.");
  }
}

// Function to fetch tasks for a given project_id
export async function fetchTasksByProject(project_id: number) {
  try {
    const tasks = await db.task.findMany({
      where: {
        project_id: project_id
      }
    });
    return tasks;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch tasks.");
  }
}

// Function to fetch task orders for a given project_id
export async function fetchTaskOrderByProject(project_id: number) {
  try {
    const taskOrders = await db.taskOrder.findMany({
      where: {
        project_id: project_id,
      }
    });
    return taskOrders;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch task orders.");
  }
}
