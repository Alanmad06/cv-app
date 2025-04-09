import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Navigation() {

  const size = 'lg'; // Adjust the size as needed, e.g., 'xs', 'sm', 'md', 'lg', 'x

    const items = [
      
      {
        icon : <FontAwesomeIcon icon="user" size={size} />,
        title: 'About me',
        url: '#about',
      },
      {
        icon : <FontAwesomeIcon icon="book" size={size} />, // Icon
        title: 'Education',
        url: '#education',
      },
      {
        icon : <FontAwesomeIcon icon="pen" size={size} />, // Icon
        title: 'Experience',
        url: '#experience',
      },
      {
        icon : <FontAwesomeIcon icon="briefcase" size={size} />, // Icon
        title : 'Portfolio',
        url : '#portfolio',
      },
      {
        icon : <FontAwesomeIcon icon='address-card' size={size}/>,
        title : 'Contacts',
        url: '#contacts'
      },
      {
        icon : <FontAwesomeIcon icon='comment' size={size}/>,
        title: 'Feedback',
        url : '#feedback'
      }

    ];

  return (
    <nav className="p-2   ">
     {
        items.map((item, index) => (
          <a key={index} href={item.url} className="hover:text-main active:text-main flex flex-row justify-center items-center gap-2 p-4  min-[600px]:justify-start max-[600px]:min-w-[20vw] hover:bg-gray-500 w-[100%] ">
            <i className="">{item.icon}</i>
            <span className="px-4 max-[600px]:hidden" >{item.title}</span>
          </a>
        ))
     }
    </nav>
  );
}