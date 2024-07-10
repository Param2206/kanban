import { fetchProjects } from "../../lib/data";
import Card from "../../ui/boards/card";

export default async function Page() {
  const boards = await fetchProjects();

  return (
    <main className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 px-4 py-8">
      {boards.map((board: any, i: number) => (
        <Card key={i} board={board} />
      ))}
    </main>
  );
}
