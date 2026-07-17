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
            </div
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
                    :root {
                        --primary: #1E3A5F;
                        --primary-light: #2B4C78;
                        --dark: #0B1120;
                        --accent: #7C3AED;
                        --background: #F8FAFC;
                        --border: #E2E8F0;
                        --muted: #64748B;
                    }
                    * {
                        box-sizing: border-box;
                    }
                    body {
                        margin: 40px;
                        background: var(--background);
                        color: var(--dark);
                        font-family:
                            Inter,
                            Arial,
                            Helvetica,
                            sans-serif;
                        line-height: 1.65;
                    }
                    h1,
                    h2,
                    h3,
                    h4 {
                        margin: 0;
                    }
                    .report-title {
                        margin-bottom: 8px;
                        color: var(--primary);
                        font-size: 32px;
                        font-weight: 700;
                    }
                    .subtitle {
                        margin-bottom: 32px;
                        color: var(--muted);
                    }
                    .card {
                        margin-bottom: 28px;
                        padding: 22px;
                        background: white;
                        border: 1px solid var(--border);
                        border-radius: 14px;
                    }
                    .summary-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 18px;
                    }
                    .summary-item {
                        padding: 14px;
                        border-radius: 10px;
                        background: #F8FAFC;
                        border: 1px solid var(--border);
                    }
                    .label {
                        color: var(--muted);
                        font-size: 13px;
                        margin-bottom: 4px;
                    }
                    .value {
                        font-size: 18px;
                        font-weight: 600;
                    }
                    .feedback-title {
                        color: var(--primary);
                        margin-bottom: 10px;
                    }
                    .feedback-block {
                        margin-bottom: 18px;
                    }
                    .feedback-block h4 {
                        color: var(--accent);
                        margin-bottom: 6px;
                    }
                    .question-card {
                        margin-bottom: 24px;
                        padding: 18px;
                        border: 1px solid var(--border);
                        border-radius: 12px;
                    }
                    .question-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 18px;
                    }
                    .question-number {
                        font-weight: 700;
                        color: var(--primary);
                    }
                    .score-badge {
                        padding: 6px 12px;
                        border-radius: 999px;
                        background: var(--primary);
                        color: white;
                        font-size: 13px;
                        font-weight: 600;
                    }
                    .section {
                        margin-bottom: 16px;
                    }
                    .section h4 {
                        margin-bottom: 6px;
                        color: var(--primary);
                    }
                    .footer {
                        margin-top: 40px;
                        text-align: center;
                        font-size: 12px;
                        color: var(--muted);
                    }
                </style>
            </head>
            <body>
                <h1 class="report-title">
                    AI Mock Interview Report
                </h1>
                <p class="subtitle">
                    Generated automatically after interview completion.
                </p>
                <div class="card">
                    <h2 class="feedback-title">
                        Interview Summary
                    </h2>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <div class="label">Name</div>
                            <div class="value">
                                ${user.fullName}
                            </div>
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
                            <div class="value">
                                ${interview.role}
                            </div>
                        </div>
                        <div class="summary-item">
                            <div class="label">Difficulty</div>
                            <div class="value">
                                ${interview.difficulty}
                            </div>
                        </div>
                        <div class="summary-item">
                            <div class="label">Questions</div>
                            <div class="value">
                                ${interview.qtnsCount}
                            </div>
                        </div>
                        <div class="summary-item">
                            <div class="label">Overall Score</div>
                            <div class="value">
                                ${overallFeedback.overallScore}/10
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <h2 class="feedback-title">
                        Overall Feedback
                    </h2>
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
                    <h2 class="feedback-title">
                        Question-wise Evaluation
                    </h2>
                    ${questionsHtml}
                </div>
                <div class="footer">
                    Generated by ${APP_NAME}
                </div>
            </body>
        </html>
    `;
};

export {
    generateInterviewReportHtml
};
