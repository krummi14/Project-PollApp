<div align="center">

# 🗳️ Poll App

### Create. Share. Vote.

A responsive survey application built with **Angular 21** and **Supabase**.

Create surveys, collect feedback, and explore voting results — all in one place.

<p>
  <img src="https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white" alt="Angular 21" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5.9" />
  <img src="https://img.shields.io/badge/SCSS-Styles-CC6699?logo=sass&logoColor=white" alt="SCSS" />
  <img src="https://img.shields.io/badge/Supabase-Realtime-3ECF8E?logo=supabase&logoColor=white" alt="Supabase Realtime" />
</p>

<p>
  <a href="#-features">Features</a> ·
  <a href="#-getting-started">Getting Started</a> ·
  <a href="#-architecture">Architecture</a> ·
  <a href="#-development">Development</a>
</p>

</div>

---

## ✨ Features

<table>
  <tr>
    <td width="50%">
      <h3>📝 Survey Creation</h3>
      Create surveys with titles, categories, descriptions, optional end dates, questions, and answer options.
    </td>
    <td width="50%">
      <h3>🗳️ Voting</h3>
      Participate in active surveys, select answers, and review submitted responses.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>⚡ Live Results</h3>
      Keep connected clients synchronized with Supabase Realtime.
    </td>
    <td width="50%">
      <h3>📊 Survey Overview</h3>
      Browse active and past surveys, filter by category, and discover surveys ending soon.
    </td>
  </tr>
</table>

Additional features:

- 📌 Publish surveys with in-app confirmation.
- ☑️ Support single-choice and multiple-choice questions.
- 🔒 Keep submitted answers visible and prevent changes after submission.
- ⏳ Highlight surveys that are ending soon.
- 📅 Display expiration dates for completed surveys.
- 📱 Provide a responsive user experience.
- ♿ Respect reduced-motion preferences for the hero animation.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Angular 21](https://angular.dev/) | Application framework |
| [TypeScript 5.9](https://www.typescriptlang.org/) | Application logic |
| SCSS | Styling |
| Angular Reactive Forms | Form handling and validation |
| Angular Router | Client-side navigation |
| [Supabase](https://supabase.com/) | Database and real-time synchronization |
| npm 11 | Package management |

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) — use an active LTS release
- npm 11 or later
- A [Supabase](https://supabase.com/) project

Verify your installation:

```bash
node --version
npm --version
```

### 1. Clone the repository

```bash
git clone https://github.com/krummi14/Project-PollApp
cd poll-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Supabase

The Supabase client is initialized in:

`src/app/components/shared/services/survices.ts`

The application requires:

- A Supabase project URL
- A publishable/anon project key
- A `Survey_Form` table with compatible columns
- Appropriate Row Level Security (RLS) policies
- Realtime replication enabled for `Survey_Form`

> [!IMPORTANT]
> Never expose a Supabase `service_role` key in browser code. Use a publishable/anon key and configure RLS policies to control database access.

For production deployments, keep environment-specific configuration out of committed source files.

### 4. Start the application

```bash
npm start
```

Open the application at:

**http://localhost:4200/**

The development server rebuilds the application when source files change.

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start the development server |
| `npm run build` | Create a production build |
| `npm run watch` | Build and watch for changes |
| `npm test` | Run the configured test command |
| `npm run ng -- <command>` | Execute an Angular CLI command |

<details>
  <summary><strong>💡 More command examples</strong></summary>

  ```bash
  # Production build
  npm run build

  # Development build with watch mode
  npm run watch

  # Angular CLI help
  npm run ng -- help
  ```

</details>

## 🔄 Application Workflow

### 📝 Creating and publishing a survey

1. Select **New survey** on the home page.
2. Enter a survey name and choose a category.
3. Optionally specify an end date and description.
4. Add questions and their answer options.
5. Enable multiple answers where appropriate.
6. Select **Publish**.

After Supabase confirms the insert, the form resets and a publication confirmation appears.

### 🗳️ Completing a survey

1. Open an active survey from the overview.
2. Select your answers.
3. Click **Complete survey**.

After successful submission:

- Selected answers remain visible.
- Answer checkboxes are disabled.
- The action button changes to **Back to home**.
- Selecting it returns you to `/`.

### 📅 Survey lifecycle

| State | Behavior |
|---|---|
| Active | Available through the selected end date |
| Ending soon | Highlighted in the overview |
| Past | Listed separately from active surveys |
| Expired | Displays `Ended on <date>` |

## 🏗️ Architecture

The application follows a feature-oriented Angular structure with shared components, models, utilities, and services.

```text
src/
├── main.ts
├── styles.scss
└── app/
    ├── app.config.ts
    ├── app.routes.ts
    └── components/
        ├── home/
        │   ├── hero/
        │   └── surveys/
        ├── create-new-survey/
        ├── vote/
        └── shared/
            ├── button/
            ├── interfaces/
            ├── models/
            ├── pipes/
            ├── services/
            └── utils/
```

### 🧭 Routes

| Route | Purpose |
|---|---|
| `/` | Discover surveys and create new ones |
| `/vote/:id` | Vote on and review an individual survey |
| `**` | Redirect unknown routes to `/` |

### ⚡ State and data flow

The root-provided `Survices` service manages the in-memory survey collection using an Angular signal.

1. Components retrieve survey data through `getSurveys()`.
2. Survey creation and voting persist changes to Supabase.
3. The service updates local state after successful writes.
4. Supabase Realtime synchronizes changes between connected clients.
5. Angular `computed` signals and Reactive Forms drive the rendered interface.

## 🗄️ Data Model

Survey records follow a structure conceptually similar to:

```ts
interface Survey {
  id?: number;
  name: string;
  date: Date;
  category: string;
  describing: string;
  questions: Array<{
    question: string;
    multipleChoice: boolean;
    answers: string[];
  }>;
  vote?: Vote;
}
```

Votes are stored as aggregated answer selections associated with each survey.

See the implementation for the current representation:

- `src/app/components/shared/interfaces/vote.ts`
- `src/app/components/shared/utils/vote.ts`

## 🔐 Supabase Setup & Security

Before deploying, verify that:

- The `Survey_Form` table contains compatible columns.
- The `vote` column supports the application's vote structure, commonly through `jsonb`.
- Realtime replication is enabled.
- Row Level Security is enabled.
- Policies explicitly permit the required reads and writes.

The client currently reads survey data and writes survey and vote changes directly. For sensitive or high-concurrency use cases, consider server-side authorization and transactional vote updates.

## 💻 Development

### Code guidelines

- Use standalone Angular components.
- Keep component logic in `.ts`, templates in `.html`, and scoped styles in `.scss`.
- Prefer Angular signals for shared reactive state and computed views.
- Use Reactive Forms for survey and voting forms.
- Place reusable domain logic in `shared/utils`.
- Document meaningful public TypeScript APIs with TSDoc.
- Add comments when they clarify non-obvious behavior or design decisions.

### Adding a feature

1. Identify the appropriate feature folder under `src/app/components/`.
2. Reuse existing shared components, models, utilities, and services.
3. Keep Supabase access inside `Survices`.
4. Update relevant documentation.
5. Run the production build before opening a pull request.

## ✅ Validation

Run the production build:

```bash
npm run build
```

The generated files are written to:

```text
dist/poll-app/
```

Angular's production configuration includes bundle-size budgets. Review any budget warnings before deployment.

## ♿ Accessibility & UX

- Form controls use labels and validation messages.
- Publication feedback is announced through a live region.
- Hero animations respect reduced-motion preferences.
- Submitted answers remain visible while completed inputs are disabled.

## 🧰 Troubleshooting

<details>
  <summary><strong>🔌 The app cannot connect to Supabase</strong></summary>

  - Verify the project URL and publishable key.
  - Inspect the browser's network tab for Supabase errors.
  - Check the RLS policies.
  - Confirm the `Survey_Form` table name and column layout.

</details>

<details>
  <summary><strong>⚡ Realtime updates do not appear</strong></summary>

  - Ensure Realtime is enabled for `Survey_Form`.
  - Verify that the browser can establish a WebSocket connection.
  - Inspect the browser console and network logs for policy or connection errors.

</details>

<details>
  <summary><strong>🍪 A __cf_bm cookie warning appears</strong></summary>

  Supabase may emit a Cloudflare bot-management cookie warning during a Realtime WebSocket handshake. This warning alone does not prove that the connection failed. Verify that records and voting results actually update.

</details>

<details>
  <summary><strong>📦 The production build reports a budget warning</strong></summary>

  Inspect the generated bundle size and consider removing or lazy-loading non-critical dependencies. Budget thresholds are configured in `angular.json`.

</details>

## 🤝 Contributing

Contributions and improvements are welcome!

1. Create a feature branch.
2. Make focused changes that follow the existing conventions.
3. Run `npm run build`.
4. Update documentation where necessary.
5. Open a pull request describing your changes and validation.

## 📄 License

No license file is currently included. Add an explicit license before distributing the project or accepting external contributions under defined terms.

---

<div align="center">

**Built with ❤️ using Angular and Supabase**

<sub>Poll App · Create. Share. Vote.</sub>

</div>F