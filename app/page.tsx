import Box from "@/components/Box";
import Button from "@/components/Button";
import Experience from "@/components/Experience";
import Feedback from "@/components/Feedback";
import Info from "@/components/Info";
import Navigation from "@/components/Navigation";
import Panel from "@/components/Panel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function Home() {
  return (
    <div>
      <Box title="Hola" content=" Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente laudantium odio ad quia dolores vel minus officiis alias modi culpa cum, quidem ipsum esse incidunt ab similique eum ullam soluta.
      Quas necessitatibus maiores eius quo veritatis quae esse, amet fugit magni ab iusto error! Explicabo aspernatur, sapiente itaque sunt beatae, eos praesentium aliquam ipsa illum vel dolor blanditiis nemo ab?
      Ab, optio. At inventore mollitia exercitationem asperiores totam officiis, quas aliquid, molestiae necessitatibus deleniti perspiciatis nemo distinctio suscipit excepturi eos aperiam voluptas dolorem qui accusamus tenetur illo architecto corporis. Quos.
      Voluptates reprehenderit deserunt provident dolore sed veniam eligendi magnam illum atque. Quibusdam dicta minima ut consectetur molestiae! Placeat voluptas temporibus ab harum ratione obcaecati optio consequatur dolor quisquam, consequuntur quos!
      Minus harum natus, vero, tempore doloremque quia deserunt dolorem nemo omnis in minima, pariatur explicabo repellendus ipsum asperiores. Voluptatibus esse cum sunt expedita quis error architecto eaque corrupti voluptatem at.
      " />

      <Button icon={<FontAwesomeIcon icon="chevron-left" size="xs" />} text="Atrás" color="main" />
      <Experience experience={[ { date: '2013-2014', info: { company: 'Google', job: 'Front-end developer / php programmer', description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor' } }, { date: '2012', info: { company: 'Twitter', job: 'Web developer', description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor' } } ]} />
      <Feedback feedback={[ {feedback: ' Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor', reporter: { photoUrl: './user.jpg', name: 'John Doe', citeUrl: 'https://www.citeexample.com' } }, {feedback: ' Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor', reporter: { photoUrl: './user.jpg', name: 'John Doe', citeUrl: 'https://www.citeexample.com' } } ]} />
      <Info info="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor." />
      <Navigation/>
      <Panel/>
      
      </div>
      );
}
