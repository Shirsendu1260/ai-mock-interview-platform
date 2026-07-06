// Prompt that will be sent to AI for question generation
export const buildQuestionGenerationPrompt = (
    role: string,
    yoe: number,
    difficulty: string,
    qtnsCount: number,
    resumeText: string
) => {
    const prompt = `
        You are an expert technical interviewer conducting a real screening interview.

        Generate exactly ${qtnsCount} interview questions for the candidate below.

        Candidate Information:
        - Role: ${role}
        - Years of Experience: ${yoe}
        - Difficulty: ${difficulty}
        - Resume: ${resumeText}

        Difficulty calibration:
        - "easy" = fundamentals and definitions appropriate for ${yoe} years of experience
        - "medium" = applied scenarios, trade-offs, debugging reasoning
        - "hard" = system design, edge cases, architecture decisions, performance trade-offs
        Calibrate strictly against ${yoe} — do not ask senior-level system design questions to a candidate with under 2 years experience, and do not ask trivial syntax questions to a senior candidate.

        Resume usage rules:
        - Only reference technologies, projects, or claims that are explicitly present in ${resumeText}.
        - Do NOT invent or assume skills, companies, or projects not mentioned in the resume.
        - If the resume is sparse, vague, or low-quality, rely more heavily on ${role} and ${yoe} to generate standard technical questions, and use whatever resume content is usable for personalization.
        - At least 50% of questions should directly reference specific resume content (a named project, listed technology, or claimed responsibility).

        Question composition rules:
        - Distribute questions across: language/framework fundamentals, applied problem-solving, and resume-specific deep dives.
        - Do not cluster more than 2 questions around the same single technology unless ${qtnsCount} is small (3 or fewer).
        - Ask only technical interview questions. Do not ask HR, behavioral, or culture-fit questions.
        - Do not repeat similar questions in different phrasing.

        Output rules:
        - Do not number the questions.
        - Do not include explanations, preambles, or commentary.
        - Return ONLY valid JSON, with no markdown code fences, no backticks, and no text before or after the JSON object.

        Expected JSON format:
        {
          "questions": [
            "...",
            "...",
            "..."
          ]
        }`;

    return prompt;
};
