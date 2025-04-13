import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";
import Navigation from "./Navigation";
import PhotoBox from "./PhotoBox";

export default function Panel() {
    return (
        <div className="flex flex-col gap-2 m-2 justify-between min-h-[100vh]">
            <PhotoBox name="John Doe" title="Programmer. Creative. Innovator" description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque" avatar="http://avatars0.githubusercontent.com/u/246180?v=4" />
            <Navigation/>
            <Button 
              icon={<FontAwesomeIcon icon="chevron-left" size="xs" />} 
              text="Go Back" 
              className="bg-main" 
            />
        </div>
    )
}