import { FontAwesomeIcon  } from "@fortawesome/react-fontawesome"
import { faGithub, faGitlab } from '@fortawesome/free-brands-svg-icons'

export default function Address() {

    const contacts = [
        {
            icon: <FontAwesomeIcon icon="envelope" size="lg" />,
            info: "madrigal.saenz.alan@gmail.com"
        },
        {
            icon: <FontAwesomeIcon icon={faGithub} size="lg" />,
            info: "https://github.com/Alanmad06"
        },
        {
            icon: <FontAwesomeIcon icon={faGitlab} size="lg" />,
            info: "https://gitlab.com/Alanmad06"
        },
        {
            icon: <FontAwesomeIcon icon="mobile-phone" size="lg" />,
            tile: "Phone",
            info: "(+52) 3321546599"
        }

       

    ]

    return (
        <div className="flex flex-col justify-center items-center w-[100%] m-2 p-2">
            <div  className="flex flex-col ">
            {contacts.map((contact, index) => (
                
                    <div key={index} className="flex flex-row m-2 gap-2  text-main">
                        {contact.icon}
                        <div className="pl-2">
                            {contact.tile ? <p className="font-sans text-white">{contact.tile}</p> : ''}
                            <p className="font-sans text-white">{contact.info}</p>
                        </div>
                    </div>
                
            ))}
            </div>
        </div>


    )

}