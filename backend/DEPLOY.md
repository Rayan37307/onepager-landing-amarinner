# Deploying the backend to Namecheap Stellar (cPanel)

Runs the Laravel API + Filament admin at **`https://api.YOURDOMAIN.com`**, with
the landing page on `YOURDOMAIN.com`.

Replace `YOURDOMAIN.com` and `CPANELUSER` with your real values everywhere.

> A ready-to-upload archive with `vendor/` already bundled is at
> **`onepager-backend-deploy.tar.gz`** in the project root — so you never run
> `composer install` on the server.

There are two paths below. **If you have SSH, use Path A** (§A) — it's shorter.
If you don't, the cPanel-only path (§1–§8, driven by a one-time Cron Job) does
the same thing.

---

## A. SSH path (recommended if you have shell access)

First do **§1 steps 1–5** in cPanel (PHP version + extensions, subdomain with
its document root set to `…/api.YOURDOMAIN.com/public`, MySQL database + user,
AutoSSL). Then:

```sh
# Connect (Namecheap uses a non-standard SSH port)
ssh -p 21098 CPANELUSER@SERVER_IP

# Upload the archive first — from your own machine, in another terminal:
#   scp -P 21098 onepager-backend-deploy.tar.gz CPANELUSER@SERVER_IP:~/api.YOURDOMAIN.com/
# (or drop it in via cPanel File Manager)

cd ~/api.YOURDOMAIN.com
tar -xzf onepager-backend-deploy.tar.gz && rm onepager-backend-deploy.tar.gz

# Check the PHP version — must be 8.3+. If `php -v` is older, replace `php`
# with `ea-php83` (or the full path /opt/cpanel/ea-php83/root/usr/bin/php)
# in every command below.
php -v

cp .env.production.example .env
nano .env          # fill DB_*, CORS_ALLOWED_ORIGINS, APP_URL, META_*  (leave ADMIN_* blank — you'll use make:filament-user)
php artisan key:generate

php artisan migrate --force
php artisan storage:link
php artisan filament:assets
php artisan config:cache && php artisan route:cache && php artisan view:cache

php artisan make:filament-user      # interactive: name / email / password  → /admin login

find storage bootstrap/cache -type d -exec chmod 775 {} \;
```

Then add the **recurring scheduler** cron (§6), run the **smoke test** (§7), and
**point the frontend at the API** (§8). Skip §1–§5 setup-cron stuff.

For updates later:
```sh
cd ~/api.YOURDOMAIN.com && git pull   # or re-extract a new archive
composer install --no-dev --optimize-autoloader   # only if vendor/ changed
php artisan migrate --force && php artisan filament:assets
php artisan config:cache && php artisan route:cache && php artisan view:cache
```

---

# cPanel-only path (no SSH)

Everything from here down is done in the cPanel web UI. Artisan commands run
through a one-time **Cron Job** (§4).

---

## 1. cPanel setup (UI)

1. **PHP version** — *MultiPHP Manager* → set `api.YOURDOMAIN.com` to **PHP 8.3**
   (this app needs `php >= 8.3`). Not listed? Open a Namecheap support ticket to
   enable it first.
2. **Extensions** — *Select PHP Version → Extensions*: tick `bcmath`, `ctype`,
   `curl`, `dom`, `fileinfo`, `intl`, `mbstring`, `openssl`, `pdo_mysql`,
   `tokenizer`, `xml`, `zip`.
3. **Subdomain** — *Domains → Create A New Domain* → `api.YOURDOMAIN.com`.
   Set **Document Root** to:
   ```
   /home/CPANELUSER/api.YOURDOMAIN.com/public
   ```
   (cPanel creates `~/api.YOURDOMAIN.com`; the web root is its `public/`
   subfolder so `.env` and `vendor/` sit safely above it.)
4. **Database** — *MySQL Databases*: create a database, create a user (use the
   password generator), then **Add User To Database → All Privileges**.
   Write down the final names — cPanel prefixes them, e.g.
   `CPANELUSER_amarinner` and `CPANELUSER_api`.
5. **SSL** — *SSL/TLS Status* → tick `api.YOURDOMAIN.com` (+ apex + `www`) →
   **Run AutoSSL**. Wait for the green padlock before testing.

---

## 2. Upload the code

1. *File Manager* → go into `api.YOURDOMAIN.com` (the folder, **not** `public`).
2. **Upload** `onepager-backend-deploy.tar.gz`.
3. Select it → **Extract** → into the current folder.
4. Confirm these now exist:
   ```
   /home/CPANELUSER/api.YOURDOMAIN.com/artisan
   /home/CPANELUSER/api.YOURDOMAIN.com/vendor/
   /home/CPANELUSER/api.YOURDOMAIN.com/public/index.php
   ```
5. Delete the `.tar.gz`.

---

## 3. Create `.env`

1. In File Manager, open `api.YOURDOMAIN.com`, find **`.env.production.example`**.
2. **Rename** it to `.env` (File Manager may need *Settings → Show Hidden Files*
   to see dotfiles).
3. **Edit** `.env` (right-click → Edit) and set:

   | Key | Value |
   |---|---|
   | `APP_KEY` | `base64:vDIkj9QgtHBSlHPaxI9CSi04ddLZ8i3M2TfeGso0LZE=` (or your own 32-byte base64 — it just has to stay constant and secret) |
   | `APP_URL` | `https://api.YOURDOMAIN.com` |
   | `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` | the prefixed MySQL values from step 1.4 |
   | `CORS_ALLOWED_ORIGINS` | `https://YOURDOMAIN.com,https://www.YOURDOMAIN.com` (no trailing slash) |
   | `META_PIXEL_ID` / `META_CAPI_ACCESS_TOKEN` | from Meta Events Manager |
   | `MAIL_*` | a cPanel mailbox, or leave as-is and change `MAIL_MAILER=log` |
   | `ADMIN_EMAIL` / `ADMIN_PASSWORD` | your first `/admin` login |

4. Save.

---

## 4. Run the one-time setup

**Why this step exists:** the app still needs a few commands run once — build the
database tables, create your admin login, publish the admin-panel CSS/JS. With
no SSH, the trick is to let a **Cron Job** run them for you. A cron job normally
runs something on a repeating schedule; here you paste the setup commands in,
let it fire once a minute later, confirm it worked, then delete it.

### 4a. Find your two paths

You'll paste them into the command below.

- **PHP path** — pattern `/opt/cpanel/ea-phpXX/root/usr/bin/php`, where `XX` is
  the PHP version from step 1.1 with no dot. PHP 8.3 → `ea-php83`.
  → `/opt/cpanel/ea-php83/root/usr/bin/php`
- **App path** — open File Manager, go into the `api.YOURDOMAIN.com` folder, and
  copy the full path shown in the address bar. Usually:
  → `/home/CPANELUSER/api.YOURDOMAIN.com`

### 4b. Add the cron job

cPanel → *Advanced → Cron Jobs*.

1. Under **Cron Email**, put your email address and click *Update Email*. (This
   is how you'll see whether it worked.)
2. Under **Add New Cron Job**:
   - **Common Settings:** choose *Once Per Minute (`* * * * *`)*.
   - **Command:** paste the block below, then replace `PHP` and `APP` on the
     first line with the two paths from 4a.

```
PHP=/opt/cpanel/ea-php83/root/usr/bin/php; APP=/home/CPANELUSER/api.YOURDOMAIN.com; $PHP $APP/artisan migrate --force && $PHP $APP/artisan db:seed --class=AdminUserSeeder --force && $PHP $APP/artisan storage:link && $PHP $APP/artisan filament:assets && $PHP $APP/artisan config:cache && $PHP $APP/artisan route:cache && $PHP $APP/artisan view:cache
```

3. Click **Add New Cron Job**.

### 4c. Wait ~2 minutes, then check it worked

Any one of these confirms success:

- **Email:** you get a cron email whose text ends with
  `Admin login ready for you@YOURDOMAIN.com.` and shows no red errors.
- **phpMyAdmin** (cPanel → *phpMyAdmin*): open your database — it now has
  ~15 tables (`users`, `orders`, `customers`, `campaigns`, `migrations`, …).
  Empty = it hasn't run yet or the DB credentials in `.env` are wrong.
- Browser → `https://api.YOURDOMAIN.com/admin` shows a **styled** login page.

If the email shows an error, read it (or open `storage/logs/laravel.log` in File
Manager) — it's almost always a wrong `DB_*` value or a wrong path in 4a. Fix
`.env` / the command and wait another minute; the job re-runs every minute.

### 4d. Delete the cron job

Once it worked, go back to *Cron Jobs* and **Delete** this job. (Step 6 adds a
different, permanent one.)

> Any time you edit `.env` later, add this same job back for a minute to rebuild
> the caches, then delete it again.

---

## 5. Permissions (only if you get a 500)

File Manager → select `storage` and `bootstrap/cache` → **Permissions** →
`755` for folders, and tick "Recurse into subdirectories". If a 500 persists,
set `storage` recursively to `775`.

---

## 6. Recurring scheduler (required)

*Cron Jobs* → **Add New Cron Job** → *Once Per Minute* → Command (use the same
two paths from step 4a):

```
/opt/cpanel/ea-php83/root/usr/bin/php /home/CPANELUSER/api.YOURDOMAIN.com/artisan schedule:run >> /dev/null 2>&1
```

This drives `checkouts:sweep` (marks quiet checkout drafts as abandoned every
15 min). Leave it running forever. It's normal for this one to produce no
output.

---

## 7. Test

- Browser → `https://api.YOURDOMAIN.com/up` → blank page / HTTP 200.
- Browser → `https://api.YOURDOMAIN.com/admin` → login page. Sign in with
  `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
- Place a real order from the finished landing page and confirm it appears
  under *Orders*.

**After the first admin login:** edit `.env`, delete the `ADMIN_PASSWORD` line,
save, and re-run the step-4 cron once to refresh the config cache.

Troubleshooting:
- **CORS / "failed to fetch" from the site** — `CORS_ALLOWED_ORIGINS` must match
  the site origin exactly (scheme + host, no path, no trailing slash). Re-run
  the step-4 cron after editing.
- **Admin panel has no styling** — the `filament:assets` step didn't run;
  re-run the step-4 cron and hard-refresh.
- **Any 500** — read `storage/logs/laravel.log` in File Manager.

---

## 8. Point the landing page at the API

Build the frontend with:
```
VITE_API_URL=https://api.YOURDOMAIN.com/api
VITE_META_PIXEL_ID=<same pixel id>
VITE_META_CURRENCY=BDT
```
then upload `frontend/dist/` to the `YOURDOMAIN.com` document root.

---

## Updating the backend later

1. Build a fresh `onepager-backend-deploy.tar.gz` (or upload changed files).
2. File Manager → upload → **Extract**, overwriting.
3. Cron Jobs → run the **step-4** command once (migrate + rebuild caches).

Keep `.env`, and don't overwrite `storage/` (it holds `storage/logs` and the
`public/storage` symlink target).

---

## If you *do* get SSH later

The equivalent one-liner from `~/api.YOURDOMAIN.com`:
```sh
php artisan migrate --force && php artisan db:seed --class=AdminUserSeeder --force \
  && php artisan storage:link && php artisan filament:assets \
  && php artisan config:cache && php artisan route:cache && php artisan view:cache
```
