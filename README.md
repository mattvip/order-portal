# Order Portal

A B2B order management portal MVP built with Next.js 15 (App Router), Prisma ORM, and SQLite.

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Usage

### Buyer Role
- Visit the home page and click **Place an Order** to create a new order (saved as Draft)
- Go to **My Orders** (`/orders`) to see all your orders
- Click **View** on any order to see details; click **Submit Order** to send it to the manufacturer

### Manufacturer Role
- Navigate to `/manufacturer/orders` (or click **Manufacturer View** in the nav)
- Review orders in the **Pending Review** queue
- Open an order to **Accept** or **Reject** it
- Accepted orders can be advanced: Accepted → In Production → Completed

## Status Flow

```
Draft → Submitted → Accepted → In Production → Completed
                 ↘ Rejected
```

## Notes

- SQLite database is stored at `prisma/dev.db` and persists across restarts
- No authentication is implemented — this is an MVP
- The manufacturer banner serves as a reminder that the portal is open