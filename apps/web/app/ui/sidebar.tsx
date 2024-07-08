"use client";

import Link from "next/link";
import clsx from "clsx";
import {usePathname} from "next/navigation";

export default function Sidebar({ boards }: any) {
  const pathname = usePathname();
  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          {boards.map((board: any, i: number) => (
            <li key={i}>
              <Link
                href={`/boards/${board.project_id}`}
                className={clsx("flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group active:bg-gray-100 dark:active:bg-gray-700",
                  {
                    'bg-gray-100 dark:bg-gray-700': pathname === `/boards/${board.project_id}`,
                  }
                )}
              >
                <span className="flex-1 ms-3 whitespace-nowrap">
                  {board.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
