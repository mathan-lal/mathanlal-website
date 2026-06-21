# Mathan Lal — Service Website

A static, multi-page website for Mathan Lal's software engineering & digital growth services: website design & development, mobile apps (Android/iOS), digital marketing (Meta & Google Ads), SEO, and graphic design.

## Structure

```
mathanlal/
├── index.html          Home — hero, services overview, lead/offer form
├── services.html       Detailed breakdown of all 5 services
├── portfolio.html       Filterable project showcase (placeholder content)
├── testimonials.html   Client testimonials (placeholder content)
├── contact.html         Full contact form
├── thank-you.html      Shown after any form submission
├── 404.html             Not-found page
├── css/style.css        All styling
├── js/main.js            Nav toggle, scroll reveal, portfolio filter, form validation
└── netlify.toml          Netlify build config
```

## Forms — how submissions work

Both forms (home page "quick-inquiry" and the full "contact" form on contact.html) use **Netlify Forms** — no backend or server code needed:

- Each `<form>` has `data-netlify="true"` and a unique `name` attribute.
- A hidden honeypot field (`bot-field`) blocks basic spam bots.
- `action="/thank-you.html"` redirects the visitor to the Thank You page after a successful submit.
- Submissions show up automatically in your Netlify dashboard under **Site → Forms**, and you can turn on email notifications there (Site settings → Forms → Notifications).

This only works once the site is deployed on Netlify — form detection happens at deploy time by scanning your HTML files, so don't remove the `data-netlify="true"` or `name="form-name"` hidden inputs.

## Step 1 — Push to GitHub

```bash
cd mathanlal
git init
git add .
git commit -m "Initial website build"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

(Create the empty repo on GitHub first if you haven't — no README/license needed there, you already have one.)

## Step 2 — Deploy to Netlify

1. Go to [app.netlify.com](https://app.netlify.com) and log in.
2. Click **Add new site → Import an existing project**.
3. Choose **GitHub** and select your repository.
4. Build settings:
   - Build command: leave as is (or blank — it's a static site)
   - Publish directory: `.` (the repo root)
5. Click **Deploy site**.
6. Once live, go to **Site configuration → Forms** to confirm both forms (`quick-inquiry` and `contact`) were detected, and turn on email notifications so you're alerted on new leads.
7. Optional: add a custom domain under **Site configuration → Domain management**.

That's it — every future `git push` to `main` will auto-redeploy the site.

## Customizing later

- **Real content**: swap placeholder portfolio projects, testimonials, email, and phone number for real ones (search for `mathanlal.dev` and `+1 (000) 000-0000` across the HTML files).
- **Colors/fonts**: all design tokens are at the top of `css/style.css` under `:root`.
- **Images**: thumbnails are currently CSS gradients — drop real screenshots into an `assets/` folder and swap the `.pf-thumb` divs for `<img>` tags when ready.
