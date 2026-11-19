<div align="center">

# 🗳️ Poll App

### Create. Share. Vote.

A responsive survey application built with **Angular 21** and **Supabase**.

Create surveys, vote on them, and watch the results update live — all in one place.

<p>
  <img src="https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white" alt="Angular 21" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5.9" />
  <img src="https://img.shields.io/badge/SCSS-Styles-CC6699?logo=sass&logoColor=white" alt="SCSS" />
  <img src="https://img.shields.io/badge/Supabase-Realtime-3ECF8E?logo=supabase&logoColor=white" alt="Supabase Realtime" />
  <img src="https://img.shields.io/badge/Vitest-Tests-6E9F18?logo=vitest&logoColor=white" alt="Vitest" />
</p>

<p>
  <a href="#-features">Features</a> ·
  <a href="#-getting-started">Getting Started</a> ·
  <a href="#-architecture">Architecture</a> ·
  <a href="#-data-model">Data Model</a> ·
  <a href="#-development">Development</a>
</p>

</div>

---

## ✨ Features

<table>
  <tr>
    <td width="50%">
      <h3>📝 Create surveys</h3>
      Create surveys with a name, category, end date, description and any number of questions with answer options — in a global dialog that can be opened from every page.
    </td>
    <td width="50%">
      <h3>🗳️ Vote</h3>
      Open an active survey, choose your answers (single or multiple choice) and submit them. Afterwards your selection stays visible and is locked.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📊 Live results</h3>
      Each question shows vote counts and percentages as progress bars. Supabase Realtime keeps all connected clients in sync.
    </td>
    <td width="50%">
      <h3>🔎 Survey overview</h3>
      Switch between active and past surveys, filter by category and jump directly to the surveys that are ending soon.
    </td>
  </tr>
</table>

Additional details:

- ☑️ Single-choice questions automatically deselect the other answers; multiple-choice questions show a hint.
- 🔤 Answers are labeled `A`, `B`, `C`, … and questions automatically get a capitalized first letter and a trailing `?`.
- ⏳ The **Ending soon** section shows the 3 active surveys with the nearest end date.
- 📅 Active surveys show `Ends in <n> days`, past surveys show `Ended on <date>`.
- 🔒 Expired surveys can no longer be completed (a survey is active until 23:59:59 on its end date).
- ✅ Publishing a survey shows a confirmation for 4 seconds and resets the form.
- ♿ The hero animation respects `prefers-reduced-motion`.
- 📱 Responsive layout.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Angular 21](https://angular.dev/) | Framework (standalone components, signals) |
| [TypeScript 5.9](https://www.typescriptlang.org/) | Application logic |
| SCSS | Styling |
| Angular Reactive Forms | Survey form and voting form |
| Angular Router | Client-side navigation |
| [Supabase](https://supabase.com/) (`@supabase/supabase-js`) | Database and realtime synchronization |
| [Vitest](https://vitest.dev/) + jsdom | Unit tests |
| Prettier | Code formatting |
| npm 11 | Package management |

Fonts (self-hosted in `public/assets/fonts/`): **Mulish**, **Nerko One**, **Nokora**.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (active LTS release)
- npm 11 or later
- A [Supabase](https://supabase.com/) project

### 1. Clone the repository

```bash
git clone https://github.com/krummi14/Project-PollApp.git
cd Project-PollApp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Supabase

The Supabase client is created in
[`src/app/components/shared/services/supabase.ts`](src/app/components/shared/services/supabase.ts)
(`SupabaseService`). Replace the project URL and the publishable key with the values of your own project.

The application needs two tables — `surveys` and `survey_responses` — with Realtime enabled. See [Supabase setup](#-supabase-setup--security) below.

> [!IMPORTANT]
> Only use a **publishable / anon** key in browser code — never the `service_role` key. Control access with Row Level Security (RLS) policies.

### 4. Start the application

```bash
npm start
```

`ng serve -o` starts the development server and opens **http://localhost:4200/** in your browser. The app rebuilds automatically when source files change.

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start the dev server and open the browser (`ng serve -o`) |
| `npm run build` | Create a production build in `dist/pollapp/` |
| `npm run watch` | Development build in watch mode |
| `npm test` | Run the unit tests with Vitest (`ng test`) |
| `npm run ng -- <command>` | Run any Angular CLI command |

## 🔄 Application Workflow

### 📝 Creating and publishing a survey

1. Click **Create survey** on the home page (or in the header of a single survey).
2. The create-survey dialog opens as an overlay. Clicking outside of it closes it again.
3. Enter a survey name, choose a **category** (required), set an end date and an optional description.
4. Add questions with answer options (each new question starts with two answers) and enable **multiple choice** where needed.
5. Click **Publish**.

The survey is inserted into `surveys`, an empty entry is created in `survey_responses`, a confirmation is shown and the form is reset.

### 🗳️ Completing a survey

1. Open a survey from the overview or the *Ending soon* list (`/showSingleSurvey/:id`).
2. Select your answers.
3. Click **Complete survey**.

After a successful submission:

- The new answers are merged into the existing responses in Supabase.
- The form is disabled, your selection remains visible.
- The button changes to **Back to home** and navigates to `/`.
- The results next to the form update immediately (and on all other clients via Realtime).

### 📅 Survey status

| Status | Condition | Display |
|---|---|---|
| Active | End date is today or in the future | `Ends in <n> days`, can be completed |
| Ending soon | One of the 3 active surveys with the nearest end date | Listed in *Ending soon* |
| Past | End date is in the past | `Ended on <date>`, can no longer be completed |

### 🏷️ Categories

Defined in [`survey-categories.ts`](src/app/components/shared/utils/survey-categories.ts):

| Value | Label |
|---|---|
| `allSurveys` | All Surveys (filter only) |
| `teamActivities` | Team Activities |
| `healthAndWellness` | Health & Wellness |
| `gaming` | Gaming & Entertainment |
| `educationAndLearning` | Education & Learning |
| `lifestyleAndPreferences` | Lifestyle & Preferences |
| `technologyAndInnovation` | Technology & Innovation |

## 🏗️ Architecture

```text
src/
├── index.html
├── main.ts
├── styles.scss
├── styles/base/                         # base styles and @font-face definitions
└── app/
    ├── app.ts / app.html                # router outlet + global create-survey dialog
    ├── app.config.ts
    ├── app.routes.ts
    └── components/
        ├── home/
        │   ├── header/
        │   ├── new-survey/              # intro text + hero animation
        │   ├── intro-text/
        │   ├── animation/
        │   └── surveys/
        │       ├── overview/            # active/past toggle, category filter, cards
        │       │   ├── card/
        │       │   └── selector-button/
        │       ├── dropdown-menu/       # category filter
        │       └── are-ending-soon/
        │           └── ending-survey/
        ├── create-new-survey-template/
        │   ├── header/
        │   ├── survey-form/
        │   ├── add-new-question/
        │   └── add-new-answer-button/
        ├── single-survey-view/
        │   ├── content/                 # voting form
        │   └── results/                 # vote statistics
        └── shared/
            ├── button/ second-button/ delete-button/ progress-bar/
            ├── interfaces/              # Survey, SurveyResponse
            ├── templates/               # Surveytemplate, SurveyResponseTemplate
            ├── pipes/                   # capitalize, addQuestionMark
            ├── services/                # SupabaseService, Dialog
            └── utils/                   # dates, statistics, categories, merging
```

### 🧭 Routes

| Route | Component | Purpose |
|---|---|---|
| `/` | `Home` | Overview, *Ending soon*, create surveys |
| `/create_new_survey` | `CreateNewSurveyTemplate` | Survey form as a standalone page |
| `/showSingleSurvey/:id` | `SingleSurveyView` | Vote on a survey and see its results |
| `**` | — | Redirect to `/` |

### ⚡ State and data flow

**`SupabaseService`** (root-provided) is the single place for database access and holds the app state as signals:

| Member | Description |
|---|---|
| `surveys` | `signal<Survey[]>` — all surveys |
| `surveyResponses` | `signal<Record<number, SurveyResponse \| null>>` — responses per survey ID |
| `getAllSurveys()` | Loads `surveys` and `survey_responses` in parallel |
| `createSurvey()` | Inserts a survey and its empty response entry |
| `updateSurvey()` / `deleteSurvey()` | Updates / deletes a survey |
| `submitSurveyResponse()` | Loads existing responses, merges the new ones and saves them |
| `getSurveyResponse()` | Loads the responses of a single survey |

1. Components read data via `computed` signals derived from `surveys` and `surveyResponses`.
2. Writes go to Supabase; the local signals are updated after a successful write.
3. A Realtime channel (`survey-changes`) listens for `INSERT`, `UPDATE` and `DELETE` on both tables and updates the signals on all clients.

**`Dialog`** (root-provided) controls the global create-survey overlay via the `openedCreateSurveyDialog` signal.

### 🧩 Shared utilities

| File | Content |
|---|---|
| `ends-in-days.ts` | `surveyEndsIn()` (days remaining), `isSurveyAvailable()` (active until end of the end date) |
| `surveys-ending-soon.ts` | `loadSurveysEndingSoon()` — active surveys sorted by end date (default: 3) |
| `response-statistic.ts` | Vote count per answer / question and percentages |
| `survey-response.ts` | `mergeSurveyResponses()` incl. validation and support for the legacy format |
| `answer-label.ts` | `getAnswerLabel()` — `0 → A`, `1 → B`, … |
| `survey-categories.ts` | `SURVEY_CATEGORIES` |

## 🗄️ Data Model

### `Survey` — table `surveys`

```ts
interface Survey {
  id?: number;
  name: string;
  date: string;          // end date, YYYY-MM-DD
  category: string;      // value from SURVEY_CATEGORIES
  description: string;
  questions: Question[]; // stored as JSON
  response?: SurveyResponse;
}

interface Question {
  question: string;
  multipleChoice: boolean;
  answers: string[];
}
```

### `SurveyResponse` — table `survey_responses`, column `responses`

```ts
interface SurveyResponse {
  surveyId: number;
  questions: {
    questionIndex: number;
    question: string;
    answers: {
      answerIndex: number;
      answer: string;
      selected: boolean[]; // one `true` per vote
    }[];
  }[];
}
```

Every submission appends its selections to the `selected` arrays, so the number of votes for an answer is the number of `true` entries. Older responses stored as a flat `{ "question0Answer1": true }` object are converted automatically when merging.

## 🔐 Supabase Setup & Security

Example schema (adjust to your needs):

```sql
create table public.surveys (
  id          bigint generated always as identity primary key,
  name        text not null,
  date        date not null,
  category    text not null,
  description text,
  questions   jsonb not null default '[]'
);

create table public.survey_responses (
  survey_id bigint primary key references public.surveys (id) on delete cascade,
  responses jsonb
);

-- Enable Realtime for both tables
alter publication supabase_realtime add table public.surveys, public.survey_responses;
```

Before deploying, check that:

- Row Level Security is enabled on both tables.
- Policies allow the required `select`, `insert`, `update` (and `delete`, if used).
- Realtime is enabled for `surveys` **and** `survey_responses`.

## 💻 Development

### Code guidelines

- Standalone components, no NgModules.
- Logic in `.ts`, template in `.html`, scoped styles in `.scss`.
- Signals and `computed` for shared state and derived views.
- Reactive Forms for the survey form and the voting form.
- Reusable domain logic belongs in `shared/utils`, Supabase access only in `SupabaseService`.

### Tests

Unit tests (`*.spec.ts`) live next to the code and run with Vitest:

```bash
npm test
```

### Build

```bash
npm run build
```

The output is written to `dist/pollapp/`. Production budgets (`angular.json`):

| Budget | Warning | Error |
|---|---|---|
| Initial bundle | 500 kB | 1 MB |
| Component style | 4 kB | 8 kB |

## 🧰 Troubleshooting

<details>
  <summary><strong>🔌 The app cannot connect to Supabase</strong></summary>

  - Check the URL and key in `supabase.ts`.
  - Check the network tab of your browser for Supabase errors.
  - Check the RLS policies and the table names `surveys` / `survey_responses`.

</details>

<details>
  <summary><strong>⚡ Realtime updates do not appear</strong></summary>

  - Make sure both tables are part of the `supabase_realtime` publication.
  - Make sure the browser can open a WebSocket connection.

</details>

<details>
  <summary><strong>🍪 A __cf_bm cookie warning appears</strong></summary>

  Supabase can emit a Cloudflare bot-management cookie warning during the Realtime WebSocket handshake. This alone does not mean the connection failed — check whether surveys and results actually update.

</details>

<details>
  <summary><strong>🗳️ "This survey has ended and can no longer be completed."</strong></summary>

  The end date of the survey is in the past. Past surveys are read-only and only show their results.

</details>

## 📄 License

No license file is included yet. Add one before distributing the project.

---

<div align="center">

**Built with ❤️ using Angular and Supabase**

<sub>Poll App · Create. Share. Vote.</sub>

</div>
