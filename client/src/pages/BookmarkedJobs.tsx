import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FaBookmark } from "react-icons/fa";
import PageContainer from "../components/ui/PageContainer.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import JobCard from "../components/job/JobCard.jsx";
import { getBookmarkedJobsHandler, removeBookmarkHandler } from "../handlers/job.handler.js";
import type { IJob } from "../types/types.js";
import { ApiError } from "../utils/ApiError.js";
import { showErrorToast, showSuccessToast } from "../utils/toast.js";
import { LAYOUT } from "../constants/design.js";

const BookmarkedJobs = () => {
    const [jobs, setJobs] = useState<IJob[]>([]);
    const [isLoading, setIsLoading] = useState(true);
	const [page, setPage] = useState(1); // Current page loaded from backend (first we load page 1, i.e. default)
	const [hasMore, setHasMore] = useState(true); // Whether backend has more interviews to show

    // Prevent duplicate requests (true when frontend is still requesting data)
    // Without this, Intersection Observer may trigger repeatedly
	const [isFetchingMore, setIsFetchingMore] = useState(false);

    const [bookmarkLoadingJobId, setBookmarkLoadingJobId] = useState<string | null>(null);

    // Invisible element placed at the bottom of the page
    // When this element becomes visible on screen,
    // Intersection Observer knows the user has reached the bottom
    const loadMoreRef = useRef<HTMLDivElement>(null);


    // Load bookmarked jobs
    const loadJobs = useCallback(async () => {
        // Don't send request, when already fetching another page
        if(isFetchingMore) return;

        // Don't send request, if backend already told us there are no more pages to return
        if(!hasMore) return;

        try {
            setIsFetchingMore(true);

            // Load bookmarked jobs of current page
            const response = await getBookmarkedJobsHandler(page);

            // Keep previous bookmarked jobs and append the new ones
            setJobs(prev => [
                ...prev,
                ...response.data.jobs
            ]);

            // Backend tells us whether another page exists or not
            setHasMore(response.data.hasMore);

            // Only increment page for next request if there is actually more data left to fetch
            if(response.data.hasMore) setPage(prev => prev + 1);
        }
        catch(error) {
            if(error instanceof ApiError) {
                showErrorToast(error.message);
            }
            else {
                showErrorToast("Unable to load bookmarked jobs.");
            }
        }
        finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }

    }, [page, hasMore, isFetchingMore]); // Recreate the function in memory only when these values change


    // Loads bookmarked jobs when component loads for the very first time
    useEffect(() => {
        loadJobs(); // Loads first set of bookmarked jobs (i.e. page = 1)
    }, []);


    // Observe the invisible div placed at the bottom of the page
    // Whenever this becomes visible, the next page is automatically loaded
    useEffect(() => {
        // If the element isn't mounted yet, we don't need to observe
        if(!loadMoreRef.current) return;

        // Our Intersection Observer
        const observer = new IntersectionObserver(
            // CALLBACK
            // Runs when the visibility of the observed element changes (i.e. visible-hidden or hidden-visible)
            (entries) => {
                if(entries[0].isIntersecting) {
                    loadJobs(); // it already knows what page to fetch
                }
            },

            // OPTIONS
            {
                // Trigger loading a little before the user reaches the bottom of the page
                // Which helps getting data a bit early before reaching bottom
                rootMargin: '250px'
            }
        );

        // Now observe the viewport for the target element
        observer.observe(loadMoreRef.current);

        // Disconnect the observer when the component unmounts
        return () => observer.disconnect();
    }, [loadJobs]);
    // loadJobs's reference changed means page, hasMore, or isFetchingMore also changed
    // (hint: useCallback())


    const handleBookmarkToggle = async (job: IJob) => {
        if(bookmarkLoadingJobId) return;

        // Remove instantly
        setJobs(prev =>
            prev.filter(item => item.jobId !== job.jobId)
        );

        setBookmarkLoadingJobId(job.jobId);

        try {
            await removeBookmarkHandler(job.jobId);
            showSuccessToast("Removed from bookmarks.");
        }
        catch(error) {
            // Rollback removing bookmarked job, by adding the job again
            setJobs(prev => [job, ...prev]);

            if(error instanceof ApiError) {
                showErrorToast(error.message);
            }
            else {
                showErrorToast("Unable to remove bookmark.");
            }
        }
        finally {
            setBookmarkLoadingJobId(null);
        }
    };


    if(isLoading) {
        return (
            <PageContainer>
                <Spinner size="lg" />
            </PageContainer>
        );
    }


    if(jobs.length === 0) {
        return (
            <PageContainer>
                <EmptyState
                    icon={<FaBookmark />}
                    title="No Bookmarked Jobs"
                    description="Your bookmarked jobs will appear here."
                />
            </PageContainer>
        );
    }


    return (
        <PageContainer>
            <div className={`w-full ${LAYOUT.maxWidth}`}>
                <SectionHeading
                    description="All your saved jobs in one place."
                >
                    Bookmarked Jobs
                </SectionHeading>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 grid gap-5 md:grid-cols-2"
                >
                    {
                        jobs.map(job => (
                            <JobCard
                                key={job.jobId}
                                job={job}
                                isBookmarked={true}
                                isBookmarkLoading={bookmarkLoadingJobId === job.jobId}
                                onBookmarkToggle={handleBookmarkToggle}
                            />
                        ))
                    }
                </motion.div>

                <AnimatePresence>
                    {
                        isFetchingMore && (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                className="flex justify-center py-10"
                            >
                                <Spinner size="lg" />
                            </motion.div>
                        )
                    }
                </AnimatePresence>

                {
                    hasMore && (
                        // Invisible div watched by Intersection Observer
                        // When this becomes visible, the next page loads automatically
                        <div
                            ref={loadMoreRef}
                            className="h-8"
                        />
                    )
                }
            </div>
        </PageContainer>
    );
};

export default BookmarkedJobs;
