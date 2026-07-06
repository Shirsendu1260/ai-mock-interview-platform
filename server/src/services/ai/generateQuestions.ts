import type { IErrorMessage, IGenerateAIQuestionResponse } from "../../types/types.js";
import { ApiError } from "../../utils/ApiError.js";
import { gemini } from "./aiEngine.js";
import { buildQuestionGenerationPrompt } from "./prompts/question.prompt.js";
import Joi from 'joi';

const generateQuestions = async (
    role: string,
    yoe: number,
    difficulty: string,
    qtnsCount: number,
    resumeText: string
): Promise<string[]> => {
    // const qtnsArray = new Array(qtnsCount) // Creates an empty array of 'qtnsCount' length
    //                         .fill(null) // Fill all positions with null, so that .map() can iterate
    //                         .map((_, index) => `Dummy question ${index + 1}`);
    //                         // Iterate over the array and each time creates string 'Dummy question ...'
    //                         // and modifes back to its original postion in the array

    const prompt = buildQuestionGenerationPrompt(role, yoe, difficulty, qtnsCount, resumeText);

    // Ask AI to generate questions
    const response = await gemini.models.generateContent({
        // AI model that is used to generate questions
        model: 'gemini-2.5-flash',

        contents: prompt,

        config: {
            // We want JSON
            responseMimeType: 'application/json',

            // guarantees that the JSON has the exact shape we expect
            responseSchema: {
                type: 'object',
                properties: {
                    questions: {
                        type: 'array',
                        items: {
                            type: 'string'
                        }
                    }
                },
                required: ['questions']
            },

            // This temperature makes response balanced, mostly focused, but with some creativity
            // and variation
            temperature: 0.6
        }
    });

    // Raw JSON string for questions in this format - "{"questions":["...","..."]}"
    const text = response.text;

    if(!text) {
        throw new ApiError(500, 'AI returned an empty response.');
    }

    let parsedResponse: IGenerateAIQuestionResponse;

    try {
        parsedResponse = JSON.parse(text);
    }
    catch {
        throw new ApiError(500, 'AI returned invalid JSON.');
    }

    // Validate AI response
    const validatorSchema = Joi.object({
        questions: Joi.array()
                        .items(
                            Joi.string()
                                .trim()
                                .min(5)
                                .max(1000)
                                .required()
                        )
                        .length(qtnsCount)
                        .required()
                        .messages({
                            'array.base': 'AI returned an invalid questions array.',
                            'array.length': `AI must return exactly ${qtnsCount} questions.`,
                            'any.required': 'Questions array is missing.',
                            'string.base': 'Every question must be a string.',
                            'string.empty': 'Question cannot be empty.',
                            'string.min': 'Question is too short.',
                            'string.max': 'Question is too long.'
                        })
    }).strict();

    const { error, value } = validatorSchema.validate(
        parsedResponse,
        { abortEarly: false }
    );

    let errorsObj: IErrorMessage = {};
    if(error) {
        error.details.forEach(detail => {
            errorsObj[detail.path.join('.') as string] = detail.message;
        });

        throw new ApiError(500, 'AI response validation failed.', errorsObj);
    }

    // Get questions array
    const qtnsArray = value.questions as string[];

    return qtnsArray;
}

export { generateQuestions };
