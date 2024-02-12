import SnakeGrid from "@/components/SnakeGrid";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>Snake</h1>
      <SnakeGrid />
    </main>
  );
}
