import type { Certification, Experience } from "@/interfaces/resume";

/**
 * Datos del CV transcritos de `portfolio.md` (la fuente humana vive en la
 * raíz del repo). Estáticos y server-side: no hay fetch ni Prisma detrás,
 * por eso son un módulo de datos y no una server action.
 */
export const professionalExperience: Experience[] = [
  {
    role: "Software Engineer",
    company: "EPAM Systems",
    period: "August 2025 – Present",
    bullets: [
      "Developed the Web Check-In and Seat Map pages for an airline company as part of a (3-2)-member frontend development team, enhancing user experience for seamless online check-in and intuitive seat selection.",
      "Developed and implemented new frontend features based on client requirements using React, TypeScript, Redux Saga, Material UI and React Hook Form.",
      "Resolved bugs in newly developed features and the existing codebase to ensure functionality and performance.",
      "Actively participated in Scrum / Scrumban ceremonies to provide updates and collaborate with cross-functional team members.",
      "Provided suggestions to enhance functionality and UI in the applications.",
      "Patched vulnerabilities reported by libraries and source code.",
      "Integrated RUM scripts and business events to track users' actions.",
      "Used AI to complete user stories and other activities (documenting, unit testing, etc.).",
      "Provided ongoing support and maintenance for two core enterprise applications.",
    ],
    technologies: [
      "React",
      "JavaScript",
      "TypeScript",
      "Redux Saga",
      "Material UI",
      "CSS",
      "SCSS",
    ],
  },
  {
    role: "JavaScript Intern",
    company: "EPAM Systems",
    period: "May 2025 – August 2025 (4 months)",
    bullets: [
      "Participated in a Front-End development course program, building a full course application integrated with a provided Back-End.",
      "Applied React, Tailwind CSS, Redux, React Toastify and Zod/React Hook Form in practical project work.",
      "Collaborated with mentors for regular feedback, refining coding skills through practical tasks in a multicultural environment.",
      "Completed English proficiency and soft skills courses to enhance communication abilities.",
    ],
    technologies: [
      "React",
      "Tailwind CSS",
      "Redux",
      "React Toastify",
      "Zod",
      "React Hook Form",
    ],
  },
  {
    role: "JavaScript Intern",
    company: "EPAM Systems",
    period: "December 2023 – April 2024 (5 months)",
    bullets: [
      "Completed front-end development training covering HTML, CSS, JavaScript and React with Agile methodologies.",
      "Developed and maintained user interfaces ensuring cross-browser compatibility and optimized performance.",
      "Implemented reusable components and frameworks; conducted unit testing with Jest for quality assurance.",
      "Gained expertise in Git, Node.js, CSS preprocessors, AJAX and browser optimization techniques.",
    ],
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Jest",
      "Git",
      "Node.js",
    ],
  },
];

export const certifications: Certification[] = [
  {
    title: "Claude Certified Architect – Foundations",
    issuer: "Anthropic",
    period: "September 2026 – September 2027",
    status: "Active, Authorized",
    url: "https://www.credly.com/badges/051213db-6403-434d-9b9e-cadb6a961e1a/public_url",
  },
];
