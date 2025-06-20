import { InterviewQuestion } from './types';

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 1,
    question: "Can you explain the difference between client-side and server-side rendering in web development?",
    expectedTopics: ["CSR", "SSR", "performance", "SEO", "JavaScript"]
  },
  {
    id: 2,
    question: "How would you optimize a web application's performance?",
    expectedTopics: ["caching", "minification", "compression", "CDN", "lazy loading"]
  },
  {
    id: 3,
    question: "Explain the concept of RESTful APIs and their principles.",
    expectedTopics: ["REST", "HTTP methods", "stateless", "resources", "JSON"]
  },
  {
    id: 4,
    question: "What are the key differences between React hooks and class components?",
    expectedTopics: ["hooks", "useState", "useEffect", "lifecycle", "functional components"]
  },
  {
    id: 5,
    question: "How do you handle state management in a large React application?",
    expectedTopics: ["Redux", "Context API", "Zustand", "state management", "props drilling"]
  },
  {
    id: 6,
    question: "Explain the concept of responsive web design and how you implement it.",
    expectedTopics: ["media queries", "flexbox", "grid", "mobile-first", "breakpoints"]
  },
  {
    id: 7,
    question: "What is the difference between SQL and NoSQL databases? When would you use each?",
    expectedTopics: ["relational", "document", "scaling", "ACID", "consistency"]
  },
  {
    id: 8,
    question: "How do you ensure web accessibility in your applications?",
    expectedTopics: ["WCAG", "ARIA", "semantic HTML", "screen readers", "keyboard navigation"]
  },
  {
    id: 9,
    question: "Explain the concept of microservices architecture.",
    expectedTopics: ["microservices", "distributed systems", "API gateway", "containers", "scalability"]
  },
  {
    id: 10,
    question: "How do you approach testing in web development?",
    expectedTopics: ["unit testing", "integration testing", "Jest", "testing library", "TDD"]
  }
];

export const BUDGET_CONSTRAINTS = {
  MAX_BASE_SALARY: 300000,
  MAX_BONUS: 50000,
  MAX_BENEFITS: 50000,
  get MAX_TOTAL() {
    return this.MAX_BASE_SALARY + this.MAX_BONUS + this.MAX_BENEFITS;
  }
};

export const JOB_DESCRIPTION = {
  title: "Senior Full Stack Web Developer",
  department: "Engineering",
  location: "San Francisco, CA / Remote",
  description: "We are looking for a Senior Full Stack Web Developer to join our engineering team. The ideal candidate will have extensive experience in modern web technologies, strong problem-solving skills, and the ability to work in a fast-paced environment."
}; 