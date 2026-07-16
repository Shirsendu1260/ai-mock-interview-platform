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
import type { IInterviewHistory, IInterviewHistoryFilters } from '../types/types.js';
import { LAYOUT } from '../constants/design.js';
import { DIFFICULTIES } from '../constants/interview.js';
import RangeSlider from '../components/interview/RangeSlider.js';
import { FaSearch } from "react-icons/fa";
import { TbReload } from 'react-icons/tb';
import { IoIosArrowForward } from 'react-icons/io';

const InterviewHistory = () => {
	const [interviews, setInterviews] = useState<IInterviewHistory[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [page, setPage] = useState(1); // Current page loaded from backend (first we load page 1, i.e. default)
	const [hasMore, setHasMore] = useState(true); // Whether backend has more interviews to show

    // Prevent duplicate requests (true when frontend is still requesting data)
    // Without this, Intersection Observer may trigger repeatedly
	const [isFetchingMore, setIsFetchingMore] = useState(false);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(''); // state to prevent hitting the backend on every keystroke
    const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
    const [scoreRange, setScoreRange] = useState([0, 100]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [sort, setSort] = useState('newest');

    // Invisible element placed at the bottom of the page
    // When this element becomes visible on screen,
    // Intersection Observer knows the user has reached the bottom
	const loadMoreRef = useRef<HTMLDivElement>(null);


    // Toggle function to add or remove a difficulty from an array state
    const toggleDifficulty = (difficulty: string) => {
        setSelectedDifficulties(prev => {
            // Check if this difficulty is already selected, if yes, remove it
            if(prev.includes(difficulty)) {
                return prev.filter(item => item !== difficulty);
            }

            // Else spread old items and add new difficulty at the end
            return [...prev, difficulty];
        });
    };


    // Reset Filters button
    const resetFilters = () => {
        setSearch('');
        setDebouncedSearch('')
        setSelectedDifficulties([]);
        setScoreRange([0, 100]);
        setFromDate('');
        setToDate('');
        setSort('newest');
    };


    // prevents hitting the backend on every keystroke
    useEffect(() => {
        // start a timer, after 400ms of no typing, update the debounced search value
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim()); // This is what actually triggers API call
        }, 400);

        // Cleanup function, runs when 'search' changes or component unmounts
        return () => clearTimeout(timer);
    }, [search]);


    // Reset pagination whenever filters change
    // Whenever the search changes - clear old interviews, start again from page 1, enable infinite scrolling again
    useEffect(() => {
        setInterviews([]);
        setPage(1);
        setHasMore(true);
        setIsLoading(false);
        loadHistory(1);
    }, [
        debouncedSearch, // we are using 'debouncedSearch' to prevent API call on every keystroke
        selectedDifficulties,
        scoreRange,
        fromDate,
        toDate,
        sort
    ]);


    // Loads interviews from the backend based on page number
    const loadHistory = useCallback(async (currentPage: number) => {
        // Don't send request, when already fetching another page
        if(isFetchingMore) return;

        // Don't send request, if backend already told us there are no more pages to return
        if(!hasMore) return;

        try {
            setIsFetchingMore(true);
            setIsLoading(true);

            const params: IInterviewHistoryFilters = {
                page: currentPage,
                sort
            };

            if(debouncedSearch !== '') {
                params.search = debouncedSearch
            }

            if(selectedDifficulties.length > 0) {
                params.difficulty = selectedDifficulties.join(',');
            }

            if(scoreRange[0] > 0) {
                params.minScore = scoreRange[0];
            }

            if(scoreRange[1] < 100) {
                params.maxScore = scoreRange[1];
            }

            if(fromDate !== '') {
                params.fromDate = fromDate;
            }

            if(toDate !== '') {
                params.toDate = toDate;
            }

            // Load interviews of current page
            const response = await getInterviewHistoryHandler(params);

            // Keep previous interviews and append the new ones
            setInterviews(prev => [
                ...prev,
                ...response.data.interviews
            ]);

            // Backend tells us whether another page exists or not
            setHasMore(response.data.hasMore);

            // Only increment page for next request if there is actually more data left to fetch
            if(response.data.hasMore) setPage(currentPage + 1);;
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
    }, [
        isFetchingMore,
        hasMore,
        debouncedSearch,
        selectedDifficulties,
        scoreRange,
        fromDate,
        toDate,
        sort
    ]); // Recreate the function in memory only when these values change
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
                    loadHistory(page); // it already knows what page to fetch
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
    }, [loadHistory, page]);
    // loadHistory's reference changed means isFetchingMore, hasMore, debouncedSearch, selectedDifficulties, scoreRange, fromDate, or toDate also changed
    // (hint: useCallback())


    if(isLoading) {
        return (
            <PageContainer>
                <Spinner size="lg" />
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

                <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    {/*Top Row: Search & Sort*/}
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search past interviews by role..."
                                className="
                                    w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4
                                    text-sm text-slate-700 outline-none transition
                                    focus:border-primary-light focus:bg-white focus:ring-1 focus:ring-primary-light
                                "
                            />
                        </div>

                        <div className="w-full sm:w-56">
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="
                                    w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4
                                    text-sm text-slate-700 outline-none transition
                                    focus:border-primary-light focus:bg-white focus:ring-1 focus:ring-primary-light
                                "
                            >
                                <option value="newest">Sort By: Newest First</option>
                                <option value="oldest">Sort By: Oldest First</option>
                                <option value="highest_score">Sort By: Highest Score</option>
                                <option value="lowest_score">Sort By: Lowest Score</option>
                            </select>
                        </div>
                    </div>

                    <div className="h-px w-full bg-slate-100" />

                    {/*Bottom Row: Filters*/}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Difficulty */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Difficulty
                            </span>

                            <div className="flex flex-wrap gap-2">
                                {DIFFICULTIES.map(difficulty => {
                                    const active = selectedDifficulties.includes(difficulty);

                                    return (
                                        <button
                                            key={difficulty}
                                            type="button"
                                            onClick={() => toggleDifficulty(difficulty)}
                                            className={`
                                                rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-colors
                                                ${
                                                    active
                                                    ? "bg-primary-light text-white"
                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                }
                                            `}
                                        >
                                            {difficulty}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Score */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Score Range
                            </span>

                            <div className="px-1 pt-2">
                                <RangeSlider
                                    min={0}
                                    max={100}
                                    values={scoreRange}
                                    onChange={setScoreRange}
                                />
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Date Range
                            </span>

                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="
                                        w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5
                                        text-xs text-slate-700 outline-none focus:border-primary-light focus:bg-white
                                    "
                                />

                                <span className="text-slate-300">
                                    <IoIosArrowForward size={14} />
                                </span>

                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="
                                        w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5
                                        text-xs text-slate-700 outline-none focus:border-primary-light focus:bg-white
                                    "
                                />
                            </div>
                        </div>

                        {/* Reset */}
                        <div className="flex items-end justify-start lg:justify-end">
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="
                                    flex w-full items-center justify-center gap-2 rounded-lg border border-red-200
                                    bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition
                                    hover:bg-red-100 hover:text-red-700 sm:w-auto
                                "
                            >
                                <TbReload size={16} />
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {
                    interviews.length === 0 ? (
                        <div className="mt-12">
                            <EmptyState
                                icon={<FaHistory />}
                                title={
                                    debouncedSearch ||
                                    selectedDifficulties.length > 0 ||
                                    scoreRange[0] > 0 ||
                                    scoreRange[1] < 100 ||
                                    fromDate ||
                                    toDate
                                        ? "No Matching Interviews"
                                        : "No Interview History"
                                }
                                description={
                                    debouncedSearch ||
                                    selectedDifficulties.length > 0 ||
                                    scoreRange[0] > 0 ||
                                    scoreRange[1] < 100 ||
                                    fromDate ||
                                    toDate
                                        ? "Try adjusting your filters."
                                        : "Your completed interviews will appear here."
                                }
                            />
                        </div>
                    ) : (
                        <>
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
                                hasMore && (
                                    <div
                                        ref={loadMoreRef}
                                        className="h-8"
                                    />
                                )
                            }
                        </>
                    )
                }
            </div>
        </PageContainer>
    );
};

export default InterviewHistory;
