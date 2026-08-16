import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { AxiosError } from 'axios';
import { ApiError } from '../../utils/ApiError';

// Mock date-fns //
// formatDate uses formatDistanceToNow which gives relative time ("3 days ago")
// This changes depending on when the test runs, making tests uncertain
// We mock it to return a predictable value every time
vi.mock('date-fns', () => ({
    format: vi.fn().mockReturnValue('Jan 1, 2026'),
    formatDistanceToNow: vi.fn().mockReturnValue('3 days ago')
}));


// Import helpers after mocks are defined
import {
    formatDate,
    formatRemainingTime,
    getPerformance,
    getScoreColor,
    handleAxiosError,
    speakQuestion,
    stopSpeaking,
    downloadPdf
} from '../../utils/helpers.js';


// formatRemainingTime
// Pure function, converts total seconds to a readable string
// No mocking needed at all
describe('formatRemainingTime', () => {
    test('should format seconds only when less than 60', () => {
        expect(formatRemainingTime(24)).toBe('24s');
        expect(formatRemainingTime(0)).toBe('00s');
        expect(formatRemainingTime(59)).toBe('59s');
    });

    test('should format minutes and seconds when between 60 and 3599', () => {
        expect(formatRemainingTime(90)).toBe('01m 30s');
        expect(formatRemainingTime(60)).toBe('01m 00s');
        expect(formatRemainingTime(3599)).toBe('59m 59s');
    });

    test('should format hours minutes and seconds when 3600 or more', () => {
        expect(formatRemainingTime(3600)).toBe('01h 00m 00s');
        expect(formatRemainingTime(3661)).toBe('01h 01m 01s');
        expect(formatRemainingTime(7322)).toBe('02h 02m 02s');
    });

    test('should pad single digits with leading zero', () => {
        expect(formatRemainingTime(65)).toBe('01m 05s');
        expect(formatRemainingTime(3665)).toBe('01h 01m 05s');
    });
});


// getPerformance
// Pure function, maps a score to a performance label, color, and CSS class
describe('getPerformance', () => {
    test('should return Outstanding for score >= 90', () => {
        const result = getPerformance(90);
        expect(result.title).toBe('Outstanding');
        expect(result.color).toBe('#16a34a');
        expect(result.class).toContain('green');
    });

    test('should return Excellent for score >= 75 and < 90', () => {
        expect(getPerformance(75).title).toBe('Excellent');
        expect(getPerformance(89).title).toBe('Excellent');
    });

    test('should return Good for score >= 60 and < 75', () => {
        expect(getPerformance(60).title).toBe('Good');
        expect(getPerformance(74).title).toBe('Good');
    });

    test('should return Needs Improvement for score >= 40 and < 60', () => {
        expect(getPerformance(40).title).toBe('Needs Improvement');
        expect(getPerformance(59).title).toBe('Needs Improvement');
    });

    test('should return Keep Practicing for score < 40', () => {
        expect(getPerformance(0).title).toBe('Keep Practicing');
        expect(getPerformance(39).title).toBe('Keep Practicing');
    });

    test('should return object with title, color, and class properties', () => {
        const result = getPerformance(80);
        expect(result).toHaveProperty('title');
        expect(result).toHaveProperty('color');
        expect(result).toHaveProperty('class');
    });

    // Boundary values, these are the most important tests for this kind of function
    test('should handle exact boundary values correctly', () => {
        expect(getPerformance(90).title).toBe('Outstanding');
        expect(getPerformance(89).title).toBe('Excellent');
        expect(getPerformance(75).title).toBe('Excellent');
        expect(getPerformance(74).title).toBe('Good');
        expect(getPerformance(60).title).toBe('Good');
        expect(getPerformance(59).title).toBe('Needs Improvement');
        expect(getPerformance(40).title).toBe('Needs Improvement');
        expect(getPerformance(39).title).toBe('Keep Practicing');
    });
});


// getScoreColor
// Pure function, maps a score to a Tailwind CSS class string
describe('getScoreColor', () => {
    test('should return green class for score >= 9', () => {
        expect(getScoreColor(9)).toContain('green');
        expect(getScoreColor(10)).toContain('green');
    });

    test('should return blue class for score >= 7.5 and < 9', () => {
        expect(getScoreColor(7.5)).toContain('blue');
        expect(getScoreColor(8.9)).toContain('blue');
    });

    test('should return yellow class for score >= 6 and < 7.5', () => {
        expect(getScoreColor(6)).toContain('yellow');
        expect(getScoreColor(7.4)).toContain('yellow');
    });

    test('should return orange class for score >= 4 and < 6', () => {
        expect(getScoreColor(4)).toContain('orange');
        expect(getScoreColor(5.9)).toContain('orange');
    });

    test('should return red class for score < 4', () => {
        expect(getScoreColor(0)).toContain('red');
        expect(getScoreColor(3.9)).toContain('red');
    });
});


// formatDate
// Uses date-fns, mocked above to return predictable values
describe('formatDate', () => {
    test('should return formatted date with time ago', () => {
        const result = formatDate('2026-01-01');

        // Our mocks return 'Jan 1, 2026 (3 days ago)'
        expect(result).toBe('Jan 1, 2026 (3 days ago)');
    });

    test('should accept both string and Date object', () => {
        // Neither of these should throw, function handles both types
        expect(() => formatDate('2026-01-01')).not.toThrow();
        expect(() => formatDate(new Date('2026-01-01'))).not.toThrow();
    });
});


// handleAxiosError
// Converts Axios errors into our ApiError class
describe('handleAxiosError', () => {
    test('should throw ApiError with server response data when AxiosError has response', () => {
        // Build a fake AxiosError that looks like a real 400 response from our backend
        const axiosError = new AxiosError('Request failed');

        // Mock server response
        axiosError.response = {
            data: {
                statusCode: 400,
                message: 'Validation failed',
                errors: { email: 'Email is required' }
            },
            status: 400,
            statusText: 'Bad Request',
            headers: {},
            config: {}
        };

        // handleAxiosError always throws, so we use expect().toThrow()
        expect(() => handleAxiosError(axiosError)).toThrow(ApiError);

        try {
            handleAxiosError(axiosError);
        }
        catch(err) {
            expect(err).toBeInstanceOf(ApiError);
            const apiErr = err as ApiError;
            expect(apiErr.statusCode).toBe(400);
            expect(apiErr.message).toBe('Validation failed');
            expect(apiErr.errors).toEqual({ email: 'Email is required' });
        }
    });

    test('should re-throw original error when it is not an AxiosError', () => {
        const originalError = new Error('Some unexpected error');

        // Non-axios errors pass through unchanged
        expect(() => handleAxiosError(originalError)).toThrow('Some unexpected error');
        expect(() => handleAxiosError(originalError)).not.toThrow(ApiError);
    });

    test('should re-throw original error when AxiosError has no response (from server)', () => {
        // Request already made but no response received from server (e.g. server down)
        const networkError = new AxiosError('Network Error');
        // networkError.response is undefined here

        expect(() => handleAxiosError(networkError)).toThrow(AxiosError);
        expect(() => handleAxiosError(networkError)).not.toThrow(ApiError);
    });

});


// speakQuestion and stopSpeaking
// These functions use the browser's speechSynthesis API
// jsdom does not provide this API, so we create a fake version for testing
describe('speakQuestion', () => {
    // This runs before every test inside this describe block
    // We create a fresh fake speechSynthesis object for every test
    beforeEach(() => {
        // Create fake speechSynthesis functions
        // vi.fn() lets us check later whether these functions were called
        const fakeSpeechSynthesis = {
            // Return one fake English voice for the test
            getVoices: vi.fn().mockReturnValue([
                {
                    name: 'Google US English',
                    lang: 'en-US',
                },
            ]),

            // Used by speakQuestion() to stop any speech already playing
            cancel: vi.fn(),

            // Used by speakQuestion() to start speaking the question
            speak: vi.fn(),

            // Used when the browser has not loaded voices yet
            onvoiceschanged: null,
        };

        // jsdom does not provide the browser's speechSynthesis API
        // So we put our fake version on window for the test
        Object.defineProperty(window, 'speechSynthesis', {
            // The window.speechSynthesis value can be replaced or changed in the test
            // For example, our test can replace the real browser API with fakeSpeechSynthesis
            writable: true,

            value: fakeSpeechSynthesis,
        });

        // jsdom does not provide SpeechSynthesisUtterance,
        // so we create a simple fake version to the global environment for our tests
        // The real code uses "new SpeechSynthesisUtterance(text)" to create a new speech object
        // "new" means: create a new object from this function and
        // give it the values defined inside it
        global.SpeechSynthesisUtterance = function (text: string) {
            // Store the text and settings that speakQuestion() uses on the new object
            this.text = text;
            this.voice = null;
            this.lang = '';
            this.rate = 1;
            this.pitch = 1;
            this.volume = 1;
        } as unknown;
    });

    // Run after every test
    // This removes previous calls history from our Vitest mocks
    afterEach(() => {
        vi.clearAllMocks();
    });


    test('should not speak when text is empty', () => {
        // Send an empty string
        speakQuestion('');

        // Send a string containing only spaces
        speakQuestion('   ');

        // The helper should return immediately for both cases
        // Therefore speak() should never be called
        expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
    });

    test('should speak when text is provided', () => {
        // Give the helper a real question
        speakQuestion('What is Node.js?');

        // The helper should call speechSynthesis.speak() to start reading the question
        expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1);
    });

    test('should stop previous speech before starting new speech', () => {
        // Start speaking a new question
        speakQuestion('What is TypeScript?');

        // The helper calls cancel() first
        // This stops any speech that may already be playing
        expect(window.speechSynthesis.cancel).toHaveBeenCalledTimes(1);
    });

    test('should wait for voices when no voices are loaded', () => {
        // Change getVoices() so it returns an empty array
        // This simulates a browser where voices are not ready yet
        vi.mocked(window.speechSynthesis.getVoices).mockReturnValue([]);

        // Call the helper
        speakQuestion('What is Docker?');

        // Because there are no voices yet,
        // the helper should save the speak function in onvoiceschanged
        expect(window.speechSynthesis.onvoiceschanged).toBeDefined();

        // Speech should not start yet because we are waiting for voices
        expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
    });
});


// Test stopSpeaking()
describe('stopSpeaking', () => {
    // Create a fake speechSynthesis object before every test
    beforeEach(() => {
        // stopSpeaking() only needs the cancel() function
        const fakeSpeechSynthesis = {
            cancel: vi.fn(),
        };

        // jsdom does not provide speechSynthesis, so we add our fake object to window
        Object.defineProperty(window, 'speechSynthesis', {
            writable: true,
            value: fakeSpeechSynthesis,
        });
    });

    test('should stop the current speech', () => {
        // Call our helper
        stopSpeaking();

        // stopSpeaking() should call speechSynthesis.cancel()
        // which tells the browser to stop speaking
        expect(window.speechSynthesis.cancel).toHaveBeenCalledTimes(1);
    });
});

// Test downloadPdf
// This function uses browser APIs like URL, document, and <a> elements
describe('downloadPdf', () => {
    beforeEach(() => {
        // vi.spyOn() does not replace the function by itself
        // It watches an existing function so the test can check whether it was called,
        // how many times it was called, and what arguments it received
        // Suppose we have:
        // vi.spyOn(document.body, 'appendChild');
        // This means:
        // Watch document.body.appendChild and keep track of how it is used
        // It lets us later ask things like:
        // expect(document.body.appendChild).toHaveBeenCalled();
        // or:
        // expect(document.body.appendChild).toHaveBeenCalledWith(someElement);

        // jsdom does not provide createObjectURL, so use a fake version
        // that returns a predictable URL for our tests
        vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');

        // Use a fake function so we can check if the temporary URL was cleaned up
        vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

        // Watch appendChild so we can check the <a> element appended into DOM by downloadPdf()
        vi.spyOn(document.body, 'appendChild');

        // Watch removeChild so we can check that the temporary element is removed
        vi.spyOn(document.body, 'removeChild').mockImplementation(() => ({}));

        // jsdom cannot perform a real browser download
        // Replace click() with a fake function so we can check that it was called
        vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    });

    afterEach(() => {
        // Restore all original browser functions after each test
        // vi.restoreAllMocks() means:
        // Undo all the spies and mocks (created by Vitest using spyOn()) and put the original functions back
        vi.restoreAllMocks();
    });

    test('should create a blob URL and trigger download', () => {
        // Create a fake PDF file for the test
        const blob = new Blob(['fake pdf content'], { type: 'application/pdf' });

        // Run the function we are testing
        downloadPdf(blob, 'test-report.pdf');

        // Check that a temporary URL was created for the PDF
        expect(URL.createObjectURL).toHaveBeenCalledWith(blob);

        // Check that the download link was clicked
        expect(HTMLAnchorElement.prototype.click).toHaveBeenCalled();

        // Check that the temporary URL was cleaned up after the download
        expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    test('should set the correct filename on the download link', () => {
        // Create a fake PDF file
        const blob = new Blob(['fake pdf content'], { type: 'application/pdf' });

        // Run the function we are testing
        downloadPdf(blob, 'interview-report.pdf');

        // Get the <a> element passed to appendChild()
        // It is the first argument of the first call
        const anchor = vi.mocked(document.body.appendChild).mock.calls[0][0] as HTMLAnchorElement;

        // Check that the correct filename was set
        expect(anchor.download).toBe('interview-report.pdf');
    });

    test('should set the blob URL as the link href', () => {
        // Create a fake PDF file
        const blob = new Blob(['fake pdf content'], { type: 'application/pdf' });

        // Run the function we are testing
        downloadPdf(blob, 'report.pdf');

        // Get the <a> element created by downloadPdf()
        const anchor = vi.mocked(document.body.appendChild).mock.calls[0][0] as HTMLAnchorElement;

        // Check that the link points to the temporary blob URL
        expect(anchor.href).toContain('blob:mock-url');
    });
});
