# AI Resume Analyzer

An AI-powered Resume Analyzer built using n8n automation workflows. The system extracts resume data, analyzes skills, calculates ATS compatibility scores, and generates structured feedback.

## Features

* Resume Upload Processing from mail trigger 
* PDF Text Extraction
* AI-Powered Resume Analysis
* ATS Score Calculation
* Skill Matching from JD
* Structured JSON Output
* Dashboard Visualization

## Tech Stack

* n8n
* Groq API
* JavaScript
* Webhooks
* SuperBase

## Workflow Architecture

1. **Candidate sends a resume via email**

   * The system automatically receives incoming resumes through a dedicated email inbox.

2. **Resume is extracted and processed**

   * The PDF file is downloaded and its text content is extracted using n8n.

3. **AI analyzes the resume**

   * The extracted content is sent to an AI model to identify skills, experience, education, and other relevant information.

4. **ATS compatibility score is generated**

   * The resume is evaluated against predefined hiring criteria and an ATS-style score is calculated.

5. **Results are stored and displayed**

   * Analysis results, scores, and feedback are saved and displayed on the dashboard for easy review by recruiters.

## Workflow Flow

```text
Email Resume
     ↓
Extract PDF Content
     ↓
Analyze Resume with AI
     ↓
Generate ATS Score
     ↓
Display Results on Dashboard
```



### Workflow

<img width="1351" height="821" alt="image" src="https://github.com/user-attachments/assets/79bbe89e-10a4-4a73-8230-4f1a59f2287d" />


### Dashboard

<img width="1151" height="822" alt="image" src="https://github.com/user-attachments/assets/2dd8e155-573d-4670-845e-7ae5fa571717" />


<img width="1150" height="812" alt="image" src="https://github.com/user-attachments/assets/c0643ca9-36d3-48ea-884d-3622922587a5" />


## Installation

1. Clone this repository
2. Import the workflow JSON into n8n
3. Configure API credentials
4. Activate the workflow

## Environment Variables

groq_API_KEY
DATABASE_URL

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
* Database Management

## Project Status

⚠️ Archived Project

This project is no longer actively maintained. The workflow and dashboard are preserved for portfolio and learning purposes.

## Author

Naitik Kr. Bharduwaj 

B.Tech CSE |Automation Developer
