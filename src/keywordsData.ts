import { SamplePreset } from './types';

export const CURATED_KEYWORDS: string[] = [
  // Frontend/Web Dev
  "React", "React.js", "Angular", "Vue", "Vue.js", "Svelte", "SvelteKit", "HTML5", "CSS3", "Tailwind CSS", "Tailwind", 
  "Bootstrap", "Webpack", "Vite", "JavaScript", "ES6", "TypeScript", "Sass", "Redux", "Context API", "Next.js", 
  "Nuxt.js", "Gatsby", "Remix", "Three.js", "D3.js", "Canvas", "SVG", "Webflow", "Shopify", "UI/UX", "UX/UI", "Figma",

  // Backend/API
  "Node.js", "Node", "Express", "Express.js", "NestJS", "FastAPI", "Django", "Flask", "Python", "Ruby on Rails", 
  "Ruby", "PHP", "Laravel", "Java", "Spring Boot", "Spring", "Go", "Golang", "C#", ".NET", "ASP.NET", "GraphQL", 
  "REST API", "RESTful", "WebSockets", "gRPC", "Apollo", "Prisma", "TypeORM", "Mongoose", "Sequelize",

  // Databases/Storage
  "SQL", "MySQL", "PostgreSQL", "Postgres", "SQLite", "Oracle", "SQL Server", "MongoDB", "Redis", "Cassandra", 
  "DynamoDB", "Firestore", "Firebase", "Supabase", "Prisma", "Drizzle", "Neo4j", "Elasticsearch",

  // Cloud & DevOps
  "AWS", "Amazon Web Services", "GCP", "Google Cloud", "Google Cloud Platform", "Azure", "Microsoft Azure", 
  "Docker", "Kubernetes", "Terraform", "Ansible", "CI/CD", "GitHub Actions", "GitLab CI", "CircleCI", "Jenkins", 
  "Linux", "Unix", "Bash", "Nginx", "Apache", "Serverless", "Cloudflare", "Vercel", "Netlify", "Heroku", "Knative",

  // Mobile/Desktop
  "React Native", "Flutter", "Swift", "SwiftUI", "Kotlin", "Java (Android)", "Xamarin", "Electron", "Ionic",

  // Data Science, AI & ML
  "Machine Learning", "ML", "Deep Learning", "Artificial Intelligence", "AI", "Generative AI", "LLM", "OpenAI", 
  "Gemini", "TensorFlow", "PyTorch", "Keras", "Pandas", "NumPy", "Scikit-learn", "SciPy", "Matplotlib", "Seaborn", 
  "Tableau", "Power BI", "R", "Apache Spark", "Hadoop", "NLTK", "OpenCV", "NLP", "Large Language Models",

  // Testing/QA
  "Jest", "Mocha", "Chai", "Cypress", "Playwright", "Selenium", "Puppeteer", "JUnit", "PyTest", "React Testing Library",

  // Methodologies & Professional Skills
  "Agile", "Scrum", "Kanban", "Jira", "Confluence", "Git", "GitHub", "GitLab", "Bitbucket", "Product Management", 
  "Project Management", "SDLC", "Object-Oriented Programming", "OOP", "Microservices", "System Design",

  // Soft Skills
  "Communication", "Collaboration", "Leadership", "Problem Solving", "Time Management", "Teamwork", "Adaptability", 
  "Mentoring", "Client Facing", "Analytical Skills", "Critical Thinking", "Creativity", "Active Listening",

  // Certifications
  "PMP", "CSM", "Certified ScrumMaster", "CISSP", "CompTIA Security+", "CompTIA A+", "CCNA", "OSCP", "CKA", "AWS Certified", "PMI-ACP", "SAFe"
];

export const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at",
  "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can", "can't", "cannot",
  "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few",
  "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll",
  "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll",
  "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most",
  "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our",
  "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't",
  "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there",
  "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too",
  "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what",
  "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with",
  "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves",
  
  // Job posting filler words
  "job", "role", "work", "team", "company", "experience", "skills", "skills", "candidate", "successful", "position",
  "requirements", "responsibilities", "looking", "join", "part", "must", "needed", "needs", "ideal", "opportunity"
]);

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: "frontend",
    title: "✨ React Frontend Developer",
    category: "Software Development",
    text: `About the Role:
We are seeking an outstanding Frontend Developer with 3+ years of professional experience to build highly interactive web applications using React and TypeScript. 

Required Technical Skills:
- Professional experience with React, ES6, and CSS3 / Tailwind CSS is essential.
- Expertise in TypeScript and modern state management, such as Redux or Context API.
- Familiarity with build tools like Vite or Webpack.
- Writing reliable unit tests with Jest and React Testing Library (RTL).
- Strong command of modular layouts, UI/UX principles, and Figma components translation.

Methodologies & Tools:
- Working in an Agile / Scrum framework with tools like Jira and Git / GitHub.
- Excellent communication and collaboration skills to coordinate with cross-functional product teams.
`
  },
  {
    id: "data-science",
    title: "🤖 Python Data Scientist (AI/ML)",
    category: "Data & AI",
    text: `Job Description:
We are looking for a Python Data Scientist to develop advanced machine learning and Generative AI solutions.

Core Responsibilities:
- Design, train, and deploy Machine Learning and Deep Learning models in production.
- Process large scale datasets using Python, Pandas, NumPy, and SQL.
- Implement specialized natural language processing (NLP) models and explore state-of-the-art Large Language Models (LLM) powered by OpenAI or Gemini.
- Visualize data and findings using Tableau, Power BI, or seaborn.

Technical Qualifications:
- M.S. or B.S. in Computer Science, Statistics, or similar quantitative field.
- Mastery of training ML models using TensorFlow or PyTorch and Scikit-learn.
- Strong problem solving abilities, analytical skills, and comfortable with client facing communication.
- AWS Certified cloud architecture or GCP experience is a strong plus.
`
  },
  {
    id: "project-manager",
    title: "📈 Technical Project Manager",
    category: "Management",
    text: `Position: Senior Technical Project Manager
We are in search of an Agile Project Manager to lead several key enterprise software development lifecycles (SDLC).

Key Requirements:
- 5+ years of Project Management experience managing high-performing software development teams.
- Active Project Management Professional (PMP) or Certified ScrumMaster (CSM) credentials are required.
- Expert-level proficiency in Agile methodologies (Scrum, Kanban) and tools like Jira, Confluence, and GitLab.
- Strong background in system design and microservices architecture is helpful to speak with technical architects.
- Exceptional communication, leadership, and conflict resolution skills.
- Track record of leading cross-functional teams in high-pressure delivery environments.
`
  }
];
