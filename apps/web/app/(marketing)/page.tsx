import { Navbar } from "@/components/marketing/header";

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <Navbar />
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Web Home Page</h1>
      </div>
    </div>
  );
}
