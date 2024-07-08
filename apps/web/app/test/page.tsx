"use client";

import { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import CategoryCard from "@/app/ui/board/categoryCard"; // Adjust import path as per your project structure
import {
  fetchProjects,
  fetchTaskOrderByProject,
  fetchTasksByProject,
} from "../lib/data";
import {
  updateTaskCategory,
  updateTaskOrder,
} from "@/app/lib/actions"; // Adjust import path as per your project structure
import Link from "next/link";
import TaskCard from "../ui/board/taskCard"; // Adjust import path as per your project structure

export default function Page({ params }: { params: { id: string } }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [previousCategories, setPreviousCategories] = useState<any[]>([]);
  const [updated, setUpdated] = useState(false);
  const projectId = 1;

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await fetchProjects();
        setProjects(res);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchBoards();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetchTasksByProject(projectId);
        setTasks(res);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [updated]);

  useEffect(() => {
    const getCategories = async () => {
      let taskIdsAll: any = [];
      try {
        taskIdsAll = await fetchTaskOrderByProject(projectId);
      } catch (error) {
        console.error("Error fetching task order:", error);
      }

      let newCategories: any = [];
      // Extract unique statuses
      if (taskIdsAll) {
        taskIdsAll.forEach((taskIdItem: any) => {
          const taskIds = taskIdItem.taskIds.split(",").map(Number);

          const task = {
            category: taskIdItem.category,
            taskIds: taskIds,
          };

          newCategories.push(task);
        });
      } else {
        const uniqueStatuses = Array.from(
          new Set(tasks.map((task) => task.status))
        );
        uniqueStatuses.forEach((status) => {
          const categorizedTasks = tasks.filter(
            (task) => task.status === status
          );
          const taskIds = categorizedTasks.map((task) => task.task_id);
          let category = { category: status, taskIds: taskIds };
          newCategories.push(category);
        });
      }

      setPreviousCategories([...categories]); // Update previousCategories before updating categories
      setCategories(newCategories);
    };

    getCategories();
  }, [updated, tasks]); // Include 'tasks' in the dependencies as well

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      return "No Due Date";
    }

    const dateObject = new Date(dateString);
    if (isNaN(dateObject.getTime())) {
      return "Invalid Date";
    }

    const formattedDate = `${dateObject.getDate()}/${
      dateObject.getMonth() + 1
    }/${dateObject.getFullYear()}`;
    return formattedDate;
  };

  const findExtraElement = (a: any, b: any) => {
    const setA = new Set(a);

    const extraElement = b.find((element: any) => !setA.has(element));

    return extraElement;
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceCategory = categories[source.droppableId];
    const destinationCategory = categories[destination.droppableId];

    if (sourceCategory === destinationCategory) {
      const newTaskIds = Array.from(sourceCategory.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, Number(draggableId));

      const updatedCategories = categories.map((category: any) => {
        if (category.category === sourceCategory.category) {
          return { ...category, taskIds: newTaskIds };
        }
        return category;
      });

      setPreviousCategories([...categories]); // Update previousCategories before updating categories
      setCategories(updatedCategories);

      try {
        await updateTaskOrder(
          projectId,
          sourceCategory.category,
          sourceCategory.taskIds,
          newTaskIds.toString()
        );
        setUpdated((prev) => !prev);
      } catch (error) {
        console.error("Error updating task order:", error);
      }
    } else {
      const newSourceTaskIds = Array.from(sourceCategory.taskIds);
      newSourceTaskIds.splice(source.index, 1);
      const newDestinationTaskIds = Array.from(destinationCategory.taskIds);
      newDestinationTaskIds.splice(destination.index, 0, Number(draggableId));
      const updatedCategories = categories.map((category: any) => {
        if (category.category === sourceCategory.category) {
          return { ...category, taskIds: newSourceTaskIds };
        }
        if (category.category === destinationCategory.category) {
          return { ...category, taskIds: newDestinationTaskIds };
        }
        return category;
      });

      setPreviousCategories([...categories]); // Update previousCategories before updating categories
      setCategories(updatedCategories);

      try {
        await Promise.all([
          updateTaskOrder(
            projectId,
            sourceCategory.category,
            sourceCategory.taskIds,
            sourceCategory.taskIds.toString()
          ),
          updateTaskOrder(
            projectId,
            destinationCategory.category,
            destinationCategory.taskIds,
            destinationCategory.taskIds.toString()
          ),
        ]);

        const taskIdToUpdate = findExtraElement(
          previousCategories.find(
            (category: any) => category.category === destinationCategory.category
          ).taskIds,
          newDestinationTaskIds
        );

        await updateTaskCategory(taskIdToUpdate, destinationCategory.category);
        setUpdated((prev) => !prev);
      } catch (error) {
        console.error("Error updating task order or category:", error);
        // Handle error (e.g., display an error message)
      }
    }
  };

  console.log("Projects:", projects);
  console.log("Tasks:", tasks);
  console.log("Categories:", categories);

  const projectIndex = projectId - 1;

  const project =
    !isNaN(projectIndex) && projects[projectIndex]
      ? projects[projectIndex]
      : null;

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <main>
      <DragDropContext onDragEnd={handleDragEnd}>
        <main className="flex space-x-6">
          {categories.map((category: any, i: number) => {
            console.log("tasks =", tasks);
            const filteredTasks = tasks.filter(
              (task: any) => task.status === category.category
            );
            const sortedTasks = category.taskIds.map((taskId: number) =>
              filteredTasks.find((task: any) => task.task_id == taskId)
            );
            console.log("sorted =", filteredTasks, sortedTasks);
            return (
                <div className="bg-white border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm p-4 w-72 dark:bg-gray-800 dark:text-white">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {category}
                </h3>
                <Droppable droppableId={`${i}`} key={i}>
                  {(provided) => (
                    <div
                      className="space-y-4 flex-grow"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {tasks.map((task: any, i: number) => {
                        return <TaskCard key={task.task_id} task={task} index={i} />;
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <Link
                  href={`/boards/${projectId}/add-task`}
                  className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold mt-2 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 inline-block"
                  passHref
                >
                  Add New Task
                </Link>
              </div>
            );
          })}
        </main>
      </DragDropContext>
    </main>
  );
}
