// import DndEx from "@/components/Widgets/DndEx";
import Header from "@/components/layout/Header";
import FirestoreSync from "@/components/shared/FirestoreSync";
import AddAnotherList from "@/components/Widgets/AddAnotherList";
import HeroD from "@/components/Widgets/HeroD";

export default function Home() {
  return (
    <div className="bg-[#8F3F65] h-screen flex flex-col  your-scrollable-class">
      <FirestoreSync />
      <Header />
      {/* bg-gradient-to-tr from-primary to-secondary */}
      <div className="flex-1 flex overflow-x-auto min-w-full">
        {/* Your main content area */}
        <div className="flex w-max">
          <HeroD />
          <AddAnotherList />
        </div>
      </div>
    </div>
  )
}