import { Note } from "./types";

// Simple function to get current time as ISO string
function getCurrentTime(): string {
  return new Date().toISOString();
}

export const staticNotes: Note[] = [
  {
    id: "about-me",
    slug: "about-me",
    title: "about me",
    content: `hi, i'm vanshita medala!

## currently
- application developer at accenture (mumbai)
- allergic to mornings
- debugging code that was definitely written at 3am
- making computers question their life choices
- will trade secrets for burgers`,
    created_at: getCurrentTime(),
    session_id: "",
    emoji: "📍",
    public: true,
    category: "pinned"
  },
  {
    id: "contact",
    slug: "contact", 
    title: "contact",
    content: `- **[email](mailto:vanshitamedala@gmail.com)** - i respond to every email
- **[linkedin](https://linkedin.com/in/vanshitamedala)** - connect with me professionally  
- **[github](https://github.com/vanshitamedala)** - check out my projects and contributions`,
    created_at: getCurrentTime(),
    session_id: "",
    emoji: "📎",
    public: true,
    category: "pinned"
  },
  {
    id: "projects",
    slug: "projects",
    title: "projects",
    content: `## featured projects

### credit card fraud detection
**tech stack**: python, django, mysql, javascript  
[source code](https://github.com/vanshita)

- enhanced fraud detection with machine learning algorithms
- implemented extreme learning method cnns and xg boost
- achieved optimized 99.9% accuracy using three cnn architectures
- outperformed existing methods with low false negative rates

### image encryption decryption
**tech stack**: java  
[source code](https://github.com/vanshita)

- developed secure image data handling tool with xor encryption
- created user-friendly gui for easy image selection and key input
- promotes data security awareness through intuitive design

### student record management
**tech stack**: java swing  
[source code](https://github.com/vanshita)

- developed user-friendly interface for efficient student record management
- added interactive features for adding new students to records
- elevated user experience through intuitive record management`,
    created_at: getCurrentTime(),
    session_id: "",
    emoji: "🚀",
    public: true,
    category: "today"
  },
  {
    id: "experience",
    slug: "experience",
    title: "experience",
    content: `## accenture
**application developer** | jun 2024 – present  
*mumbai, india*

- developing automation solutions and integrating new functionalities into existing systems
- conducting software analysis, programming, testing, and debugging to support project requirements
- collaborating with cross-functional teams to deliver scalable software solutions
- implementing best practices for code quality and system performance optimization

## path creators
**data analysis intern** | jun 2023 – sep 2023  
*hyderabad, india*

- utilized sqlite to create and maintain databases, enhancing data retrieval efficiency by 40%
- performed data processing with numpy, resulting in a 35% reduction in processing time
- contributed to image and video processing using opencv for computer vision applications
- gained hands-on experience with data analysis and machine learning workflows`,
    created_at: getCurrentTime(),
    session_id: "",
    emoji: "💼",
    public: true,
    category: "today"
  },
  {
    id: "education",
    slug: "education",
    title: "education",
    content: `## malla reddy engineering college
**bachelor of technology in computer science**  
**graduated 2024**

### key coursework
- data structures and algorithms
- software engineering
- database management systems
- machine learning and ai
- computer networks
- web development

## fiitjee
**graduated 2020**

## johnson grammar school icse & ib
**graduated 2017**

## achievements & activities
- secured 2-star ranking on codechef
- solved 100+ problems on codechef and leetcode
- member of microsoft ai for earth (top 50 contributors)
- codechef chapter technical team member (2022-2023)
- volunteer service with street cause organisation`,
    created_at: getCurrentTime(),
    session_id: "",
    emoji: "🎓",
    public: true,
    category: "yesterday"
  }
];

export function getAllNotes(): Note[] {
  return staticNotes;
}

export function getNoteBySlug(slug: string): Note | null {
  return staticNotes.find(note => note.slug === slug) || null;
}

export function getPublicNotes(): Note[] {
  return staticNotes.filter(note => note.public);
}
