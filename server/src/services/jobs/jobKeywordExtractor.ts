import Joi from 'joi';
import { ApiError } from '../../utils/ApiError.js';
import type { IErrorMessage, IJobKeywordExtractionResponse } from '../../types/types.js';
import { buildJobKeywordPrompt } from './prompts/jobKeyword.prompt.js';
import { gemini } from '../ai/aiEngine.js';

export const extractJobKeywords = async (resumeText: string): Promise<IJobKeywordExtractionResponse> => {
    const prompt = buildJobKeywordPrompt(resumeText);

    const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash-lite',

        contents: prompt,

        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: 'object',
                properties: {
                    role: { type: 'string' },
                    skills: {
                        type: 'array',
                        items: { type: 'string' }
                    }
                },
                required: ['role', 'skills']
            },
            temperature: 0.2
        }
    });

    const text = response.text;

    if(!text) {
        throw new ApiError(500, 'AI returned empty job keywords.');
    }

    let parsedResponse: IJobKeywordExtractionResponse;
    try {
        parsedResponse = JSON.parse(text);
    }
    catch {
        throw new ApiError(500, 'AI returned invalid JSON.');
    }

    const validatorSchema = Joi.object({
        role: Joi.string()
                    .trim()
                    .min(2)
                    .max(100)
                    .required(),
        skills: Joi.array()
                    .items(
                        Joi.string()
                            .trim()
                            .min(1)
                            .max(100)
                    )
                    .min(1)
                    .max(10)
                    .required()
    });

    const { error, value } = validatorSchema.validate(
        parsedResponse,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if(error) {
        const errorsObj: IErrorMessage = {};

        error.details.forEach(detail => {
            errorsObj[detail.path.join('.')] = detail.message;
        });

        throw new ApiError(500, 'AI keyword extraction validation failed.', errorsObj);
    }

    const jobKeywordsObj = value as IJobKeywordExtractionResponse;
    return jobKeywordsObj;
};
