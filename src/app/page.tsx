import { ChartPage } from "./components/ChartPage";
import Info from "./components/Info";

export default function Home() {
  return (
    <main className="min-h-screen gap-5 bg-gradient-to-br from-blue-50 via-white to-blue-50 p-8 flex flex-col items-center justify-center">
      <Info />
      <ChartPage />
    </main>
  )
}
