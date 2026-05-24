const { OpenAI } = require('openai');
const mockAiService = require('./mockAiService');

// Initialize OpenAI client if API key is provided
let openai = null;
const apiKey = process.env.OPENAI_API_KEY;

if (apiKey && apiKey.trim() !== '' && !apiKey.includes('your_openai_api_key')) {
  try {
    openai = new OpenAI({ apiKey });
    console.log('🤖 OpenAI API Client initialized successfully.');
  } catch (error) {
    console.error('❌ Error initializing OpenAI API client:', error.message);
  }
} else {
  console.log('💡 OpenAI API Key is not set or placeholder. Falling back to Mock AI Simulator.');
}

const openaiService = {
  analyzeResume: async (resumeText) => {
    if (!openai) {
      console.log('🔌 Running resume analysis using Mock AI Fallback Service.');
      return await mockAiService.analyzeResume(resumeText);
    }

    try {
      const prompt = `
        You are an expert ATS (Applicant Tracking System) parser and senior recruiter.
        Analyze the following extracted text from a candidate's resume and generate a comprehensive evaluation.
        You must return the response in strict JSON format matching this schema:
        {
          "atsScore": 85, (a number between 0 and 100 representing job market compatibility)
          "missingSkills": ["React Native", "TypeScript", "Docker"], (a list of 3-5 standard technical keywords missing from this text)
          "suggestions": ["Add metrics...", "Clarify role titles..."], (a list of 3-4 professional recommendations)
          "improvements": ["Formatting tips...", "Verbs adjustments..."], (a list of 3-4 grammar/action verb improvements)
          "bestRoleSuggestions": ["Frontend Engineer", "Full Stack Developer"] (a list of 2-3 suitable roles)
        }

        RESUME TEXT:
        \"\"\"
        ${resumeText}
        \"\"\"
        
        Ensure your response is pure valid JSON. Do not include any markdown styling like \`\`\`json or trailing symbols.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3
      });

      const responseText = response.choices[0].message.content.trim();
      return JSON.parse(responseText);
    } catch (error) {
      console.error('⚠️ OpenAI Resume Analysis failed or key expired. Falling back to Mock AI:', error.message);
      return await mockAiService.analyzeResume(resumeText);
    }
  },

  generateInterviewQuestions: async (jobType) => {
    if (!openai) {
      console.log(`🔌 Generating questions for "${jobType}" using Mock AI Fallback Service.`);
      return await mockAiService.generateInterviewQuestions(jobType);
    }

    try {
      const prompt = `
        You are a technical interviewer hiring for a "${jobType}" role.
        Generate exactly 5 relevant interview questions for this candidate.
        3 questions should be technical questions (MERN/JavaScript/Design), 1 should be behavioral, and 1 should be communication/problem solving related.
        Return the questions as a strict JSON array matching this schema:
        [
          { "id": 1, "questionText": "Question text here...", "category": "technical" },
          { "id": 2, "questionText": "Question text here...", "category": "technical" },
          ...
        ]
        
        Ensure your response is pure valid JSON. Do not include markdown codeblocks or text outside the JSON.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5
      });

      const responseText = response.choices[0].message.content.trim();
      return JSON.parse(responseText);
    } catch (error) {
      console.error('⚠️ OpenAI Question Generation failed. Falling back to Mock AI:', error.message);
      return await mockAiService.generateInterviewQuestions(jobType);
    }
  },

  evaluateInterview: async (jobType, questions, answers) => {
    if (!openai) {
      console.log(`🔌 Evaluating answers for "${jobType}" using Mock AI Fallback Service.`);
      return await mockAiService.evaluateInterview(jobType, questions, answers);
    }

    try {
      const prompt = `
        You are a senior tech interviewer evaluating a candidate for a "${jobType}" role.
        Here are the questions asked, and the candidate's corresponding typed answers:

        ${questions.map((q, idx) => `
          Q${q.id}: ${q.questionText} (Category: ${q.category})
          A${q.id}: ${answers.find(a => a.questionId === q.id)?.userAnswerText || "No answer provided."}
        `).join('\n')}

        Evaluate the candidate's answers based on technical accuracy, communication quality, confidence, and problem solving.
        Return a comprehensive report in strict JSON format matching this schema:
        {
          "score": 75, (overall rating out of 100)
          "feedback": {
            "technicalScore": 80, (out of 100)
            "communicationScore": 70, (out of 100)
            "confidenceScore": 85, (out of 100)
            "problemSolvingScore": 75, (out of 100)
            "strengths": ["list of 2-3 detailed strengths"],
            "weaknesses": ["list of 1-2 constructive weaknesses"],
            "improvementSuggestions": ["list of 2-3 specific actionable items for study"]
          }
        }

        Ensure the response is pure valid JSON. Do not wrap in markdown or add notes.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4
      });

      const responseText = response.choices[0].message.content.trim();
      return JSON.parse(responseText);
    } catch (error) {
      console.error('⚠️ OpenAI Interview Evaluation failed. Falling back to Mock AI:', error.message);
      return await mockAiService.evaluateInterview(jobType, questions, answers);
    }
  }
};

module.exports = openaiService;
