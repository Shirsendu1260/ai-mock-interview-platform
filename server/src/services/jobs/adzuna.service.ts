import type { AdzunaJob, IJobSearchResult } from '../../types/types.js';
import { ApiError } from '../../utils/ApiError.js';
import { JOBS_PER_PAGE } from '../../constants.js';

if(!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) {
    throw new Error('Adzuna credentials are missing.');
}

const searchJobsFromAdzuna = async (
    role: string,
    skills: string[],
    state: string,
    district: string | undefined,
    page: number
): Promise<IJobSearchResult[]> => {
    // Combined job and skills become search keywords
    // Example: 'Backend Developer Node Express MongoDB SQL'
    const cleanedSkills = skills.map(skill => skill.replace(/\.\s?/g, '')); // Replace '.' from strings
    const keywordQuery = `${role} ${cleanedSkills.slice(0, 5).join(' ')}`;

    const location = district
                        ? district
                        : state
                        ? state
                        : 'India';

    const url = `https://api.adzuna.com/v1/api/jobs/in/search/${page}` +
                    `?app_id=${process.env.ADZUNA_APP_ID}` +
                    `&app_key=${process.env.ADZUNA_APP_KEY}` +
                    `&results_per_page=${JOBS_PER_PAGE}` +
                    `&what=${encodeURIComponent(keywordQuery)}` +
                    `&where=${encodeURIComponent(location)}` +
                    `&content-type=application/json`;

    console.log(url);

    const response = await fetch(url);

    if(!response.ok) {
        throw new ApiError(500, 'Unable to fetch jobs from Adzuna.');
    }

    const data = await response.json();

    const jobs: IJobSearchResult[] = data.results.map((job: AdzunaJob) => ({
        title: job.title,
        company: job.company?.display_name ?? 'Unknown',
        location: job.location?.display_name ?? location,
        salary: job.salary_min && job.salary_max
                    ? `₹${Math.round(job.salary_min)} - ₹${Math.round(job.salary_max)}`
                    : null,
        description: job.description,
        redirectUrl: job.redirect_url
    }));

    return jobs;
};

export { searchJobsFromAdzuna };
