// Project Data Structure
// To add a new project, copy the template below and fill in your details

const projects = [
  {
    id: 1,
    title: "Nuria",
    category: "E-Commerce",
    description:
      "Nuria is a fully-featured e-commerce platform allowing users to browse, purchase, and sell used uniform online. It provides seamless shopping experiences with a focus on user-friendly navigation and responsive design.",
    techStack: ["React", "Firebase"],
    image: "/nuria.png",
    url: "https://nuria.web.app/",
    github: "https://github.com/saruni-spec/2Hand",
    featured: false, // Changed to false as other projects are more recent/complex
  },
  {
    id: 2,
    title: "Brian Technologies",
    category: "Catalog",
    description:
      "This catalog site is designed for Brian Technologies, showcasing their products and services. It features an easy-to-navigate product catalog to explore the business's offerings.",
    techStack: ["HTML", "CSS", "JavaScript"],
    image: "/brian.png",
    url: "https://briantech.web.app/",
    github: null,
    featured: false,
  },
  {
    id: 3,
    title: "Wise Fool",
    category: "Blog",
    description:
      "Wise Fool is a personal blog site where I write about philosophy, psychology, science with a twist of humor and irony. The platform allows easy content management and publishing.",
    techStack: ["Python", "Flask", "SQLite", "HTML", "CSS"],
    image: "/fool.png",
    url: "https://wisefool.xyz",
    github: "https://github.com/saruni-spec/TheFool",
    featured: false,
  },
  {
    id: 4,
    title: "Kick Off Challenge",
    category: "Sports",
    description:
      "Kick Off Challenge is a web app that compares football fixtures, providing head-to-head statistics and showcasing teams' progress over time. It includes dynamic data visualization and real-time updates.",
    techStack: ["Next.js"],
    image: "/kickoff.png",
    url: "https://kickoff-challenge-football.web.app/",
    github: "https://github.com/saruni-spec/kickoff",
    featured: false,
  },
  {
    id: 5,
    title: "School Management System",
    category: "Management",
    description:
      "A school management system designed to simplify the process of managing student records, tracking academic performance, and monitoring school activities.",
    techStack: ["Python", "Django"],
    image: "/placeholder-school.png", // Add your image
    url: null,
    github: "https://github.com/saruni-spec/school",
    featured: false,
  },
  {
    id: 6,
    title: "Dairy Management",
    category: "Management",
    description:
      "A business management system for a dairy business to track payments and sales, manage milk stock, and monitor the overall performance of the business.",
    techStack: ["Python", "Django"],
    image: "/placeholder-dairy.png", // Add your image
    url: null,
    github: "https://github.com/saruni-spec/boss1",
    featured: false,
  },
  {
    id: 7,
    title: "MetroBus Booking App",
    category: "Mobile",
    description:
      "MetroBus Booking App is designed to simplify the process of booking bus rides in a busy metropolitan area. Whether you're commuting, heading to an appointment, or exploring the city, this app makes it easy to find and book bus rides in real-time.",
    techStack: ["React Native"],
    image: "/placeholder-metro.png", // Add your image
    url: null,
    github: "https://github.com/saruni-spec/Metro",
    featured: false,
  },
  {
    id: 8,
    title: "Smart Travel",
    category: "Web App",
    description:
      "Smart Travel is a website designed to simplify the process of booking bus rides in a busy metropolitan area.",
    techStack: ["HTML", "CSS", "JavaScript"],
    image: "/placeholder-travel.png", // Add your image
    url: null,
    github: "https://github.com/saruni-spec/SmartTravel",
    featured: false,
  },
  {
    id: 9,
    title: "Reform",
    category: "Web App",
    description:
      "A platform focused on social reform initiatives and community engagement.",
    techStack: ["React", "Node.js"],
    image: "/placeholder-reform.png", // Add your image
    url: null,
    github: "https://github.com/saruni-spec/witness",
    featured: false,
  },
  {
    id: 10,
    title: "WhatsApp Salary Advance App",
    category: "AI/FinTech",
    description:
      "Led the development of a salary advance application accessible directly via WhatsApp flows and a Next.js backend, integrating with KCB Bank's system to simplify access to financial services for employees.",
    techStack: ["Next.js", "WhatsApp Cloud API", "REST API"],
    image: "/placeholder-loan-app.png",
    url: null,
    github: null,
    featured: true, // Featured: Recent work, integrates with KCB, unique platform (WhatsApp)
  },
  {
    id: 11,
    title: "AI-Powered WhatsApp B2B Fish Platform",
    category: "AI/E-Commerce",
    description:
      "Developed a B2B fish management application combining an LLM for chat, WhatsApp flows for data collection, a Node.js backend, and Medusa for e-commerce, containerized with Docker.",
    techStack: ["Node.js", "LLM", "WhatsApp Cloud API", "Medusa", "Docker"],
    image: "/placeholder-fish-b2b.png",
    url: null,
    github: null,
    featured: true, // Featured: Combines AI, B2B, E-commerce, and modern tech (LLM, Docker)
  },
  {
    id: 12,
    title: "Agricultural Mapping & Satellite Imagery App",
    category: "GeoSpatial/Data",
    description:
      "Leveraged mapping and satellite imagery APIs to allow farmers to segment farms and receive crucial data like soil moisture, crop stress, and wind patterns for data-driven planning.",
    techStack: ["Mapping APIs", "Satellite Imagery APIs", "Data Visualization"],
    image: "/placeholder-agri-map.png",
    url: null,
    github: null,
    featured: true, // Featured: Unique application domain (Agriculture), uses GeoSpatial data
  },
  {
    id: 13,
    title: "WhatsApp AI Data Analyst Assistant (PHC)",
    category: "AI/HealthTech",
    description:
      "Designed and implemented an AI-powered WhatsApp agent for a Primary Health Coverage program, integrating with ClickHouse and Superset to provide real-time analytics, conversational data queries, and chart generation for policymakers.",
    techStack: [
      "AI Agent",
      "LangGraph",
      "WhatsApp Cloud API",
      "ClickHouse",
      "Superset",
    ],
    image: "/placeholder-phc-analyst.png",
    url: null,
    github: null,
    featured: false, // Not featured to ensure variety on homepage
  },
  {
    id: 14,
    title: "WhatsApp Health Assistant AI (Chronic Care)",
    category: "AI/HealthTech",
    description:
      "Developing a WhatsApp-based assistant for chronic condition management with medication reminders, vital signs tracking, direct doctor escalation, and a scalable backend using RabbitMQ for reliable asynchronous tasks.",
    techStack: [
      "WhatsApp Cloud API",
      "RabbitMQ",
      "Node.js",
      "Asynchronous Workers",
    ],
    image: "/placeholder-chronic-care.png",
    url: null,
    github: null,
    featured: false, // Not featured to ensure variety on homepage
  },
  {
    id: 15,
    title: "Dairy Management System (SME)",
    category: "Management",
    description:
      "Developed a business management system for a small dairy business to track orders, payments, manage milk stock, and monitor performance, integrating real-time stock and MPESA payment tracking.",
    techStack: ["Python", "Django", "MPESA API", "Reporting Tools"],
    image: "/placeholder-dairy-sme.png",
    url: null,
    github: null, // Assuming this is the same as ID 6 if it's the personal project
    featured: false, // Not featured: Management is already covered by ID 6, ID 12 offers a more unique category.
  },
  {
    id: 16,
    title: "Somanasi Marketing Website",
    category: "Front End/Catalog",
    description:
      "Developed a marketing website for Somanasi, a school management system, outlining its benefits, joining information, and providing contact details.",
    techStack: ["Front End", "React/Next.js (Assumed from skills)"],
    image: "/placeholder-somanasi.png",
    url: null,
    github: null,
    featured: false, // Not featured: Simple marketing site, other projects showcase more complexity
  },
];

// Template for adding new projects:
/*
{
  id: 17, // Increment this number
  title: "Project Name",
  category: "E-Commerce", // Options: E-Commerce, Blog, Catalog, Sports, Management, Mobile, Web App, AI/FinTech, AI/E-Commerce, GeoSpatial/Data, AI/HealthTech
  description: "Detailed description of your project...",
  techStack: ["Tech1", "Tech2", "Tech3"], // Array of technologies used
  image: "/your-image.png", // Path to project image
  url: "https://your-project-url.com", // Live URL or null if not deployed
  github: "https://github.com/username/repo", // GitHub URL or null
  featured: false // Set to true if you want it on homepage
}
*/

// Get all unique categories for filtering
function getCategories() {
  const categories = [...new Set(projects.map((p) => p.category))];
  return ["All", ...categories.sort()];
}

// Filter projects by category
function filterProjects(category) {
  if (category === "All") return projects;
  return projects.filter((p) => p.category === category);
}

// Get featured projects only
function getFeaturedProjects() {
  return projects.filter((p) => p.featured);
}

// Get project by ID
function getProjectById(id) {
  return projects.find((p) => p.id === id);
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    projects,
    getCategories,
    filterProjects,
    getFeaturedProjects,
    getProjectById,
  };
}
