import Header from "@/components/layout/Header";
import FirestoreSync from "@/components/shared/FirestoreSync";
import AddAnotherList from "@/components/Widgets/AddAnotherList";
import HeroD from "@/components/Widgets/HeroD";

export default function Home() {
  return (
    <div className="bg-gradient-to-tr from-[#ff00cc] to-[#3181CD] h-screen flex flex-col your-scrollable-class">
      <FirestoreSync />
      <Header />
      <div className="flex-1 flex flex-col items-center">        
        <div className="relative rounded-xl mt-[32px] w-[320px] md:w-[650px] lg:w-[800px] xl:w-[1100px] py-4 md:px-4">
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-white opacity-30 rounded-xl"></div>
          {/* Main Content */}
          <div className="flex flex-col items-center w-full justify-center relative opacity-100">
            <div className="w-full flex justify-center">
              <AddAnotherList />
            </div>
            {/* h-[313px] md:h-[390px] lg:h-[440px] */}
            <div className="overflow-x-auto w-full">
              <HeroD />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}