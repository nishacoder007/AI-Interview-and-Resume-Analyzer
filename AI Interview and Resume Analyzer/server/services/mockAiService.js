// High-fidelity Mock AI Engine fallback for Offline / Demo mode when OpenAI API key is not configured

const JOB_QUESTIONS = {
  "MERN Stack Developer": [
    { id: 1, questionText: "Can you explain the differences between virtual DOM and real DOM in React, and how React handles state updates?", category: "technical" },
    { id: 2, questionText: "How do you secure JWT authentication in a MERN stack application, and where should you store the token on the client-side?", category: "technical" },
    { id: 3, questionText: "Describe the role of middleware in Express.js. How would you write a custom error-handling middleware?", category: "technical" },
    { id: 4, questionText: "What are some indexing strategies in MongoDB to optimize slow-running queries, and how does Mongoose support them?", category: "technical" },
    { id: 5, questionText: "Tell me about a challenging bug you faced in a React or Node project, how you diagnosed it, and what you learned.", category: "behavioral" }
  ],
  "Frontend Developer": [
    { id: 1, questionText: "What is CSS Flexbox and Grid, and how do you decide which layout method to use for a responsive dashboard?", category: "technical" },
    { id: 2, questionText: "Explain the concept of React Hooks (like useState, useEffect, and useMemo) and how they manage component lifecycles.", category: "technical" },
    { id: 3, questionText: "What is client-side routing, and how does React Router work under the hood without refreshing the browser?", category: "technical" },
    { id: 4, questionText: "How do you optimize web app performance, particularly around large bundle sizes, images, and heavy CSS frameworks?", category: "technical" },
    { id: 5, questionText: "How do you collaborate with UX designers and backend developers when building frontend components with shifting specifications?", category: "communication" }
  ],
  "Backend Developer": [
    { id: 1, questionText: "Describe RESTful API design principles. What HTTP methods and status codes are appropriate for standard CRUD operations?", category: "technical" },
    { id: 2, questionText: "How does Node.js handle concurrency and async tasks internally via the Event Loop, and why is it single-threaded?", category: "technical" },
    { id: 3, questionText: "Explain database normalization versus denormalization. In what scenarios would you choose MongoDB over SQL databases like PostgreSQL?", category: "technical" },
    { id: 4, questionText: "How do you approach writing comprehensive unit tests and integration tests for Express routes and database connections?", category: "technical" },
    { id: 5, questionText: "How do you ensure server reliability under sudden spikes in high-volume traffic?", category: "behavioral" }
  ],
  "HR Round": [
    { id: 1, questionText: "Tell me about yourself, your career path, and why you are interested in joining our company.", category: "communication" },
    { id: 2, questionText: "Describe a situation where you had a conflict with a team member. How did you handle it and what was the outcome?", category: "behavioral" },
    { id: 3, questionText: "Where do you see yourself in five years, and what technical skills are you actively aiming to master next?", category: "communication" },
    { id: 4, questionText: "How do you handle tight deadlines and prioritize tasks when multiple features are due simultaneously?", category: "behavioral" },
    { id: 5, questionText: "Why should we hire you over other candidates? What unique value do you bring to our collaborative team?", category: "communication" }
  ]
};

const DEFAULT_QUESTIONS = [
  { id: 1, questionText: "Explain your experience with modern JavaScript (ES6+), HTML, and CSS fundamentals.", category: "technical" },
  { id: 2, questionText: "How do you handle API state management and cross-origin resource sharing (CORS) in client-server projects?", category: "technical" },
  { id: 3, questionText: "What is your Git branching strategy when working on shared features with teammates?", category: "technical" },
  { id: 4, questionText: "Describe a time when you received constructive feedback. How did you adapt your code or workflow?", category: "behavioral" },
  { id: 5, questionText: "How do you keep your technical skills sharp and up-to-date with fast-moving web standards?", category: "communication" }
];

const mockAiService = {
  analyzeResume: async (resumeText = "") => {
    // Delay slightly to simulate AI API call latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowercaseText = resumeText.toLowerCase();
    
    // Check keywords to compute a dynamic mock ATS score
    let score = 60; // Base score
    const keywords = {
      react: 8,
      node: 7,
      express: 6,
      mongodb: 6,
      javascript: 5,
      redux: 5,
      tailwind: 4,
      git: 3,
      typescript: 6,
      docker: 5,
      aws: 5
    };

    const foundSkills = [];
    const missingSkills = [];

    Object.entries(keywords).forEach(([skill, weight]) => {
      if (lowercaseText.includes(skill)) {
        score += weight;
        foundSkills.push(skill.toUpperCase());
      } else {
        missingSkills.push(skill.toUpperCase());
      }
    });

    if (score > 98) score = 98; // Caps out nicely
    if (score < 45) score = 55; // Lower boundary feels supportive

    // Generate smart recommendations based on score
    const suggestions = [
      "Add direct quantitative metrics (e.g., 'Improved database speed by 35%' instead of 'Optimized backend database').",
      "Ensure contact information (GitHub, LinkedIn) is placed prominently at the top header.",
      "Expand descriptions of collaborative tools like Git, Docker, and CI/CD pipelines to pass automated filters."
    ];

    const improvements = [
      "Revise grammatical action verbs (use 'Implemented', 'Architected', 'Orchestrated' instead of 'responsible for').",
      "Structure sections cleanly with professional styling - avoid double spaces and irregular margins.",
      "Include a dedicated Technical Skills grid near the top for quick scanner parsing."
    ];

    const bestRoles = [];
    if (lowercaseText.includes("react") || lowercaseText.includes("frontend")) {
      bestRoles.push("Frontend Developer");
    }
    if (lowercaseText.includes("node") || lowercaseText.includes("express") || lowercaseText.includes("backend")) {
      bestRoles.push("Backend Engineer");
    }
    if (bestRoles.length === 2) {
      bestRoles.unshift("MERN Stack Developer");
      bestRoles.push("Full Stack Developer");
    }
    if (bestRoles.length === 0) {
      bestRoles.push("Software Engineer", "Web Developer");
    }

    return {
      atsScore: Math.round(score),
      missingSkills: missingSkills.length > 0 ? missingSkills.slice(0, 4) : ["TYPESCRIPT", "DOCKER"],
      suggestions: suggestions,
      improvements: improvements,
      bestRoleSuggestions: bestRoles
    };
  },

  generateInterviewQuestions: async (jobType = "MERN Stack Developer") => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return JOB_QUESTIONS[jobType] || JOB_QUESTIONS["MERN Stack Developer"] || DEFAULT_QUESTIONS;
  },

  evaluateInterview: async (jobType, questions, answers) => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    let totalScore = 65; // Base grade
    let technicalCount = 0;
    let detailPoints = 0;

    answers.forEach(ans => {
      const text = ans.userAnswerText || "";
      // Give points for longer, structured answers
      if (text.length > 80) detailPoints += 4;
      if (text.length > 180) detailPoints += 4;
      
      // Look for technical buzzwords
      const lower = text.toLowerCase();
      const keywords = ["virtual dom", "token", "state", "middleware", "index", "schema", "optimize", "secure", "hook", "component", "async", "promise", "lifecycle", "flexbox", "grid", "database", "git", "event loop"];
      keywords.forEach(kw => {
        if (lower.includes(kw)) {
          technicalCount += 2;
        }
      });
    });

    totalScore += detailPoints + Math.min(technicalCount, 20);
    if (totalScore > 96) totalScore = 96;
    if (totalScore < 50) totalScore = 55;

    // Split scores dynamically
    const technicalScore = Math.min(Math.round(totalScore + (Math.random() * 4 - 2)), 100);
    const communicationScore = Math.min(Math.round(totalScore + (Math.random() * 6 - 3) + 2), 100);
    const confidenceScore = Math.min(Math.round(totalScore + (Math.random() * 8 - 4) + 1), 100);
    const problemSolvingScore = Math.min(Math.round(totalScore + (Math.random() * 6 - 3) - 1), 100);

    const strengths = [
      "Demonstrates solid conceptual knowledge of MERN stack routing and database schema design.",
      "Good structure in verbal descriptions of technical debugging procedures.",
      "Consistently attempts to explain practical trade-offs (e.g., state vs props, SQL vs NoSQL)."
    ];

    const weaknesses = [];
    const suggestions = [];

    if (detailPoints < 15) {
      weaknesses.push("Responses were somewhat brief. AI-powered filters prefer specific examples and detailed architectures.");
      suggestions.push("Focus on the STAR method (Situation, Task, Action, Result) to make responses more descriptive.");
    } else {
      weaknesses.push("Descriptions of production deployment optimizations (e.g., CDN, indexing cache) could be deeper.");
      suggestions.push("Describe scaling techniques (e.g., Redis caching, database replication) to impress senior interviewers.");
    }

    if (technicalCount < 8) {
      weaknesses.push("Missing domain-specific keywords and core operational terminology in explanations.");
      suggestions.push("Explicitly name Hooks, methods, Express status codes, and DB operations instead of using general terms.");
    } else {
      weaknesses.push("Minor blurriness in explaining internal JavaScript concurrency (Event Loop phases).");
      suggestions.push("Perfect the definitions of microtasks vs macrotasks inside the Event Loop.");
    }

    return {
      score: Math.round((technicalScore + communicationScore + confidenceScore + problemSolvingScore) / 4),
      feedback: {
        technicalScore,
        communicationScore,
        confidenceScore,
        problemSolvingScore,
        strengths,
        weaknesses,
        improvementSuggestions: suggestions
      }
    };
  }
};

module.exports = mockAiService;
