import type { AnswerDataOfQuestion } from "../../../types/types.js";

export const buildInterviewEvaluationPrompt = (answers: AnswerDataOfQuestion[]): string => {
    const formattedQuestions = answers.map((item, index) => {
                                            return `
                                                Question ${index + 1}
                                                Question: ${item.question}
                                                Candidate Answer: ${item.answer ?? 'No answer provided.'}
                                            `;
                                        })
                                        .join('\n\n');

    const prompt = `
        You are an expert senior software engineer and technical interviewer known for rigorous, no-nonsense evaluation. You do not grade on effort or confidence — only on technical correctness and depth.

        Evaluate every answer independently, one at a time, before producing any summary.

        For each question, before scoring:
        - Silently identify the key correct concepts/facts the answer should demonstrate, based on your own expert knowledge of the topic (do not output this reasoning, just use it to grade).
        - Check the candidate's answer against those concepts.
        - Note whether the answer is technically correct, partially correct, incorrect, or a valid alternative approach that isn't the "obvious" one but is still technically sound (do not penalize valid alternative approaches).

        Scoring rubric (apply strictly, do not default to the middle):
        - 10 = Fully correct, demonstrates depth beyond the minimum (edge cases, trade-offs, or precise terminology)
        - 8-9 = Fully correct, clear, but lacks extra depth or misses a minor edge case
        - 6-7 = Mostly correct but has a gap, imprecision, or missing justification
        - 4-5 = Partially correct — gets the core idea wrong or right by coincidence, weak reasoning
        - 1-3 = Mostly or entirely incorrect, but an answer was attempted
        - 0 = No answer provided, or answer is completely unrelated to the question

        Scoring discipline:
        - Do not award 6+ to an answer that is vague, generic, or could apply to any question without demonstrating specific knowledge.
        - A confident-sounding but factually wrong answer must be scored as if it were wrong — confidence and fluency do not add points.
        - A correct answer that uses different terminology or a different valid method than expected must still score high — do not penalize for phrasing or approach diversity, only for actual technical error.
        - If an answer is missing, feedback must state exactly: "No answer provided."

        Feedback rules (per question):
        - 1-3 sentences per answer, no more.
        - Feedback must explain WHY the score was given — name the specific gap, error, or missing concept. Do not give generic feedback like "could be more detailed" without saying what detail was missing.
        - Never soften incorrect answers with encouragement ("good attempt but...") — state the error directly, then note anything genuinely salvageable if applicable.
        - Do not repeat the question or the answer back in the feedback — assume it will be displayed alongside the original question, so feedback should read as a standalone comment on quality.

        After evaluating every answer individually, generate a summary:
        - strengths: a single string (2-4 sentences) naming specific technical areas the candidate handled well — only include if genuinely earned by the answers; if nothing stands out, say so plainly instead of manufacturing a strength
        - weaknesses: a single string (2-4 sentences) naming specific technical areas or concepts the candidate struggled with
        - suggestions: a single string (2-4 sentences) with concrete actionable next steps (e.g. "Review X concept," "Practice explaining Y trade-off") — not generic advice like "keep learning"
        - overallFeedback: a single string (2-4 sentences), direct and specific, summarizing the candidate's actual technical level based on the evidence above
        - overallScore: integer 0-100, calculated as the average of all individual question scores scaled to 100 (average of the 0-10 scores × 10) — do not assign this independently or let it diverge from the itemized scores

        Candidate Responses:
        ${formattedQuestions}

        Output rules:
        - Return ONLY valid JSON, no markdown code fences, no backticks, no commentary before or after.
        - Follow this exact structure — the "questions" array must contain one object per candidate response, in the same order as given above, with ONLY "feedback" and "score" fields (do not include the question text or answer text in this array):

        {
          "questions": [
            {
              "feedback": "...",
              "score": 0
            }
          ],
          "strengths": "...",
          "weaknesses": "...",
          "suggestions": "...",
          "overallFeedback": "...",
          "overallScore": 0
        }
    `;

    return prompt;
};
