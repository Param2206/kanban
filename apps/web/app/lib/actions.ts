"use server";

// import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { db } from "../../prisma/src/db";
import { fetchTaskOrderByProject, fetchTasksByProject } from "./data";

export type State = {
  errors?: {
    categoryId?: string[];
    title?: string[];
    description?: string[];
    priority?: string[];
    status?: string[];
  };
  message?: string | null;
};

// // Projects Table
// export async function createProject(title: string, description: string) {
//   try {
//     await sql`
//       INSERT INTO projects (title, description)
//       VALUES (${title}, ${description})
//     `;
//     revalidatePath("/boards");
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to create project.");
//   }
// }

// export async function updateProject(
//   id: string,
//   title: string,
//   description: string
// ) {
//   try {
//     await sql`
//       UPDATE projects
//       SET title = ${title}, description = ${description}
//       WHERE project_id = ${id}
//     `;
//     revalidatePath("/projects");
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to update project.");
//   }
// }

// export async function deleteProject(id: string) {
//   try {
//     await sql`DELETE FROM projects WHERE project_id = ${id}`;
//     revalidatePath("/projects");
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to delete project.");
//   }
// }

// Tasks Table
export async function createTask(
  projectId: number,
  title: string,
  description: string,
  status: string,
  dueDate: Date,
  priority: string
) {
  try {
    const createdTask = await db.task.create({
      data: {
        title,
        description,
        priority,
        status,
        due_date: dueDate,
        project: {
          connect: {
            project_id: projectId
          }
        }
      }
    });
    revalidatePath(`/boards/${projectId}/add-task`);
    // redirect(`/boards/${projectId}`);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create task.");
  }
}

export async function updateTaskCategory(task_id: number, category: string) {
  try {
    const updatedTask = await db.task.update({
      where: {
        task_id: task_id
      },
      data: {
        status: category,
      },
    })
    return updatedTask;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update task category");
  }
}

// export async function deleteTask(id: string) {
//   try {
//     await sql`DELETE FROM tasks WHERE task_id = ${id}`;
//     revalidatePath("/boards");
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to delete task.");
//   }
// }

export async function updateTaskOrder(
  project_id: number,
  category: string,
  taskIds: string,
  newTaskIds: string
) {
  try {
    // Update task order in the database
    await db.taskOrder.update({
      where: {
        project_id: project_id,
        category: category,
        taskIds: taskIds,
      },
      data: {
        taskIds: newTaskIds,
      },
    });

    // Fetch updated tasks after updating task order
    const updatedTasks = await fetchTasksByProject(project_id);
    
    return updatedTasks;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to reorder tasks or fetch updated tasks.");
  }
}