# Deploying the landing page to amarinner.com (cPanel)

The frontend is a static build — no Node on the server. You build it locally (or
use the archive that's already been built for you) and drop the files into the
primary domain's web root, `~/public_html`.

The API URL is **baked in at build time** from `.env.production`
(`VITE_API_URL=https://api.amarinner.com/api`). If the API domain ever changes,
edit `.env.production` and rebuild.

---

## 1. Build (skip if you were handed `onepager-frontend-deploy.tar.gz`)

```sh
cd frontend
npm ci
npm run build          # outputs frontend/dist/  (reads .env.production)
```

Then bundle it (the archive must include the hidden `.htaccess`):
```sh
tar -czf onepager-frontend-deploy.tar.gz -C dist .
```

---

## 2. Prep the web root

cPanel → *File Manager* → open **`public_html`**.

- Delete anything already in there — the parking-page `index.html`,
  `default.html`, `cgi-bin` you don't use, etc. A stray `index.html`/`index.php`
  will be served instead of the app.
- Make sure *Settings → Show Hidden Files (dotfiles)* is on.

Confirm SSL: *SSL/TLS Status* → `amarinner.com` **and** `www.amarinner.com`
show a valid certificate (run AutoSSL if not).

---

## 3. Upload + extract

**Via File Manager:** upload `onepager-frontend-deploy.tar.gz` into
`public_html`, select it → **Extract** → into `public_html`, then delete the
archive.

**Or via SSH** (from your machine):
```sh
scp -P 21098 -i ~/.ssh/namecheap_amartvbs \
  onepager-frontend-deploy.tar.gz amartvbs@68.65.123.172:~/public_html/
ssh -p 21098 -i ~/.ssh/namecheap_amartvbs amartvbs@68.65.123.172
cd ~/public_html && tar -xzf onepager-frontend-deploy.tar.gz && rm onepager-frontend-deploy.tar.gz
```

After extracting, `public_html` should contain `index.html`, `.htaccess`,
`assets/`, and the image files.

---

## 4. Test

- `https://amarinner.com` → the landing page loads, images show.
- Fill the order form and submit → success message, and the order appears in
  `https://api.amarinner.com/admin` → *Orders*.
- Browser devtools → Network: the POST goes to
  `https://api.amarinner.com/api/orders` and returns **201** (not a CORS error).

If you get a **CORS / "Failed to fetch"** error on submit, the backend isn't
allowing this origin. On the server, `backend/.env` must have:
```
CORS_ALLOWED_ORIGINS="https://amarinner.com,https://www.amarinner.com"
```
then rebuild its cache: `php artisan config:cache`.

---

## 5. Redeploying after a change

```sh
cd frontend
npm run build
tar -czf onepager-frontend-deploy.tar.gz -C dist .
# upload + extract into public_html, overwriting
```

Asset filenames are content-hashed, so returning visitors pick up the new build
automatically; `.htaccess` tells browsers never to hard-cache `index.html`.
