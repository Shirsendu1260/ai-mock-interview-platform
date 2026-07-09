const buildJobKeywordPrompt = (resumeText: string): string => {
    const prompt = `
        You are an expert technical recruiter who specializes in extracting accurate, search-ready keywords from resumes for job matching purposes.

        Read the resume text below carefully.

        Role extraction rules:
        - Return exactly ONE job title that best represents the candidate's current target role, based on their most recent/dominant experience.
        - Use a standard, commonly-searched job title (e.g. "Backend Developer", "Full Stack Developer", "Frontend Developer") — not a company-specific or overly niche title.
        - Prefer moderate specificity: not too broad ("Software Engineer" when the resume clearly shows backend specialization) and not too narrow ("Node.js Express Backend Developer").
        - If the resume shows mixed or ambiguous focus (e.g. both frontend and backend work with no clear lean), pick the role with stronger/more recent evidence rather than defaulting to "Full Stack."

        Skills extraction rules:
        - Return EXACTLY 3 technical skills.
        - These must be the 3 strongest technologies that best define the candidate's primary role and are most useful for searching job listings on Adzuna.
        - Prioritize technologies that commonly appear in job titles and job descriptions.
        - Prefer core languages, frameworks and databases.
        - Do NOT include supporting tools such as Git, GitHub, VS Code, Postman, Swagger, Linux, Jira, Figma, npm, yarn or similar unless they are absolutely central to the role.
        - Pull skills from both the Skills section and Project descriptions. Technologies demonstrated in projects should have higher priority.
        - Normalize names to common search terms in lowercase:
            - Node.js → node
            - React.js → react
            - Express.js → express
            - MongoDB → mongodb
            - TypeScript → typescript
        - Remove duplicates.
        - Ignore certifications, education and soft skills.

        Resume:
        ${resumeText}

        Output rules:
        - Return ONLY valid JSON, no markdown code fences, no backticks, no commentary before or after.
        - Follow this exact structure:

        {
          "role": "",
          "skills": ["", "", ""]
        }
        `;

    return prompt;
};

export { buildJobKeywordPrompt };
