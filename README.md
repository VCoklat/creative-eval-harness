# Creative Eval Harness 

An end-to-end autonomous LLM Control Loop & Evaluation System built with Next.js 14, TypeScript, and the Google AI Studio SDK.

🔗 **Live Production Deployment:** [https://creative-eval-harness-opal.vercel.app/](https://creative-eval-harness-opal.vercel.app/)

---

## System Architecture & Execution Flow

```text
+------------------------------------------------------------------------------------+
|                                Next.js UI / Dashboard                              |
|                    (User Prompt Input & Real-Time Telemetry)                       |
+------------------------------------------------------------------------------------+
                                         |
                                         | POST /api/generate
                                         v
+------------------------------------------------------------------------------------+
|                          Serverless Control Loop Engine                            |
|                 (app/api/generate/route.ts | maxDuration = 60s)                      |
+------------------------------------------------------------------------------------+
                                   |              ^
                 Attempt i = 1..N  |              | Feedback Loop Context
                                   v              | (If rejected & attempts left)
+-------------------------------------------------+----------------------------------+
| STEP 1: Scene Generation                                                           |
| Model: gemma-4-26b-a4b-it                                                          |
| Role: Specialized Creative Scriptwriter & Camera Director                          |
+------------------------------------------------------------------------------------+
                                         |
                                         v Raw Response
+------------------------------------------------------------------------------------+
| STEP 2: Fault-Tolerant Parsing & Sanitization                                      |
| Function: parseJsonFromLlm<T>() (lib/utils.ts)                                     |
| Role: Brace-Depth Tracking Engine isolates 1st valid JSON object                    |
+------------------------------------------------------------------------------------+
                                         |
                                         v Cleaned SceneDraft Payload
+------------------------------------------------------------------------------------+
| STEP 3: LLM Quality Gate & Evaluation                                              |
| Model: gemma-4-31b-it                                                              |
| Role: Senior Film Director / Judge Scoring (Cinematic Lighting & Action Clarity)   |
+------------------------------------------------------------------------------------+
                                         |
                    +--------------------+--------------------+
                    |                                         |
         [ Approved (Scores >= 4/5) ]               [ Rejected (Scores < 4/5) ]
                    |                                         |
                    v                                         v
        Return Payload to Dashboard               If attempt <= maxRetries:
        (Telemetry, Latency, Scores)              Inject Feedback & Retry Step 1

```

---

## Core Architectural Principles

### 1. Autonomous Control Loop & Self-Correction

* **Closed Loop Feedback:** The orchestrator runs an agent loop. When the judge (`gemma-4-31b-it`) flags issues in action clarity or visual lighting, the critique is injected directly into the prompt context of the generator for the next pass.
* **Deterministic Termination:** Ensures bounded execution via strict retry caps (`maxRetries = 2`) and serverless execution timeouts (`maxDuration = 60`).

### 2. Specialist Dual-Model Routing

* **Generator (`gemma-4-26b-a4b-it`):** High-throughput model specialized for narrative flow, visual beat generation, and technical camera angle specifications.
* **Evaluator / Judge (`gemma-4-31b-it`):** High-reasoning model operating as an unbiased quality filter to prevent self-evaluation bias.

### 3. Resilience Engine (Brace-Depth JSON Extractor)

* **Zero-Break Parsing:** Uses string boundary tracking and balanced curly-brace depth counters (`{ ... }`) in `lib/utils.ts`.
* **LLM Fluff Isolation:** Strips markdown code-block wrappers (````json`), trailing conversational remarks, and extraneous JSON payloads without triggering `SyntaxError` crashes.

---

## Tech Stack

* **Framework:** Next.js 14 (App Router) & React 18
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **LLM SDK:** Google AI Studio (`@google/generative-ai`)
* **Deployment Platform:** Vercel (Serverless Edge Infrastructure)

---

## Local Setup & Installation

1. **Clone the repository:**
```bash
git clone https://github.com/vcoklat/creative-eval-harness.git
cd creative-eval-harness

```


2. **Install dependencies:**
```bash
npm install

```


3. **Configure Environment Variables:**
Create a `.env.local` file in the project root:
```env
GEMINI_API_KEY=your_google_ai_studio_api_key_here

```


4. **Start the development server:**
```bash
npm run dev

```


Open [http://localhost:3000](http://localhost:3000) in your browser.

```

```