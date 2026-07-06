import type { IInterviewEvaluationResult, AnswerDataOfQuestion, IErrorMessage } from '../../types/types.js';
import Joi from 'joi';
import { ApiError } from '../../utils/ApiError.js';
import { gemini } from './aiEngine.js';
import { buildInterviewEvaluationPrompt } from './prompts/evaluation.prompt.js';

const evaluateInterview = async (
    answers: AnswerDataOfQuestion[]
): Promise<IInterviewEvaluationResult> => {
    // const questionWiseEvaluation = answers.map(() => ({
    //     feedback: 'Good answer. Try explaining more clearly.',
    //     score: 7
    // }));

    // const evaluationResult: IInterviewEvaluationResult = {
    //     questions: questionWiseEvaluation,
    //     strengths: 'Good understanding of backend.',
    //     weaknesses: 'Could improve error handling.',
    //     suggestions: 'Practice writing cleaner code.',
    //     overallFeedback: 'Overall a good performance.',
    //     overallScore: 70
    // };

    const prompt = buildInterviewEvaluationPrompt(answers);

    const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',

        contents: prompt,

        config: {
            responseMimeType: 'application/json',

            responseSchema: {
                type: 'object',
                properties: {
                    questions: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                feedback: { type: 'string' },
                                score: { type: 'integer' }
                            },
                            required: ['feedback', 'score']
                        }
                    },
                    strengths: { type: 'string' },
                    weaknesses: { type: 'string' },
                    suggestions: { type: 'string' },
                    overallFeedback: { type: 'string' },
                    overallScore: { type: 'integer' }
                },
                required: [
                    'questions',
                    'strengths',
                    'weaknesses',
                    'suggestions',
                    'overallFeedback',
                    'overallScore'
                ]
            },

            temperature: 0.3
        }
    });

    const text = response.text;

    if(!text) {
        throw new ApiError(500, 'AI returned an empty evaluation.');
    }

    let parsedResponse: IInterviewEvaluationResult;
    try {
        parsedResponse = JSON.parse(text);
    }
    catch {
        throw new ApiError(500, 'AI returned invalid JSON.');
    }

    const validatorSchema = Joi.object({
        questions: Joi.array()
                        .items(
                            Joi.object({
                                feedback: Joi.string()
                                                .trim()
                                                .min(3)
                                                .max(1000)
                                                .required(),
                                score: Joi.number()
                                            .integer()
                                            .min(0)
                                            .max(10)
                                            .required()
                            })
                        )
                        .length(answers.length)
                        .required(),
        strengths: Joi.string()
                        .trim()
                        .min(5)
                        .max(1500)
                        .required(),
        weaknesses: Joi.string()
                        .trim()
                        .min(5)
                        .max(1500)
                        .required(),
        suggestions: Joi.string()
                        .trim()
                        .min(5)
                        .max(1500)
                        .required(),
        overallFeedback: Joi.string()
                            .trim()
                            .min(5)
                            .max(2000)
                            .required(),
        overallScore: Joi.number()
                            .integer()
                            .min(0)
                            .max(100)
                            .required()
    });

    const { error, value } = validatorSchema.validate(
        parsedResponse,
        {
            abortEarly: false,
            stripUnknown: true // Remove unexpected fields if AI ever returns extra properties
        }
    );

    let errorsObj: IErrorMessage = {};
    if(error) {
        error.details.forEach(detail => {
            errorsObj[detail.path.join('.')] = detail.message;
        });

        throw new ApiError(500, 'AI response validation failed.', errorsObj);
    }

    const evaluationResult = value as IInterviewEvaluationResult;

    return evaluationResult;
};

export { evaluateInterview };
