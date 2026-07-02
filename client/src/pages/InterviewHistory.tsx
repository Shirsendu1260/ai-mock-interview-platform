import { useEffect, useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FaHistory } from 'react-icons/fa';
import PageContainer from '../components/ui/PageContainer.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import InterviewHistoryCard from '../components/interview/InterviewHistoryCard.jsx';
import { getInterviewHistoryHandler } from '../handlers/interview.handler.js';
import { showErrorToast } from '../utils/toast.js';
import { ApiError } from '../utils/ApiError.js';
import type { IInterviewHistory } from '../types/types.js';
import { LAYOUT } from '../constants/design.js';

const InterviewHistory = () => {
	const [interviews, setInterviews] = useState<IInterviewHistory[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [page, setPage] = useState(1); // Current page loaded from backend (first we load page 1, i.e. default)
	const [hasMore, setHasMore] = useState(true); // Whether backend has more interviews to show

    // Prevent duplicate requests (true when frontend is still requesting data)
    // Without this, Intersection Observer may trigger repeatedly
	const [isFetchingMore, setIsFetchingMore] = useState(false);

    // Invisible element placed at the bottom of the page
    // When this element becomes visible on screen,
    // Intersection Observer knows the user has reached the bottom
	const loadMoreRef = useRef<HTMLDivElement>(null);


    // Loads interviews from the backend based on page number
    const loadHistory = useCallback(async () => {
        // Don't send request, when already fetching another page
        if(isFetchingMore) return;

        // Don't send request, if backend already told us there are no more pages to return
        if(!hasMore) return;

        try {
            setIsFetchingMore(true);

            // Load interviews of current page
            const response = await getInterviewHistoryHandler(page);

            // Keep previous interviews and append the new ones
            setInterviews(prev => [
                ...prev,
                ...response.data.interviews
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
                showErrorToast('Failed to load interview history.');
            }
        }
        finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    }, [page, hasMore, isFetchingMore]); // Recreate the function in memory only when these values change
    // useCallback remembers (memoizes) this function between renders.
    // Normally, whenever this component re-renders, React creates a brand new
    // loadHistory() function again. Most of the time that's perfectly fine.
    // But here, loadHistory() is also used inside useEffect().
    // Since useEffect compares function references (memory addresses),
    // creating a new function every render makes React think the dependency
    // has changed, causing the effect to run again unnecessarily.
    // useCallback prevents that.
    // React keeps using the same loadHistory() function object until one of
    // the dependencies below changes.
    // In short:
    // Same dependencies -> Same function reference
    // Dependency changed -> React creates a new function
    // And, loadHistory now looks directly at page state variable, because page is in the useCallback
    // dependency array, it will always look at the correct, real-time page number


	// Loads interviews when component loads for the first time
	useEffect(() => {
        loadHistory(); // Loads first set of interviews (i.e. page = 1)
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
                // entries[0] is our only target div element and check if it has reached the viewport
                if(entries[0].isIntersecting) {
                    loadHistory(); // it already knows what page to fetch
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
    }, [loadHistory]);
    // loadHistory's reference changed means page, hasMore, or isFetchingMore also changed
    // (hint: useCallback())


    if(isLoading) {
        return (
            <PageContainer>
                <Spinner size="lg" />
            </PageContainer>
        );
    }


    if(interviews.length === 0) {
        return (
            <PageContainer>
                <EmptyState
                    icon={<FaHistory/>}
                    title="No Interview History"
                    description="Your completed interviews will appear here."
                />
            </PageContainer>
        );
    }


    /*
    Intersection Observer flow here:

    Page loads -> Observer created -> Observer watches trigger div -> User scrolls -> Trigger becomes visible ->
    Browser runs callback -> isIntersecting ? -> Yes -> isFetchingMore ? -> No -> hasMore ? -> Yes ->
    Fetch next page -> Append cards -> Trigger moves downward -> Repeat
    */


	return (
        <PageContainer>
            <div className={`w-full ${LAYOUT.maxWidth}`}>
                <SectionHeading description="Review your previous interview performances.">
                    Interview History
                </SectionHeading>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 grid gap-6 sm:grid-cols-2"
                >
                    {
                        interviews.map((interview, index) => (
                            <InterviewHistoryCard
                                key={interview.id}
                                interview={interview}
                                index={index}
                            />
                        ))
                    }
                </motion.div>

                <AnimatePresence>
                    {
                        isFetchingMore && (
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.25 }}
                                className="py-10 flex justify-center"
                            >
                                <Spinner size="lg" />
                            </motion.div>
                        )
                    }
                </AnimatePresence>

				{
				    hasMore &&
				    (
                        // Invisible div watched by Intersection Observer
                        // When this becomes visible, the next page loads automatically
				        <div ref={loadMoreRef} className="h-8" />
				    )
				}
            </div>
        </PageContainer>
    );
};

export default InterviewHistory;
