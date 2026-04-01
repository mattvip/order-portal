# Order Portal

A B2B order management portal built with Next.js 15, Prisma ORM, and PostgreSQL.

A **shared password** protects every page and API route. Set the `PORTAL_PASSWORD` environment variable to enable it.

## Run locally

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

You need two environment variables. Create a `.env.local` file (never commit it):

```
DATABASE_URL="postgresql://user:password@localhost:5432/order_portal"
PORTAL_PASSWORD="choose-a-strong-password"
```

### Logging in / out

- Navigate to `http://localhost:3000` — you'll be redirected to `/login`.
- Enter the value you put in `PORTAL_PASSWORD` and click **Sign in**.
- A secure, httpOnly cookie (`portal_auth`) keeps you authenticated for 7 days.
- Click **Log out** in the top-right of the nav bar to clear the cookie and return to `/login`.

## Deploy to Vercel with a Neon database (get a public URL)

Follow these steps once and you'll have a link you can share with your manufacturer.

### Step 1 — Create a free database on Neon

1. Go to [neon.tech](https://neon.tech) and sign up for free.
2. Click **New Project**, give it any name, and click **Create**.
3. On the next screen, copy the **Connection string** — it starts with `postgresql://…`. Keep it safe; treat it like a password.

### Step 2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **Add New → Project**.
3. Pick the **mattvip/order-portal** repository and click **Import**.
4. On the "Configure Project" screen:
   - Change the **Build Command** to `npm run vercel-build` (this creates the database tables and then builds the site).
   - Leave everything else as the default.
5. Before clicking Deploy, scroll down to **Environment Variables** and add:
   - **Name:** `DATABASE_URL` / **Value:** *(paste the Neon connection string from Step 1)*
   - **Name:** `PORTAL_PASSWORD` / **Value:** *(choose a strong password — anyone who knows this can access the portal)*
6. Click **Deploy** and wait 2–3 minutes.

Vercel will give you a URL like `https://order-portal-xyz.vercel.app`. That's your public link — share it with your manufacturer (along with the password).

### Logging in / out (production)

- Visit your Vercel URL — you'll be redirected to `/login`.
- Enter your `PORTAL_PASSWORD` and click **Sign in**.
- Click **Log out** in the top-right nav bar to end the session.

### If you redeploy later

Every time you push a code change, Vercel automatically rebuilds. The `vercel-build` script runs database migrations before building, so new database changes are applied safely.

---

## Usage

### Buyer (you)
- Home page → **Place an Order** to create a new order (starts as Draft)
- **My Orders** (`/orders`) → see all orders
- Click **View** on any order → click **Submit Order** to send it to the manufacturer

### Manufacturer
- Go to `/manufacturer/orders`
- Review orders in the **Pending Review** queue
- Open an order to **Accept** or **Reject** it
- Accepted orders can be advanced: Accepted → In Production → Completed

## Status flow

```
Draft → Submitted → Accepted → In Production → Completed
                 ↘ Rejected
```

## Notes

- Orders are stored in your Neon PostgreSQL database and persist permanently.
