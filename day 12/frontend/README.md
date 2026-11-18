# Daily Spend Tracker

Create a modern Personal Expense Tracker web application.

🎯 Goal:

Help users track daily expenses, manage budget, and see spending reports easily.

---

1. Authentication:

- Simple login & signup system

- User-specific data storage

---

2. Dashboard:

- Show Total Income, Total Expense, and Balance

- Clean modern UI (dark mode + gradient design)

- Quick add expense button

---

3. Expense Management:

- Add expense with:

  - Title (e.g., Food, Transport)

  - Amount

  - Category (Food, Travel, Shopping, etc.)

  - Date

- Edit and delete expense

---

4. Income Management:

- Add monthly or daily income

- Update balance automatically

---

5. Reports Section:

- Monthly expense summary

- Category-wise breakdown (chart view)

- Spending history table

---

6. UI/UX Design:

- Modern SaaS style design (like Notion / Stripe)

- Responsive (mobile + desktop)

- Sidebar navigation:

  - Dashboard

  - Add Expense

  - Reports

  - Settings

---

7. Extra Features:

- Search expenses

- Filter by category and date

- Export report (PDF or CSV)

- Dark/Light mode toggle

---

8. Tech Stack:

- Frontend: React / Next.js

- Backend: Node.js / Express

- Database: MongoDB

---

9. Output:

- Fully working web app

- Clean and professional UI

- Ready to deploy project

Make the UI highly modern and minimal like a fintech app.

Use smooth animations, soft shadows, and clean typography.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://expense-haven-30.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/11fcded1-4136-4443-bfe4-1b0a2c290e31).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## GitHub Pages deployment

The repository's GitHub Actions workflow builds and deploys this frontend from `day 12/frontend` when frontend files are pushed to `main`. Enable **GitHub Actions** as the Pages build and deployment source in the repository's Pages settings.

GitHub Pages hosts only the static frontend. To enable sign-in and transaction features, deploy the Express backend and PostgreSQL database separately, then set the repository Actions variable `DAY12_API_URL` to the backend API base URL (including `/api`). Configure the backend CORS origin to allow the GitHub Pages site. Without that variable and a reachable backend, the frontend can load but API-backed features will not work.
