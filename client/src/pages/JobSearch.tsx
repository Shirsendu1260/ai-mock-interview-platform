import { useState } from "react";
import PageContainer from "../components/ui/PageContainer.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import ResumeUploader from "../components/interview/ResumeUploader.jsx";
import StateSelector from "../components/job/StateSelector.jsx";
import DistrictSelector from "../components/job/DistrictSelector.jsx";
import SearchSummaryCard from "../components/job/SearchSummaryCard.jsx";
import JobCard from "../components/job/JobCard.jsx";
import { searchJobsHandler, loadMoreJobsHandler } from "../handlers/job.handler.js";
import { showLoadingToast, showErrorToast, showSuccessToastWithToastId, showErrorToastWithToastId } from "../utils/toast.js";
import { ApiError } from "../utils/ApiError.js";
import type { IErrorMessage, IJobSearchData, IJobSearchResult } from "../types/types.js";
import { JOB_SEARCH_CREDIT_COST } from '../constants/jobSearch.js';
import { getAuthUser } from "../api/auth.api.js";
import { useAuthStore } from "../stores/auth.store.js";

const JobSearch = () => {
    const [stateName, setStateName] = useState("");
    const [district, setDistrict] = useState("");
    const [resumePdfFile, setResumePdfFile] = useState<File | null>(null);
    const [jobs, setJobs] = useState<IJobSearchResult[]>([]);
    const [searchData, setSearchData] = useState<IJobSearchData | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [errors, setErrors] = useState<IErrorMessage>({});
    const setUser = useAuthStore((state) => state.setUser);


    const handleSearchJobs = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(!resumePdfFile) {
            showErrorToast("Please upload your resume PDF.");
            return;
        }

        if(!stateName) {
            showErrorToast("Please select a state.");
            return;
        }

        const toastId = showLoadingToast("Searching jobs...");

        setIsSearching(true);

        try {
            setErrors({});
            setJobs([]);
            setSearchData(null);

            const formData = new FormData();
            formData.append("resume", resumePdfFile);
            formData.append("state", stateName);
            if(district) formData.append("district", district);

            const response = await searchJobsHandler(formData);

            setJobs(response.data.jobs);
            setSearchData(response.data.searchData);
            setPage(response.data.page);
            setHasMore(response.data.hasMore);

            // Fetch authenticated user
            const authUserResponse = await getAuthUser();

            // update Zustand store to get latest user state
            setUser(authUserResponse.data.data);

            showSuccessToastWithToastId("Jobs loaded successfully.", toastId);
        }
        catch(error) {
            if (error instanceof ApiError) {
                setErrors(error.errors);
                showErrorToastWithToastId(error.message, toastId);
            }
            else {
                showErrorToastWithToastId("Unable to search jobs.", toastId);
                console.error(error);
            }
        }
        finally {
            setIsSearching(false);
        }
    };


    const handleLoadMore = async () => {
        if(!isLoadingMore) return;

        if(!searchData) {
            showErrorToast("No search data available. Please upload your resume PDF and fill state & district properly.");
            return;
        }

        if(!hasMore) {
            showErrorToast("You've reached the end of the results.");
            return;
        }

        setIsLoadingMore(true);

        try {
            const response = await loadMoreJobsHandler(searchData, page + 1);

            setJobs(prev => [
                ...prev,
                ...response.data.jobs
            ]);

            setPage(response.data.page);
            setHasMore(response.data.hasMore);
        }
        catch(error) {
            if(error instanceof ApiError) {
                showErrorToast(error.message);
            }
            else {
                showErrorToast("Unable to load more jobs.");
                console.error(error);
            }
        }
        finally {
            setIsLoadingMore(false);
        }
    };


    return (
        <PageContainer>
            <div className="mx-auto max-w-5xl">
                <SectionHeading
                    description="Upload your resume and instantly discover relevant jobs."
                >
                    Job Search
                </SectionHeading>

                <Card className="mt-8">
                    <form className="space-y-6" onSubmit={handleSearchJobs} >
                        <div className="grid gap-5 md:grid-cols-2">
                            <StateSelector
                                stateName={stateName}
                                setStateName={setStateName}
                                setDistrict={setDistrict}
                                error={errors.state}
                                setErrors={setErrors}
                            />

                            <DistrictSelector
                                stateName={stateName}
                                district={district}
                                setDistrict={setDistrict}
                                error={errors.district}
                                setErrors={setErrors}
                            />
                        </div>

                        <ResumeUploader
                            resumePdfFile={resumePdfFile}
                            setResumePdfFile={setResumePdfFile}
                            error={errors.resume}
                            setErrors={setErrors}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoadingMore || isSearching}
                            isLoading={isLoadingMore || isSearching}
                        >
                            Search Jobs ({JOB_SEARCH_CREDIT_COST} Credits)
                        </Button>
                    </form>
                </Card>

                {
                    searchData && (
                        <div className="mt-10 space-y-8">
                            <SearchSummaryCard searchData={searchData} />

                            <div className="grid gap-5 xl:grid-cols-2">
                                {
                                    jobs.map(job => (
                                        <JobCard key={job.redirectUrl} job={job} />
                                    ))
                                }
                            </div>

                            {
                                jobs.length === 0 && (
                                    <Card className="py-12 text-center">
                                        <h3 className="text-lg font-semibold text-dark">
                                            No matching jobs found
                                        </h3>

                                        <p className="mt-2 text-sm text-muted">
                                            Try another state or upload a different resume.
                                        </p>
                                    </Card>
                                )
                            }

                            {
                                jobs.length > 0 && (
                                    <div className="mt-8 flex justify-center">
                                        {
                                            hasMore ? (
                                                <Button
                                                    onClick={handleLoadMore}
                                                    disabled={isLoadingMore || isSearching}
                                                    isLoading={isLoadingMore || isSearching}
                                                >
                                                    Load More Jobs
                                                </Button>
                                            ) : (
                                                <p className="text-center text-sm text-muted">
                                                    You've reached the end of the results.
                                                </p>
                                            )
                                        }
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </PageContainer>
    );
};

export default JobSearch;
