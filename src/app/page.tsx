// import DndEx from "@/components/Widgets/DndEx";
import AddAnotherList from "@/components/Widgets/AddAnotherList";
import HeroD from "@/components/Widgets/HeroD";

export default function Home() {
  return (
    <div className="flex bg-gradient-to-tr from-primary to-secondary h-screen overflow-x-auto min-w-full">
      <HeroD />
      <AddAnotherList />
    </div>
  )
}