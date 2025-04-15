import { fetchProject } from "@/lib/action";

export default async function Page({params}: {params : Promise<{name:string}> }) {

   const {name} = await params;
   const project = await fetchProject(name);

  return (

    <div>
        <pre>
            {JSON.stringify(project,null,2)}
        </pre>

    </div>

  )
}