"use client"

import Box from "@/components/Box";
import Experience from "@/components/Experience";
import Feedback from "@/components/Feedback";
import Info from "@/components/Info";

import Portfolio from "@/components/Portfolio";
import Timeline from "@/components/Timeline";
import SkillsContainer from "@/components/SkillsContainer";
import Providers from "@/components/Providers";





export default function Home() {
  return (
    <Providers>
    
      <Box title="Hola" content=" Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente laudantium odio ad quia dolores vel minus officiis alias modi culpa cum, quidem ipsum esse incidunt ab similique eum ullam soluta.
      Quas necessitatibus maiores eius quo veritatis quae esse, amet fugit magni ab iusto error! Explicabo aspernatur, sapiente itaque sunt beatae, eos praesentium aliquam ipsa illum vel dolor blanditiis nemo ab?
      Ab, optio. At inventore mollitia exercitationem asperiores totam officiis, quas aliquid, molestiae necessitatibus deleniti perspiciatis nemo distinctio suscipit excepturi eos aperiam voluptas dolorem qui accusamus tenetur illo architecto corporis. Quos.
      Voluptates reprehenderit deserunt provident dolore sed veniam eligendi magnam illum atque. Quibusdam dicta minima ut consectetur molestiae! Placeat voluptas temporibus ab harum ratione obcaecati optio consequatur dolor quisquam, consequuntur quos!
      Minus harum natus, vero, tempore doloremque quia deserunt dolorem nemo omnis in minima, pariatur explicabo repellendus ipsum asperiores. Voluptatibus esse cum sunt expedita quis error architecto eaque corrupti voluptatem at.
      " />
    
    
      <SkillsContainer />
      
      <Experience experience={[ { date: '2013-2014', info: { company: 'Google', job: 'Front-end developer / php programmer', description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor' } }, { date: '2012', info: { company: 'Twitter', job: 'Web developer', description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor' } } ]} />
      <Feedback feedback={[ {feedback: ' Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor', reporter: { photoUrl: './user.jpg', name: 'John Doe', citeUrl: 'https://www.citeexample.com' } }, {feedback: ' Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor', reporter: { photoUrl: './user.jpg', name: 'John Doe', citeUrl: 'https://www.citeexample.com' } } ]} />
      <Info info="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor." />
      
      
      <Portfolio/>
      <Timeline timeline={[ { "date": "2001", "title": "Title 0", "text": "Elit voluptate ad nostrud laboris. Elit incididunt mollit enim enim id id laboris dolore et et mollit. Mollit adipisicing ullamco exercitation ullamco proident aute enim nisi. Dolore eu fugiat consectetur nulla sunt Lorem ex ad. Anim eiusmod do tempor fugiat minim do aliqua amet ex dolore velit.\r\n" }, { "date": "2000", "title": "Title 1", "text": "Et irure culpa ad proident labore excepteur elit dolore. Quis commodo elit culpa eiusmod dolor proident non commodo excepteur aute duis duis eu fugiat. Eu duis occaecat nulla eiusmod non esse cillum est aute elit amet cillum commodo.\r\n" }, { "date": "2012", "title": "Title 2", "text": "Labore esse tempor nisi non mollit enim elit ullamco veniam elit duis nostrud. Enim pariatur ullamco dolor eu sunt ad velit aute eiusmod aliquip voluptate. Velit magna labore eiusmod eiusmod labore amet eiusmod. In duis eiusmod commodo duis. Exercitation Lorem sint do aliquip veniam duis elit quis culpa irure quis nulla. Reprehenderit fugiat amet sint commodo ex.\r\n" },{ "date": "2001", "title": "Title 0", "text": "Elit voluptate ad nostrud laboris. Elit incididunt mollit enim enim id id laboris dolore et et mollit. Mollit adipisicing ullamco exercitation ullamco proident aute enim nisi. Dolore eu fugiat consectetur nulla sunt Lorem ex ad. Anim eiusmod do tempor fugiat minim do aliqua amet ex dolore velit.\r\n" },{ "date": "2001", "title": "Title 0", "text": "Elit voluptate ad nostrud laboris. Elit incididunt mollit enim enim id id laboris dolore et et mollit. Mollit adipisicing ullamco exercitation ullamco proident aute enim nisi. Dolore eu fugiat consectetur nulla sunt Lorem ex ad. Anim eiusmod do tempor fugiat minim do aliqua amet ex dolore velit.\r\n" },{ "date": "2001", "title": "Title 0", "text": "Elit voluptate ad nostrud laboris. Elit incididunt mollit enim enim id id laboris dolore et et mollit. Mollit adipisicing ullamco exercitation ullamco proident aute enim nisi. Dolore eu fugiat consectetur nulla sunt Lorem ex ad. Anim eiusmod do tempor fugiat minim do aliqua amet ex dolore velit.\r\n" } ]} />
    
    
    </Providers>
    
  );
}
