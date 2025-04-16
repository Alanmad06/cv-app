import type { Timeline } from "@/interfaces/timeline";

export default function Timeline({ timeline ,title }: { timeline: Timeline[], title: string }) {
    return (
        <>
        <h2 className="font-semibold text-xl md:text-3xl py-4 px-4 font-sans text-main ">{title}</h2>
        <div className="max-h-[80dvh] scroll-auto overflow-y-scroll scrollbar-blue-600 scrollbar-thin scrollbar-thumb-main scrollbar-track-gray-700">
            
            {timeline.map((project: Timeline, index) => (
                <div key={index} className="flex flex-row gap-2 m-2 text-foreground  ">
                    <div className="flex-1/10 relative
                     before:content-[''] before:absolute before:bg-main 
                     before:w-1 before:h-[70%] before:top-[70%] before:left-[50%]
                      before:translate-x-[-50%] before:translate-y-[-50%] text-center" >
                        <h2>{project.date}</h2>
                        
                    </div>
                    <div className="flex-9/10 bg-[#eeeeee] p-2 relative
                    before:content-[''] before:absolute before:w-0 before:h-0
                    before:border-t-[10px] before:border-r-[10px] before:border-b-[10px]
                    before:border-t-transparent before:border-r-[#eeeeee] before:border-b-transparent
                    before:left-[-9px] before:top-[3px] text-black min-h-[80px]
                    ">
                        <h2 className="py-1 font-bold">{project.title}</h2>
                        <p>{project.text}</p>

                    </div>
                </div>
            ))}
        </div>
        </>
    );
}