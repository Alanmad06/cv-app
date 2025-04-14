import { FontAwesomeIcon  } from "@fortawesome/react-fontawesome"

export default function Address() {

    const contacts = [
        {
            icon: <FontAwesomeIcon icon="envelope" size="lg" />,
            info: "madrigal.saenz.alan@gmail.com"
        },
        {
            icon: <FontAwesomeIcon icon="github" size="lg" />,
            info: "https://github.com/Alanmad06"
        },
        {
            icon: <FontAwesomeIcon icon="gitlab" size="lg" />,
            info: "https://github.com/Alanmad06"
        },
        {
            icon: <FontAwesomeIcon icon="mobile-phone" size="lg" />,
            tile: "Phone",
            info: "(+52) 3321546599"
        }

       

    ]

    return (
        <div className="flex flex-col justify-center items-center w-[100%] m-2 p-2">
            {contacts.map((contact, index) => (
                <div key={index} className="flex flex-col my-2 items-center">
                    <div className="flex flex-row gap-2 items-center text-main">
                        {contact.icon}
                        <div className="pl-2">
                            {contact.tile ? <p className="font-sans text-white">{contact.tile}</p> : ''}
                            <p className="font-sans text-white">{contact.info}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>


    )

}