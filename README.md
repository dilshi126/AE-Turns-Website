# AE Turns Website

The AE Turns (Pvt) Ltd website is built with React, TypeScript, React Router,
Vite, Express and SQLite. It includes a public website and a separate admin
content studio. The public pages are Home, About Us, Solutions, Careers,
Contact Us, Privacy Policy and Terms & Conditions.

The admin studio manages the company and home-page content, solutions, company
story and partners, statistics and customers, vacancies, and social links.
Published changes are stored in SQLite and the public site checks for updates
automatically. Company statistics remain marked for confirmation; customer
names and logos are not shown until approved. News, testimonials and team
sections are omitted until content is provided. Careers currently displays
“No Current Vacancies.”

Contact enquiries are prepared in the visitor’s default email application.
The website does not send or store form submissions. CV uploads are not
available while there are no active vacancies. When a vacancy is published,
applicants will need to attach their CV to the prepared email themselves.

## Run locally

```sh
npm install
npm run dev:all
```

This starts the Vite website at <http://localhost:5173> and the API at port
4000. Open the public site at <http://localhost:5173/> and the admin studio at
<http://localhost:5173/admin.html>.

### First administrator setup

On the first start, the API creates a one-time setup key at
`data/admin-setup-key.txt`. Open the admin studio, choose **Set up the first
administrator**, and enter that key with a username and password of at least
12 characters. The key is deleted after successful setup. Keep the key and
admin credentials private. The SQLite database is stored at
`data/ae-turns.sqlite`; both files are excluded from Git. Set `DATABASE_PATH`
to use a different database location. For unattended initial provisioning,
set `ADMIN_USERNAME` and `ADMIN_PASSWORD` before starting the server.

## Production

Build the public site and admin studio, then start the combined Express server:

```sh
npm run build
npm start
```

The production server serves the public site at `/` and the admin studio at
`/admin`. Set `NODE_ENV=production` when deploying behind HTTPS so admin
session cookies use the secure production settings. Configure the server’s
port with `PORT` if needed.
