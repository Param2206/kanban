'use client';

import { Draggable } from "react-beautiful-dnd";

export default function TaskCard({ task, index }: any) {
  // Function to format date as needed
  const formatDate = (dateString: any) => {
    if (!dateString) {
      return 'No Due Date';
    }
    
    const dateObject = new Date(dateString);
    if (isNaN(dateObject.getTime())) {
      return 'Invalid Date';
    }
    
    const formattedDate = `${dateObject.getDate()}/${dateObject.getMonth() + 1}/${dateObject.getFullYear()}`;
    return formattedDate;
  };

  return (
    <Draggable draggableId={`${task.task_id}`} index={index}>
      {(provided) => (
        <div
          className={"bg-white border border-gray-200 dark:border-gray-600 shadow rounded-lg shadow-sm p-4 mb-4 dark:text-white dark:bg-gray-800 text-gray-900"}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-600 mb-2 dark:text-gray-300">{task.description}</p>
          <div className="mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Due Date: {formatDate(task.due_date)}
            </span>
          </div>
          <div className="mb-2">
            <span
              className={`${"inline-block px-2 py-1 text-xs font-semibold rounded text-white"} ${
                task.priority === "High"
                  ? "bg-red-500"
                  : task.priority === "Medium"
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            >
              {task.priority}
            </span>
          </div>
          <div>
            <span
              className={`${"inline-block px-2 py-1 text-xs font-semibold rounded text-white"} ${
                task.status === "To Do"
                  ? "bg-blue-500"
                  : task.status === "In Progress"
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            >
              {task.status}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}
