"use client";

import CategoryCard from "../../ui/board/categoryCard";
import { DragDropContext } from "react-beautiful-dnd";
import { useEffect, useState } from "react";

export default function BoardContainer({
  projectId,
  tasksProps,
  categories,
  onTaskReorder,
  onCategoryUpdate,
}:
any) {
  const [categoriesState, setCategoriesState] = useState(categories);
  const [previousCategoriesState, setPreviousCategoriesState] =
    useState(categories);
  const [tasks, setTasks] = useState(tasksProps);

  console.log("tasks state=",tasks);

  console.log("categoriesState =", categoriesState);
  function findExtraElement(a: any, b: any) {
    const setA = new Set(a);

    const extraElement = b.find((element: any) => !setA.has(element));

    return extraElement;
  }

  const handleDragEnd = async (result: any) => {

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

    if (sourceCategory == destinationCategory) {
      const newTaskIds = Array.from(sourceCategory.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, Number(draggableId));

      const updatedCategories = categories.map((category: any) => {
        if (category.category === sourceCategory.category) {
          return { ...category, taskIds: newTaskIds };
        }
        return category;
      });

      setCategoriesState(updatedCategories);

      const test = await onTaskReorder(
        projectId,
        sourceCategory.category,
        sourceCategory.taskIds,
        newTaskIds
      );
      console.log("test=", test);
      setTasks(test);
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

      setCategoriesState(updatedCategories);
      onTaskReorder(
        projectId,
        sourceCategory.category,
        sourceCategory.taskIds,
        newSourceTaskIds
      );

      const test2 = await onTaskReorder(
        projectId,
        destinationCategory.category,
        destinationCategory.taskIds,
        newDestinationTaskIds
      );
      console.log("test 2=",test2);
      setTasks(test2);

      const taskIdToUpdate = findExtraElement(
        previousCategoriesState.find(
          (category: any) => category.category === destinationCategory.category
        ).taskIds,
        newDestinationTaskIds
      );
      const test3 = await onCategoryUpdate(projectId, taskIdToUpdate, destinationCategory.category);
      setTasks(test3);
      console.log("test 3=", test3);
    }
  };
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <main className="flex space-x-6">
          {categoriesState.map((categoryState: any, i: number) => {
            console.log("tasks =", tasks);
            const filteredTasks = tasks.filter(
              (task: any) => task.status === categoryState.category
            );
            const sortedTasks = categoryState.taskIds.map((taskId: number) =>
              filteredTasks.find((task: any) => task.task_id == taskId)
            );
            console.log("sorted =", filteredTasks, sortedTasks);
            return (
              <CategoryCard
                key={categoryState.category}
                category={categoryState.category}
                tasks={sortedTasks}
                projectId={projectId}
                index={i}
              />
            );
          })}
        </main>
      </DragDropContext>
    );
}
