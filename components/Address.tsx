import { faGithub, faGitlab } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faMobilePhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Address({ id }: { id: string }) {
  const contacts = [
    {
      icon: <FontAwesomeIcon icon={faEnvelope} size="lg" />,
      info: "madrigal.saenz.alan@gmail.com",
    },
    {
      icon: <FontAwesomeIcon icon={faGithub} size="lg" />,
      info: "https://github.com/Alanmad06",
    },
    {
      icon: <FontAwesomeIcon icon={faGitlab} size="lg" />,
      info: "https://gitlab.com/madrigal.saenz.alan",
    },
    {
      icon: <FontAwesomeIcon icon={faMobilePhone} size="lg" />,
      tile: "Phone",
      info: "(+52) 3321546599",
    },
  ];

  return (
    <section
      id={id}
      className="flex w-[100%] flex-col items-start justify-center py-2"
    >
      <h2 className="text-main py-4 font-sans text-xl font-semibold md:text-3xl">
        Contacts
      </h2>
      {contacts.map((contact, index) => (
        <div key={index} className="my-2 flex flex-col">
          <div className="text-main flex flex-row items-center gap-2">
            {contact.icon}
            <div className="pl-2">
              {contact.tile ? (
                <p className="text-foreground font-sans">{contact.tile}</p>
              ) : (
                ""
              )}
              <p className="text-foreground font-sans">{contact.info}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
