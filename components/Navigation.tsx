import { faAddressCard, faBook, faBriefcase, faComment, faPen, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Navigation() {

  const size = 'sm'; // Adjust the size as needed, e.g., 'xs', 'sm', 'md', 'lg', 'x

    const items = [
      
      {
        icon : <FontAwesomeIcon icon={faUser} size={size} />,
        title: 'About me',
        url: '#about',
      },
      {
        icon : <FontAwesomeIcon icon={faBook} size={size} />, // Icon
        title: 'Education',
        url: '#education',
      },
      {
        icon : <FontAwesomeIcon icon={faPen} size={size} />, // Icon
        title: 'Experience',
        url: '#experience',
      },
      {
        icon : <FontAwesomeIcon icon={faBriefcase} size={size} />, // Icon
        title : 'Portfolio',
        url : '#portfolio',
      },
      {
        icon : <FontAwesomeIcon icon={faAddressCard} size={size}/>,
        title : 'Contacts',
        url: '#contacts'
      },
      {
        icon : <FontAwesomeIcon icon={faComment} size={size}/>,
        title: 'Feedback',
        url : '#feedback'
      }

    ];

  return (
    <nav className="  ">
     {
        items.map((item, index) => (
          <a key={index} href={item.url} className="hover:text-main   active:text-main flex flex-row justify-center items-center gap-2 py-4  min-[700px]:justify-start  min-[700px]:pl-1 max-[700px]:min-w-[20vw] hover:bg-gray-500 w-[100%] ">
            <i className="">{item.icon}</i>
            <span className="px-4 max-[700px]:hidden font-sm" >{item.title}</span>
          </a>
        ))
     }
    </nav>
  );
}