# StudySnippet — Misconception-Aware Learning & Educational Feedback Analytics Research Platform

## gstack
Use the `/browse` skill from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools.

### Available gstack skills:
- `/office-hours`: Product interrogation with 6 forcing questions
- `/plan-ceo-review`: Strategic challenge with 4 scope modes
- `/plan-eng-review`: Lock in architecture, data flow, diagrams, edge cases, and tests
- `/plan-design-review`: UI/UX design review and refinement
- `/design-consultation`: Build complete design system
- `/design-shotgun`: Design exploration and comparison boards
- `/design-html`: Convert mockups to production-ready dynamic HTML
- `/review`: Staff engineer code review and auto-fix
- `/ship`: Run tests, audit coverage, commit, and push PR
- `/land-and-deploy`: Merge PR, verify CI and production deployment
- `/canary`: Post-deploy monitoring loop
- `/benchmark`: Core Web Vitals and load performance baseline
- `/browse`: QA browser automation and test verification
- `/connect-chrome`: Connect external Chrome instance
- `/qa`: Automated browser QA testing and bug auto-fix
- `/qa-only`: QA bug report generation without code changes
- `/design-review`: Live design audit and polish
- `/scrape`: Structured data extraction
- `/setup-browser-cookies`: Cookie session import
- `/setup-deploy`: Deployment configuration
- `/setup-gbrain`: GBrain vector knowledge base onboarding
- `/retro`: Weekly engineering retrospective
- `/investigate`: Systematic root-cause debugging
- `/document-release`: Synchronize documentation with shipped features
- `/document-generate`: Author comprehensive Diataxis documentation
- `/codex`: Second-opinion code review
- `/cso`: OWASP Top 10 + STRIDE threat security audit
- `/autoplan`: End-to-end automated plan generation pipeline
- `/plan-devex-review`: Developer experience audit
- `/devex-review`: Live onboarding and DX verification
- `/careful`: Destructive command guardrails
- `/freeze`: Edit lock boundaries
- `/guard`: Full safety combination (/careful + /freeze)
- `/unfreeze`: Remove edit lock
- `/gstack-upgrade`: Self-updater
- `/learn`: Compound project learnings and patterns across sessions

---

## Project Overview
StudySnippet is an educational technology research platform investigating misconception-aware learning, usability engineering, and feedback-driven pedagogical interventions.
- **Frontend Stack**: React 19, Vite 8, Tailwind CSS, Recharts, Lucide React, React Router 7
- **Persistence Layer**: LocalStorage with pure Promise abstraction in `src/services/dataService.js` (ready for Supabase)
- **Calculations & Analytics Engine**: `src/utils/calculations.js`
- **Anonymity & Duplicate Protection**: Anonymous browser session identifier used for duplicate-prevention in the prototype (`src/utils/session.js`). Student identity is not stored with submitted evaluations.
