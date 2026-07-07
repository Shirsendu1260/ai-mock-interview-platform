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
        - Return at most 16 technical skills, ordered from most important/most demonstrated to least — the order matters, put the strongest signals first.
        - Pull skills from BOTH the skills section AND the project descriptions. Skills demonstrated in actual project work should be weighted as more reliable than skills only listed in a standalone skills list with no supporting evidence elsewhere in the resume.
        - Normalize skill names to their commonly-searched form (e.g. "ReactJS" / "React.js" → "React", "NodeJS" → "Node.js", "JS" → "JavaScript"). Use the most standard, job-listing-friendly spelling.
        - Do not include duplicate or near-duplicate skills (e.g. do not list both "Node" and "Node.js" — pick one normalized form).
        - Ignore soft skills (e.g. "communication", "teamwork", "leadership").
        - Ignore certifications.
        - Ignore education/degrees.
        - Only include technical skills: languages, frameworks, libraries, databases, tools, and platforms.

        If the resume text is sparse, unclear, or low-quality, extract the best possible answer from whatever signal is available rather than returning empty values.

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
