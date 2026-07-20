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
    const [isLoading, setIsLoading] = useState(false); // for page-1 loading
    const [page, setPage] = useState(1); // Current page loaded from backend (first we load page 1, i.e. default)
    const [hasMore, setHasMore] = useState(true); // Whether backend has more interviews to show

    // Prevent duplicate requests (true when frontend is still requesting data)
    // Unlike React state, refs update instantly and don't wait for a re-render
    const loadingRef = useRef(false);

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
    const [isFetchingMore, setIsFetchingMore] = useState(false);


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


    // Loads interviews from the backend based on page number
    // Wrapped in useCallback because it's now called directly from two
    // different places (the filter-reset useEffect AND the load-more useEffect),
    // so it needs a stable identity + access to the latest filter values
    // 'requestedPage' tells the function which page to ask the backend for
    const loadHistory = useCallback(async (requestedPage: number, isReset: boolean) => {
        // If we are resetting filters, we must allow the API call to run
        // even if hasMore was previously false. Otherwise, the user gets permanently locked out.
        if(!hasMore && !isReset) return;

        // Lock immediately before sending the request (denotes a request is ongoing)
        loadingRef.current = true;

        try {
            if(requestedPage === 1) {
                setIsLoading(true);
            }
            else {
                setIsFetchingMore(true);
            }

            const params: IInterviewHistoryFilters = {
                page: requestedPage,
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

            // For fresh start/search/filter/sort change -> replace the list
            if(isReset){
                setInterviews(response.data.interviews);
            }
            // Load more request -> append to existing list
            else{
                setInterviews(prev => [
                    ...prev,
                    ...response.data.interviews
                ]);
            }

            // Backend tells us whether another page exists or not
            setHasMore(response.data.hasMore);

            // Keep 'page' state in sync with what we actually loaded, so the
            // next load-more request (triggered by Intersection Observer) asks
            // for requestedPage + 1 instead of re-requesting the same page.
            setPage(requestedPage);
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
            if(requestedPage === 1){
                setIsLoading(false);
            }
            else {
                setIsFetchingMore(false);
            }

            // Release the lock after request finishes
            loadingRef.current = false;
        }
    }, [debouncedSearch, selectedDifficulties, scoreRange, fromDate, toDate, sort, hasMore]);


    // Single effect that reacts to filter/sort/search changes.
    // Old code had two effects both listening to the same filters (one to
    // reset page/hasMore, another to fetch interviews) - they fired in the same render
    // and raced against each other, so 'page' hadn't actually updated yet when the
    // fetch effect read it. That's what broke Reset
    // So what really happened earlier:
    // Filter changes
    // useEffect A says "set page to 1" (but this hasn't applied yet)
    // useEffect B runs immediately after, still sees page = 3, and fetches page 3 of our new
    // filtered results, which is garbage or empty
    // This is why Reset looked broken, and why Load More broke after filtering
    // Now, whenever a filter changes, we directly fetch page 1 and replace
    // the list (isReset = true). We don't touch 'page' state beforehand
    // loadHistory itself sets page to 1 once the fetch succeeds
    useEffect(() => {
        setHasMore(true); // assume there is more until this fetch tells us otherwise
        loadHistory(1, true); // true means it's a filter/search/sort request
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        debouncedSearch, // we are using 'debouncedSearch' to prevent API call on every keystroke
        selectedDifficulties,
        scoreRange,
        fromDate,
        toDate,
        sort
    ]);


    // Observe the invisible div placed at the bottom of the page
    // Whenever this becomes visible, load the next page (append mode)
    useEffect(() => {
        // If the element isn't mounted yet, we don't need to observe
        if(!loadMoreRef.current) return;

        // Our Intersection Observer
        const observer = new IntersectionObserver(
            // CALLBACK
            // Runs when the visibility of the observed element changes (i.e. visible-hidden or hidden-visible)
            (entries) => {
                // entries[0] is our only target div element and check if it has reached the viewport
                // And also check if more data can be loaded (using hasMore)
                // And also check any request is not ongoing
                if(entries[0].isIntersecting && hasMore && !loadingRef.current) {
                    // Fetch the next page directly (isReset = false -> append).
                    // We no longer go through setPage() first; loadHistory
                    // takes the page number as an argument and updates
                    // 'page' state itself once the request succeeds
                    loadHistory(page + 1, false);
                }
            },

            // OPTIONS
            // Trigger loading a little before the user reaches the bottom of the page
            // Which helps getting data a bit early before reaching bottom
            {
                rootMargin: '250px'
            }
        );

        // Now observe the viewport for the target element
        observer.observe(loadMoreRef.current);

        // Disconnect the observer when the component unmounts
        return () => observer.disconnect();
    }, [hasMore, page, loadHistory]);


    if(isLoading) {
        return (
            <PageContainer>
                <Spinner size="lg" />
            </PageContainer>
        );
    }


    /*
    Intersection Observer flow here:

    Page loads -> Observer created -> Observer watches trigger div -> User scrolls -> Trigger becomes visible
    -> Browser runs callback -> isIntersecting ? -> Yes -> loadingRef.current === true ? -> No -> hasMore ?
    -> Yes -> loadHistory(page + 1) -> Append cards -> page state updates -> Trigger moves downward -> Repeat
    */


    return (
        <PageContainer>
            <div className={`w-full ${LAYOUT.maxWidth}`}>
                <SectionHeading description="Review your previous interview performances.">
                    Interview History
                </SectionHeading>

                <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-border bg-surface p-6 shadow-soft">
                    {/*Top Row: Search & Sort*/}
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search past interviews by role..."
                                className="
                                    w-full rounded-xl border border-border bg-surface-alt py-2 pl-10 pr-3.5
                                    text-sm text-dark outline-none transition
                                    focus:border-accent focus:bg-surface focus:ring-4 focus:ring-accent/15
                                "
                            />
                        </div>

                        <div className="w-full sm:w-56">
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="
                                    w-full rounded-xl border border-border bg-surface-alt py-2 px-3.5
                                    text-sm text-dark outline-none transition
                                    focus:border-accent focus:bg-surface focus:ring-4 focus:ring-accent/15
                                "
                            >
                                <option value="newest">Sort By: Newest First</option>
                                <option value="oldest">Sort By: Oldest First</option>
                                <option value="highest_score">Sort By: Highest Score</option>
                                <option value="lowest_score">Sort By: Lowest Score</option>
                            </select>
                        </div>
                    </div>

                    <div className="h-px w-full bg-border" />

                    {/*Bottom Row: Filters*/}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Difficulty */}
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
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
                                                rounded-md px-3.5 py-2 text-xs font-semibold capitalize transition-colors
                                                ${
                                                    active
                                                    ? "bg-accent text-white shadow-soft"
                                                    : "bg-surface-alt text-muted hover:bg-accent/10 hover:text-accent"
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
                            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                                Score Range
                            </span>

                            <RangeSlider
                                min={0}
                                max={100}
                                values={scoreRange}
                                onChange={setScoreRange}
                            />
                        </div>

                        {/* Dates */}
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                                Date Range
                            </span>

                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="
                                        w-full rounded-md border border-border bg-surface-alt px-3.5 py-2
                                        text-xs text-dark outline-none focus:border-accent focus:bg-surface
                                    "
                                />

                                <span className="text-muted">
                                    <IoIosArrowForward size={14} />
                                </span>

                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="
                                        w-full rounded-md border border-border bg-surface-alt px-3.5 py-2
                                        text-xs text-dark outline-none focus:border-accent focus:bg-surface
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
                                    flex w-full items-center justify-center gap-2 rounded-md border border-red-200/60
                                    bg-surface-alt px-3.5 py-2 text-xs font-semibold text-red-500 transition-colors
                                    hover:bg-red-50 hover:text-red-600 sm:w-auto
                                "
                            >
                                <TbReload size={14} />
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {
                    interviews.length === 0 ? (
                        <div className="mt-16">
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
                                className="mt-10 grid gap-8 sm:grid-cols-2"
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
                                            className="py-14 flex justify-center"
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
