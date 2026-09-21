# Sales Performance Ledger

A sales dashboard for revenue trends, target vs. actual, tiered incentive calculation and category insights.
Load your invoice export (Excel or CSV), optionally a target list, and everything is calculated in the browser.

**Your data never leaves your computer.** Files are read and processed locally by the page; there is no
database and nothing is uploaded to a server. That is why it can be hosted as a plain website for free.

Once deployed, the dashboard lives at `https://<your-github-username>.github.io/<repository-name>/`.

---

## 1. Put it on GitHub and get a shareable link (no installs needed)

1. **Create a repository** on github.com (top-right **+** → **New repository**). Any name works.
   Choose **Public** (GitHub Pages is free for public repositories; private repositories need a paid GitHub plan).
2. **Upload the files.** Unzip the package, open the repository page and click **Add file → Upload files**.
   Drag in **everything inside the unzipped folder** (the contents, not the folder itself), then **Commit changes** to `main`.
   > The folders `.github` and `.devcontainer` start with a dot, so Finder/Explorer may hide them.
   > macOS: press `Cmd + Shift + .` to show hidden files. Windows: File Explorer → View → Show → Hidden items.
   > **`.github/workflows` must be uploaded** — it is what publishes the site.
3. **Turn on Pages.** Repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. **Publish.** Open the **Actions** tab. The *Deploy to GitHub Pages* run starts by itself after step 2. If it
   failed because Pages was not enabled yet, open it and click **Re-run all jobs**.
   After about a minute the run shows the live URL (also under Settings → Pages). Share that link.

Prefer the command line?

```bash
cd sales-ledger
git init -b main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

> **Privacy rules for a public repo:** anyone with the link can open the *dashboard*, but nobody can see your data
> unless you commit it. The `.gitignore` blocks `*.csv`, `*.xlsx` and `*.xls` everywhere except `sample-data/`.
> Never commit real sales or incentive files, and never remove that guard.

---

## 2. Working together

| I want to… | Do this |
| --- | --- |
| Let teammates edit | **Settings → Collaborators → Add people** |
| Edit with zero setup | Open the repo and press `.` (web editor), **or** **Code → Codespaces → Create codespace** (a full cloud dev environment; it runs `npm ci` for you, then run `npm run dev`) |
| Change something safely | Create a branch → edit → open a **Pull request**. Checks (tests + build) run automatically. Merge into `main` and the site redeploys itself. |
| Stop broken changes reaching the live site | **Settings → Branches → Add rule** for `main`: *Require a pull request* and *Require status checks* (`test-and-build`) |

---

## 3. Run it on your own computer (optional)

Requires [Node.js](https://nodejs.org) 22 or newer.

```bash
npm install        # once
npm run dev        # live-reloading dev server  → http://localhost:5173
npm test           # run the automated tests
npm run build      # production build into dist/
```

---

## 4. Using the dashboard

Try it first with the fake data in `sample-data/` (`sample_sales_data.xlsx` or `.csv`, then `sample_targets.csv`).

**Actual sales file** (.xlsx / .xls / .csv) needs these columns. Header matching ignores case, spaces and punctuation:

| Column | Notes |
| --- | --- |
| `Invoice Date` | Real Excel dates, or text like `2026-01-31`. Prefer `yyyy-mm-dd`. |
| `CF.Currency` | `KES` or `USD`. USD rows are multiplied by the rate in `src/lib/config.js` (130). |
| `Item Total` | Numbers, or text like `1,250.50`. |
| `Item.CF.Sales Category` | Mapped to an incentive group in the sidebar (guessed automatically, override any row). |
| `Sales person` | |

Extra columns are ignored. Rows with an invalid date or amount are skipped and counted in a yellow banner.

**Targets file** (optional, load sales data first): `Sales Person`, `Target Value in USD`, `Target Value in KSH`,
`Sales Category`, `Target Frequency` (`Monthly` / `Quarterly` / `Yearly`), and optionally `Target Period`.
If both currencies are given, KSH wins. Use **Download template (CSV)** in the sidebar for a ready-made file.
Importing a targets file **replaces** previously imported targets. Targets can also be typed directly into the tables.

Nothing is saved between visits. Export the tables (CSV / Excel / PDF via the browser print dialog) to keep results.

---

## 5. Where to change things

| To change… | Edit |
| --- | --- |
| USD → KES rate | `src/lib/config.js` |
| Incentive groups, cadences, tier percentages and rule text | `src/lib/incentive.js` |
| Colours, fonts, spacing | `src/styles.css` |
| Page layout and text | `index.html` |
| Dashboard behaviour, tables, charts | `src/main.js` |
| Date / number / column parsing | `src/lib/parse.js`, `src/lib/transform.js` |

After changing incentive rules, run `npm test` — `tests/incentive.test.js` documents how the tiers are calculated.

```
.
├── index.html                 page markup
├── src/
│   ├── main.js                UI, state, charts, tables
│   ├── styles.css             design
│   └── lib/                   config, incentive rules, parsing, periods, export helpers
├── tests/                     automated tests (node --test)
├── sample-data/               fake data for trying the dashboard
├── public/favicon.svg
├── server.js                  optional Node.js server (see below)
├── render.yaml                optional Render.com blueprint
├── .github/workflows/         deploy.yml (GitHub Pages) + ci.yml (checks on pull requests)
└── .devcontainer/             cloud dev environment for GitHub Codespaces
```

---

## 6. Other hosting options (optional)

GitHub Pages is the recommended route. The build output (`dist/`) is a static site, so it also works on Netlify,
Vercel or Cloudflare Pages: build command `npm run build`, output folder `dist`.

If a host wants a running Node.js process (Render, Railway, Azure App Service, Heroku, a VPS), use the included server:

```bash
npm run build && npm start        # http://localhost:3000  (PORT env var supported, /healthz for health checks)
```

`render.yaml` is a ready blueprint for Render (**New → Blueprint**). These hosts were not tested here; the server
itself was.

---

## 7. Security note about the Excel library

The Excel reader is SheetJS (`xlsx`). The copy on the npm registry is version 0.18.5, and `npm audit` reports two
advisories for it (prototype pollution, ReDoS). They can only be triggered by opening a deliberately malicious
spreadsheet, and this app only opens files you choose on your own machine. To move to the patched official build
anyway (SheetJS publishes it on its own server, not on npm):

```bash
npm install https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz
npm test && npm run build
```

Then commit the updated `package.json` and `package-lock.json`.

---

## 8. Good to know

- Slash dates where both numbers are 12 or less (e.g. `03/04/2026`) are ambiguous. The app reads them as
  month/day/year and shows a warning. Use `yyyy-mm-dd` or real Excel dates to be certain.
- Fonts load from Google Fonts. Offline, the browser falls back to system fonts; nothing else is affected.
- The `sample-data/` files are entirely made up.
