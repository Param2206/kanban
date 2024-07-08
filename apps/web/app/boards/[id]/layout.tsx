import Sidebar from "../../ui/sidebar";
import { fetchProjects } from "../../lib/data";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const boards = await fetchProjects();
  return (
    <div className="flex h-screen">
      <div className="w-full flex-none md:w-64"></div>
      <Sidebar boards={boards} />
      <div className="flex-grow p-6 md:p-12">{children}</div>
    </div>
  );
}
