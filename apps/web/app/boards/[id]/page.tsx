import {
  fetchProjects,
  fetchTaskOrderByProject,
  fetchTasksByProject,
} from "../../lib/data";
import BoardContainer from "./boardContainer";
import { updateTaskOrder, updateTaskCategory } from "../../lib/actions";

export default async function Page({ params }: { params: { id: string } }) {
  const boards = await fetchProjects();

  const { id } = params;

  // Convert id to integer to access the correct board index
  const boardId = parseInt(id, 10);
  const tasks = await fetchTasksByProject(boardId);
  const taskIdsAll = await fetchTaskOrderByProject(boardId);
  let categories: any = [];
  // Extract unique statuses
  if (taskIdsAll) {

    taskIdsAll.forEach((taskIdItem: any) => {
      const taskIds = taskIdItem.taskIds.split(",").map(Number);

      const task = {
        category: taskIdItem.category,
        taskIds: taskIds,
      };

      categories.push(task);
    });
  } else {
    const uniqueStatuses = Array.from(
      new Set(tasks.map((task: any) => task.status))
    );
    uniqueStatuses.map((status: any) => {
      const categorizedTasks = tasks.filter((task: any) => task.status === status);
      const taskIds = categorizedTasks.map((task: any) => task.task_id);
      let category = { category: status, taskIds: taskIds };
      categories.push(category);
    });
  }

  const boardIndex = boardId - 1;

  // Validate if boardIndex is a number and exists in data
  const board =
    !isNaN(boardIndex) && boards[boardIndex] ? boards[boardIndex] : null;

  if (!board) {
    return <div>Board not found</div>;
  }

  return (
    <BoardContainer
      projectId={boardId}
      tasksProps={tasks}
      categories={categories}
      onTaskReorder={async (
        projectId: number,
        category: string,
        taskIds: any,
        newTaskIds: any
        
      ) => {
        "use server";
        await updateTaskOrder(
          projectId,
          category,
          taskIds.toString(),
          newTaskIds.toString()
        );
        
        const test2 = await fetchTasksByProject(projectId);
        return test2;
      }}

      onCategoryUpdate={async (
        projectId: number,
        taskId: number,
        category: string
      ) => {
        "use server";
        const tasks = updateTaskCategory(
          taskId,
          category
        )

        return tasks;
      }}

      fetchTasks={async (
        projectId: number
      ) => {
        "use server";
        fetchTasksByProject(
          projectId
        )
      }}
    />
  );
}
