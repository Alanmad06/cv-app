import { faGithub, faGitlab } from "@fortawesome/free-brands-svg-icons"
import { faEnvelope, faMobilePhone } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon  } from "@fortawesome/react-fontawesome"

export default function Address({id}:{id:string}) {

    const contacts = [
        {
            icon: <FontAwesomeIcon icon={faEnvelope} size="lg" />,
            info: "madrigal.saenz.alan@gmail.com"
        },
        {
            icon: <FontAwesomeIcon icon={faGithub} size="lg" />,
            info: "https://github.com/Alanmad06"
        },
        {
            icon: <FontAwesomeIcon icon={faGitlab} size="lg" />,
            info: "https://gitlab.com/madrigal.saenz.alan"
        },
        {
            icon: <FontAwesomeIcon icon={faMobilePhone} size="lg" />,
            tile: "Phone",
            info: "(+52) 3321546599"
        }

       

    ]

    return (
        <section id={id} className="flex flex-col justify-center items-start w-[100%]  py-2">
            <h2 className="font-semibold text-xl md:text-3xl py-4  font-sans text-main">Contacts</h2>
            {contacts.map((contact, index) => (
                <div key={index} className="flex flex-col my-2 ">
                    <div className="flex flex-row gap-2 items-center text-main">
                        {contact.icon}
                        <div className="pl-2">
                            {contact.tile ? <p className="font-sans text-white">{contact.tile}</p> : ''}
                            <p className="font-sans text-white">{contact.info}</p>
                        </div>
                    </div>
                </div>
            ))}
        </section>


    )

}