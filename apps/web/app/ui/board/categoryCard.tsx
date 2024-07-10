import Link from "next/link";
import TaskCard from "./taskCard";
import { Droppable } from "react-beautiful-dnd";

function CategoryCard({ category, tasks, index, projectId }: any) {
  return (
    <div className="bg-white border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm p-4 w-72 dark:bg-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {category}
      </h3>
      <Droppable droppableId={`${index}`} key={index}>
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
}

export default CategoryCard;
