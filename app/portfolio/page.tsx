"use client"

import Box from "@/components/Box";

import Info from "@/components/Info";
import PortfolioC from "@/components/Portfolio";
import Timeline from "@/components/Timeline";
import SkillsContainer from "@/components/SkillsContainer";

import ToggleButton from "@/components/ToggleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import Address from "@/components/Address";

export default function Portfolio() {
  return (
    
      <div className="pt-10 pb-10 px-4 bg-background relative">
        <div className="absolute top-2 right-2">
          <ToggleButton  iconFirst={<FontAwesomeIcon icon={faMoon} size="xs"/>} iconLast={<FontAwesomeIcon icon={faSun} size="xs"/> } />
        </div>
      <Box id="about-me"  title="Who I am" content=" Hi, I'm Alan Madrigal, a software engineering student passionate about building  applications.
       I enjoy working across the full stack, with a growing focus on web development, 
       cloud technologies, and system reliability.
       I’m currently expanding my skills in backend development, DevOps practices,
        and modern web technologies. Here is my portfolio I'm working on a better looking one 
        that really express who I am, 
        this one was a part of a course but still usefull ;)" />


      

     {/*  <Experience experience={[{ date: '2013-2014', info: { company: 'Google', job: 'Front-end developer / php programmer', description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor' } }, { date: '2012', info: { company: 'Twitter', job: 'Web developer', description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor' } }]} />
       */}
      {/* <Feedback feedback={[{ feedback: ' Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor', reporter: { photoUrl: './user.jpg', name: 'John Doe', citeUrl: 'https://www.citeexample.com' } }, { feedback: ' Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor', reporter: { photoUrl: './user.jpg', name: 'John Doe', citeUrl: 'https://www.citeexample.com' } }]} />
      */} 
       <PortfolioC id="portfolio" /> 
      <Info id="Languages" info="Languages : Español - Native | English - B2 (Upper - Intermediate)" />
      <SkillsContainer id="skills" />
      <Timeline id="education" title="Education" timeline={[{date : "2018" , title:"Preparatoria No.4 UDG", text : "Highschool Programming Web Cetificated"}
        ,{date : "2021" , title:"Centro de Ensenanza Tecnica Industrial (CETI)", text : "Software Developmen Engineering"}]}/>
        <Address id="contacts"/>
      </div>
    
  )
}