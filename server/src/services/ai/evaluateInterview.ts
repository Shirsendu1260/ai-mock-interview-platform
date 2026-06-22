import type { IInterviewEvaluationResult, AnswerDataOfQuestion } from '../../types/types.js';

const evaluateInterview = async (
    answers: AnswerDataOfQuestion[]
): Promise<IInterviewEvaluationResult> => {
    // Gemini call will be here

    const questionWiseEvaluation = answers.map(() => ({
        feedback: 'Good answer. Try explaining more clearly.',
        score: 8
    }));

    const evaluationResult: IInterviewEvaluationResult = {
        questions: questionWiseEvaluation,
        strengths: 'Good understanding of backend.',
        weaknesses: 'Could improve error handling.',
        suggestions: 'Practice writing cleaner code.',
        overallFeedback: 'Overall a good performance.',
        overallScore: 80
    };

    return evaluationResult;
};

export { evaluateInterview };
