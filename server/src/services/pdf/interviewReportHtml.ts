import { APP_NAME } from "../../constants.js";
import type { IInterviewReportData } from "../../types/types.js";

// Builds the complete HTML document for the interview report
// It returns a complete HTML page as a string
const generateInterviewReportHtml = (interviewReportData: IInterviewReportData): string => {
    const { user, interview, overallFeedback, questionResults } = interviewReportData;

    // Generate the HTML for every interview question.
    const questionsHtml = questionResults.map((question) => `
        <div class="question-card">
            <div class="question-header">
                <span class="question-number">Question ${question.position}</span>
                <span class="score-badge">${question.score ?? 0}/10</span>
            </div>
            <div class="section">
                <h4>Question</h4>
                <p>${question.question}</p>
            </div>
            <div class="section">
                <h4>Your Answer</h4>
                <p>${question.answer ?? "No answer submitted."}</p>
            </div>
            <div class="section">
                <h4>Feedback</h4>
                <p>${question.feedback ?? "No feedback available."}</p>
            </div>
        </div>
    `).join('');

    // Return the entire HTML document
    // Puppeteer will open this page and convert it into a PDF
    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8"/>
                <title>Interview Report · ${APP_NAME}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

                    :root {
                        --primary: #1E3A5F;
                        --primary-light: #2B4C78;
                        --dark: #0B1120;
                        --dark-light: #1E293B;
                        --accent: #7C3AED;
                        --accent-light: #A78BFA;
                        --background: #F8FAFC;
                        --border: #E2E8F0;
                        --muted: #64748B;
                        --white: #FFFFFF;
                    }
                    * {
                        box-sizing: border-box;
                        margin: 0;
                        padding: 0;
                    }
                    body {
                        padding: 48px;
                        background: var(--background);
                        color: var(--dark);
                        font-family: 'Inter', Arial, Helvetica, sans-serif;
                        line-height: 1.6;
                        -webkit-font-smoothing: antialiased;
                    }

                    /* Typography */
                    h1, h2, h3, h4 {
                        color: var(--dark);
                        line-height: 1.3;
                    }
                    .report-header {
                        margin-bottom: 40px;
                        border-bottom: 2px solid var(--border);
                        padding-bottom: 24px;
                    }
                    .report-title {
                        color: var(--primary);
                        font-size: 36px;
                        font-weight: 700;
                        letter-spacing: -0.02em;
                        margin-bottom: 8px;
                    }
                    .subtitle {
                        color: var(--muted);
                        font-size: 16px;
                        font-weight: 400;
                    }

                    /* Layout & Cards */
                    .card {
                        background: var(--white);
                        border: 1px solid var(--border);
                        border-radius: 16px;
                        padding: 32px;
                        margin-bottom: 32px;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.02);
                        page-break-inside: avoid; /* Essential for clean PDF generation */
                    }
                    .card-title {
                        color: var(--primary);
                        font-size: 24px;
                        font-weight: 700;
                        margin-bottom: 24px;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }
                    .card-title::before {
                        content: '';
                        display: block;
                        width: 6px;
                        height: 24px;
                        background: var(--accent);
                        border-radius: 4px;
                    }

                    /* Summary Grid */
                    .summary-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 20px;
                    }
                    .summary-item {
                        background: var(--background);
                        padding: 16px 20px;
                        border-radius: 12px;
                        border: 1px solid var(--border);
                    }
                    .label {
                        color: var(--muted);
                        font-size: 13px;
                        font-weight: 500;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        margin-bottom: 6px;
                    }
                    .value {
                        color: var(--dark-light);
                        font-size: 18px;
                        font-weight: 600;
                    }

                    /* Feedback Section */
                    .feedback-block {
                        margin-bottom: 24px;
                        padding-left: 20px;
                        border-left: 3px solid var(--accent-light);
                        page-break-inside: avoid;
                    }
                    .feedback-block:last-child {
                        margin-bottom: 0;
                    }
                    .feedback-block h4 {
                        color: var(--accent);
                        font-size: 16px;
                        font-weight: 600;
                        margin-bottom: 8px;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }
                    .feedback-block p {
                        color: var(--dark-light);
                        font-size: 15px;
                    }

                    /* Questions Section */
                    .question-card {
                        background: var(--background);
                        border: 1px solid var(--border);
                        border-radius: 12px;
                        padding: 24px;
                        margin-bottom: 24px;
                        page-break-inside: avoid;
                    }
                    .question-card:last-child {
                        margin-bottom: 0;
                    }
                    .question-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                        padding-bottom: 16px;
                        border-bottom: 1px solid var(--border);
                    }
                    .question-number {
                        font-size: 18px;
                        font-weight: 700;
                        color: var(--primary);
                    }
                    .score-badge {
                        background: var(--primary-light);
                        color: var(--white);
                        padding: 6px 14px;
                        border-radius: 20px;
                        font-size: 14px;
                        font-weight: 600;
                        box-shadow: 0 2px 4px rgba(43, 76, 120, 0.2);
                    }

                    .section {
                        margin-bottom: 20px;
                    }
                    .section:last-child {
                        margin-bottom: 0;
                    }
                    .section h4 {
                        color: var(--primary-light);
                        font-size: 14px;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        margin-bottom: 8px;
                    }
                    .section p {
                        color: var(--dark-light);
                        font-size: 15px;
                        background: var(--white);
                        padding: 16px;
                        border-radius: 8px;
                        border: 1px solid var(--border);
                    }

                    /* Footer */
                    .footer {
                        margin-top: 48px;
                        text-align: center;
                        padding-top: 24px;
                        border-top: 1px solid var(--border);
                        font-size: 14px;
                        font-weight: 500;
                        color: var(--muted);
                    }
                </style>
            </head>
            <body>
                <div class="report-header">
                    <h1 class="report-title">AI Mock Interview Report</h1>
                    <p class="subtitle">Generated automatically after interview completion.</p>
                </div>

                <div class="card">
                    <h2 class="card-title">Interview Summary</h2>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <div class="label">Name</div>
                            <div class="value">${user.fullName}</div>
                        </div>
                        <div class="summary-item">
                            <div class="label">Completed At</div>
                            <div class="value">
                                ${new Date(interview.createdAt).toLocaleString('en-IN', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                        <div class="summary-item">
                            <div class="label">Role</div>
                            <div class="value">${interview.role}</div>
                        </div>
                        <div class="summary-item">
                            <div class="label">Difficulty</div>
                            <div class="value">${interview.difficulty}</div>
                        </div>
                        <div class="summary-item">
                            <div class="label">Questions</div>
                            <div class="value">${interview.qtnsCount}</div>
                        </div>
                        <div class="summary-item">
                            <div class="label">Overall Score</div>
                            <div class="value">${overallFeedback.overallScore}/10</div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <h2 class="card-title">Overall Feedback</h2>
                    <div class="feedback-block">
                        <h4>Strengths</h4>
                        <p>${overallFeedback.strengths}</p>
                    </div>
                    <div class="feedback-block">
                        <h4>Weaknesses</h4>
                        <p>${overallFeedback.weaknesses}</p>
                    </div>
                    <div class="feedback-block">
                        <h4>Suggestions</h4>
                        <p>${overallFeedback.suggestions}</p>
                    </div>
                    <div class="feedback-block">
                        <h4>Summary</h4>
                        <p>${overallFeedback.overallFeedback}</p>
                    </div>
                </div>

                <div class="card">
                    <h2 class="card-title">Question-wise Evaluation</h2>
                    ${questionsHtml}
                </div>

                <div class="footer">
                    Generated by ${APP_NAME}
                </div>
            </body>
        </html>
    `;
};

export { generateInterviewReportHtml };
