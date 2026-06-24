# 🚀 AI Resume Analyzer

An AI-powered recruitment automation system built with **n8n**, **Groq AI**, and **Supabase** that automatically analyzes resumes received via email, matches them against job descriptions, generates ATS scores, and displays results on a recruiter dashboard.

---

## 🎯 Problem Statement

Recruiters often spend significant time manually reviewing resumes and comparing them against job requirements.

This workflow automates the entire screening process by:

* Receiving resumes via email
* Extracting PDF content
* Analyzing candidate profiles using AI
* Matching skills against job descriptions
* Generating ATS compatibility scores
* Displaying results on a dashboard

---

## ✨ Features

✅ Automated Resume Processing

✅ Email-Based Resume Collection

✅ PDF Text Extraction

✅ AI-Powered Resume Analysis

✅ ATS Score Generation

✅ Skill Matching Against Job Description

✅ Structured Candidate Feedback

✅ Dashboard Visualization

---

## 🛠 Tech Stack

| Technology | Purpose             |
| ---------- | ------------------- |
| n8n        | Workflow Automation |
| Groq API   | AI Analysis         |
| JavaScript | Data Processing     |
| Supabase   | Database & Storage  |
| Webhooks   | Workflow Triggering |

---

## 🔄 Workflow Architecture

### How It Works

1. Candidate submits a resume via email.
2. n8n automatically receives the email attachment.
3. Resume content is extracted from the PDF.
4. AI analyzes skills, experience, and qualifications.
5. ATS score is calculated based on job requirements.
6. Results are stored in Supabase.
7. Recruiters view the analysis through the dashboard.

### Workflow Flow

```text
📧 Resume Received
        ↓
📄 PDF Extraction
        ↓
🤖 AI Analysis
        ↓
🎯 JD Skill Matching
        ↓
📊 ATS Score Generation
        ↓
🗄 Store in Supabase
        ↓
📈 Recruiter Dashboard
```

---

## 📸 Screenshots

### n8n Workflow

![Workflow](screenshots/workflow.png)

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Sample Analysis

![Analysis](screenshots/output.png)

---

## ⚙️ Installation

1. Clone the repository
2. Import `workflow.json` into n8n
3. Configure required credentials
4. Connect Supabase
5. Add Groq API credentials
6. Activate the workflow

---

## 🔑 Required Credentials

* Groq API Key
* Supabase Credentials
* Email Trigger Credentials

> Credentials are not included in this repository for security reasons.

---

## 📊 Sample Output

```json
{
  "candidate_name": "John Doe",
  "score": 82,
  "matched_skills": [
    "React",
    "Node.js"
  ]
}
```

---

## 📚 Key Learnings

* Workflow Automation using n8n
* AI Integration with Groq
* Resume Parsing & Analysis
* Database Management with Supabase
* Error Handling & Validation
* End-to-End Recruitment Automation

---

## 🚧 Project Status

Archived Project

This project is no longer actively maintained. The workflow and dashboard are preserved for portfolio and learning purposes.

---

## 👨‍💻 Author

Naitik Kr. Bharduwaj

B.Tech CSE | Automation Developer
