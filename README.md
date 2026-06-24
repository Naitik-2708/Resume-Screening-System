# AI Resume Analyzer

An AI-powered Resume Analyzer built using n8n automation workflows. The system extracts resume data, analyzes skills, calculates ATS compatibility scores, and generates structured feedback.

## Features

* Resume Upload Processing
* PDF Text Extraction
* AI-Powered Resume Analysis
* ATS Score Calculation
* Skill Matching
* Structured JSON Output
* Dashboard Visualization

## Tech Stack

* n8n
* Gemini API / OpenAI
* JavaScript
* Webhooks
* MongoDB (if used)

## Workflow Architecture

Resume Upload
    ↓
PDF Parser
    ↓
AI Analysis
    ↓
ATS Score Generation
    ↓
  Dashboard

## Screenshots

### Workflow

<img width="1351" height="821" alt="image" src="https://github.com/user-attachments/assets/79bbe89e-10a4-4a73-8230-4f1a59f2287d" />


### Dashboard



## Installation

1. Clone this repository
2. Import the workflow JSON into n8n
3. Configure API credentials
4. Activate the workflow

## Environment Variables

OPENAI_API_KEY=
GEMINI_API_KEY=
DATABASE_URL=

## Sample Output

{
"candidate_name": "XYCVBNM Doe",
"score": 82,
"matched_skills": ["React", "Node.js"]
}

## Key Learnings

* Workflow Automation
* API Integration
* AI Processing
* Data Transformation
* Error Handling

## Project Status

⚠️ Archived Project

This project is no longer actively maintained. The workflow and dashboard are preserved for portfolio and learning purposes.

## Author

Naitik Kr. Bharduwaj 

B.Tech CSE |Automation Developer
