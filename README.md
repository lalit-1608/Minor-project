# StudySnippet — Misconception-Aware Learning & Educational Feedback Analytics Research Platform

A research-oriented educational technology prototype investigating **Cognitive Diagnostics**, **Usability Engineering (HCI)**, and **Transparent Educational Feedback Analytics**.

---

## 🏛️ Project Scope: The Three Connected Research Pillars

### Pillar 1: Cognitive & Diagnostic Learning
- **Engineered Distractor Traps**: Diagnostic multiple-choice items designed around intuitive cognitive fallacies (e.g., *Base Rate Neglect*, *Pass-by-Value Reference Mutation Confusion*, *Superficial Big-O Pattern Matching*, *Signed Integer Arithmetic Overflow*).
- **Metacognitive Calibration**: Learners record certainty (50% Guess, 75% Likely, 100% Certain) prior to submission to detect *High-Confidence False Beliefs* that may indicate strongly held misconceptions.
- **Immediate Retake Analysis**: Compares initial error rates against immediate post-feedback retakes to assess immediate error reduction following explanatory feedback.
- *Notice on Data*: Demonstration curves in the prototype are synthetic illustrative examples; empirical conclusions require controlled participant study cohorts.

### Pillar 2: HCI & Usability Research
- **Standardized Usability Evaluation**: Validated 10-item System Usability Scale (Brooke, 1996) instrument with alternating positive and negative items, calculated on the standard 0–100 scale.
- **Cognitive Load-Conscious Interface**: Clean, accessible layout designed to minimize extraneous interface friction during learning and evaluation tasks.
- **Task Observation Telemetry**: Prototype framework prepared for recording task completion times under controlled user observation trials.

### Pillar 3: Educational Feedback Analytics & Action Loop
- **Transparent Rule-Based Categorization**: Deterministic, interpretable keyword categorization of qualitative student comments into actionable pedagogical themes without black-box AI claims.
- **Feedback-to-Action Loop**: Structured mechanism for educators to document concrete instructional adjustments in response to student feedback, verified under academic oversight.
- **Privacy Safeguard**: Student identity is not stored with submitted evaluations in this prototype.

---

## 🔬 Scientific Integrity & Data Provenance Notice

- **Demo vs. Collected Data**: Demonstration records are synthetic and provided solely to illustrate interface functionality. They are never merged silently with genuine participant responses.
- **No Fabricated Findings**: This prototype does not claim completed clinical trials, IRB approval, or publication acceptance. All empirical metrics require live participant data collection.
- **Scale Scores**: SUS scores are reported strictly as standardized 0–100 scale scores, not as percentages or arbitrary letter grades.

---

## 🔐 Role-Separated Demo Authentication & Prototype Personas

StudySnippet implements role-separated authentication to provide appropriate access control across research participants, educators, and academic oversight. Switching between roles requires ending the active session and re-authenticating with the target credentials on `/login`.

| Role Persona | Demonstration Email | Demo Password | Primary Interfaces & Access Scope |
| :--- | :--- | :--- | :--- |
| **Learner (Student)** | `rahul.chauhan@apex.edu` | `Student@123` | Diagnostic Quiz (`/quiz`), Course Feedback (`/feedback`), Usability Survey (`/hci-research`) |
| **Educator (Faculty)** | `ashok.rathi@apex.edu` | `Faculty@123` | Faculty Dossier (`/faculty/fac-1`), Feedback Records (`/feedback-records`), Pedagogical Adjustments (`/pedagogical-adjustments`) |
| **Academic Oversight (Principal)** | `rajesh.verma@apex.edu` | `Principal@123` | Institutional Analytics (`/dashboard`), Multi-Attribute Compare (`/compare`), Institutional Reports (`/reports`), Settings (`/settings`) |

> **Prototype Authentication Notice**: Role authentication in this prototype is implemented client-side for academic demonstration purposes. Production deployment requires server-side authentication, secure password hashing (e.g., Argon2/bcrypt), rate-limiting, and signed authorization tokens (JWT/OAuth2). No production-grade security or encryption claims are made for this demonstration prototype.

---

## 🚀 Key Routes & Navigation Map

- `/`: Research Platform Landing Page & Research Pillar Overview
- `/research`: Comprehensive Research Problem, Workflows & Provenance Documentation
- `/quiz`: Diagnostic Misconception & Logical Trap Assessment
- `/misconceptions`: Misconception Analytics & Immediate Retake Comparison
- `/hci-research`: System Usability Scale (SUS) Evaluation & Task Observation
- `/pedagogical-adjustments`: Closed-Loop Teaching Adjustments Tracker
- `/dashboard`: Institutional Educational Analytics (Academic Oversight)
- `/feedback`: Anonymous Course Feedback Submission Wizard
- `/faculty`: Faculty Directory (Supporting Interface)
- `/faculty/:id`: Faculty Teaching Dossier & Parameter Breakdown
- `/subjects`: Course Directory
- `/compare`: Comparative Multi-Attribute Parameter Comparison
- `/feedback-records`: Feedback Records Audit Trail & CSV Export
- `/reports`: Statistical Export Center (JSON, CSV)
- `/settings`: Platform Configuration & Theme Settings

---

## 🛠️ Technology Stack

- **Frontend**: React 19, React Router 7, Tailwind CSS, Lucide React, Recharts, Canvas-Confetti
- **Build System**: Vite 8
- **State & Data Layer**: LocalStorage with Promise-based abstraction (`src/services/dataService.js`)
- **Research Utilities**:
  - `src/services/quizData.js`: Cognitive trap definitions, distractor taxonomy, dynamic attempt calculations
  - `src/components/hci/SUSSurveyModal.jsx`: Brooke (1996) 10-item standard SUS psychometric calculator
  - `src/utils/sentiment.js`: Transparent rule-based keyword sentiment categorization
  - `src/utils/session.js`: Anonymous client session token for duplicate submission prevention

---

## 💻 Quick Start & Portable Installation Guide

This portable package is ready to run independently on any Windows laptop without requiring pre-installed global build tools.

### 1. System Requirements & Prerequisites
- **Operating System**: Windows 10 or Windows 11 (64-bit recommended)
- **Node.js**: Version **18.x** or **20.x+ LTS** installed on your system
  - *To check*: Open Command Prompt and type `node -v`
  - *If not installed*: Download the LTS installer from [https://nodejs.org/](https://nodejs.org/) and accept the default settings (ensuring "Add to PATH" is checked).
- **Web Browser**: **Google Chrome** (recommended for optimal layout fidelity) or Microsoft Edge
- **Internet Connection**: Required only once during the initial dependency installation (`npm install`)

### 2. How to Extract the Project
1. Locate `StudySnippet_Research_Project_FINAL.zip`.
2. Right-click the `.zip` file and select **"Extract All..."**.
3. Choose any destination directory (e.g., `C:\StudySnippet` or your Desktop).
4. Click **Extract**.

### 3. Option A — One-Click Launch via Windows Batch File (Recommended)
1. Open the extracted project folder.
2. Double-click **`run.bat`** (or **`start.bat`**).
3. The launcher will automatically:
   - Verify that Node.js and npm are installed and in your PATH.
   - Detect if dependencies are missing, and run `npm install` automatically on the first launch (takes 1–2 minutes).
   - Display the application URL: `http://localhost:5173`.
   - Launch Google Chrome / your default browser automatically.
   - Start the Vite local development server.
4. Keep the command prompt window open while using the platform. To stop the server, press `Ctrl + C` in the command prompt.

### 4. Option B — Manual Launch via Terminal / Command Prompt
If you prefer running commands manually:
1. Open Command Prompt or PowerShell in the project directory.
2. Install dependencies (first-time only):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open Google Chrome and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🔑 Demonstration Accounts & Credentials

StudySnippet enforces strict role-based access control. Use the following credentials on `/login`:

| Role Persona | Demo Email | Demo Password | Default Landing Page | Key Features to Test |
| :--- | :--- | :--- | :--- | :--- |
| **Student (Learner)** | `rahul.chauhan@apex.edu` | `Student@123` | `/my-learning` | Diagnostic Quizzes, Confidence Calibration, Misconceptions, Usability Survey |
| **Faculty (Teacher)** | `ashok.rathi@apex.edu` | `Faculty@123` | `/educator` | Educational Content Studio (Snippets & Diagnostic Questions), Teaching Dossier |
| **Principal (Admin)** | `rajesh.verma@apex.edu` | `Principal@123` | `/dashboard` | Institutional Analytics, Multi-Attribute Faculty Compare, Reports, Settings |

> **Note on Switching Roles**: Because access boundaries are strictly isolated, switching between roles requires clicking **Logout** in the sidebar/header and logging in with the target role credentials on the `/login` page.

---

## 🔧 Basic Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **`'node' is not recognized`** | Node.js is not installed or not in PATH | Download and install Node.js LTS from [nodejs.org](https://nodejs.org/). Restart Command Prompt / computer after installing. |
| **`Port 5173 is already in use`** | Another instance or application is using port 5173 | Vite will either automatically select port 5174, or you can terminate existing node processes via Windows Task Manager. |
| **`npm install fails`** | Internet connection dropped or firewall restriction | Verify internet access and re-run `npm install` manually in Command Prompt. |
| **Blank white page in browser** | JavaScript disabled or cached outdated bundle | Open DevTools (`F12`), check Console, and perform a hard refresh with `Ctrl + F5`. |

---

## 💾 LocalStorage Architecture & Demo Data Behavior

- **Client-Side Persistence**: All prototype data (diagnostic attempts, submitted feedback, pedagogical adjustments, and active session state) is stored in the browser's `localStorage` under namespaced keys (`studysnippet_*`).
- **Data Provenance**: Seed demonstration records are synthetic and marked with explicit `Demo Data` badges. Genuine student submissions during your session are tagged with `Collected Data` badges.
- **Resetting Prototype State**: To reset the platform back to its clean initial state, navigate to **Settings** (`/settings`) and click **"Reset Demo Data"**, or clear `localStorage` via browser DevTools (`F12` → Application → Local Storage → Clear).

