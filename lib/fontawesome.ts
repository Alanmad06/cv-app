import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronLeft , faAddressCard, faBook, faBriefcase, faComment, faPen, faUser} from '@fortawesome/free-solid-svg-icons';

// Importar los estilos CSS de Font Awesome
import '@fortawesome/fontawesome-svg-core/styles.css';

// Agrega los iconos que necesitas a la biblioteca
library.add([faChevronLeft,faAddressCard, faBook,faBriefcase,faComment,faPen, faUser]);


// Configurar para permitir el uso de iconos por nombre de string
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; // Prevenir Font Awesome de inyectar CSS automáticamente