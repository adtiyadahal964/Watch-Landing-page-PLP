# HIMA Watches

A production-ready single-product website for the Emerald Classic, built with Next.js App Router and Tailwind CSS. It includes a responsive luxury-style landing page, interactive image gallery, light and dark themes, delivery-fee calculation, checkout validation, Google Sheets order storage, two HTML email notifications, and a verified thank-you page.

## What is working

- The Emerald Classic is the only active storefront product, with its confirmed NPR 3,999 price, quantity selection, checkout totals, theme switcher, validation, and thank-you page implemented.
- The `/api/order` route validates the catalog price on the server, writes the order to Google Sheets, emails the business, emails the customer, and returns success only after all three actions complete.
- Cash On Delivery is the only payment method. No online payment details are collected.
- The original product images are preserved in `public/images/originals`. Optimized WebP images and faithful crops of the supplied Emerald Classic photo are used by the website.
- The previous catalogue entries remain in `archivedProducts` inside `data/products.ts`, and their image assets remain available for a future catalogue without appearing in the current website.

## Order configuration

Real order submission requires a Google service account, a Google Sheet, and SMTP credentials. Run `node scripts/run-configured-store.mjs` to enter those values through hidden prompts, format the `Orders` sheet, verify Gmail SMTP, save the server-only `.env.local`, and start the production server. If configuration is missing, checkout returns a clear error and does not show a false confirmation.

## Local setup

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add the credentials described below.
5. Run `npm run dev` and open `http://localhost:3000`.

Run `npm run typecheck` and `npm run build` before deployment.

## Google Sheets setup

1. Create a Google Spreadsheet. Rename the order tab to `Orders`.
2. The setup script creates these headers in row 1:

   `Order ID`, `Order date`, `Customer name`, `Phone`, `Email`, `Delivery address`, `Product`, `Product slug`, `Quantity`, `Unit price`, `Subtotal`, `Delivery fee`, `Order total`, `Payment method`, `Order status`, `Request ID`, `Email status`

3. The setup script applies the branded header, ivory alternating rows, frozen header, filters, suitable column widths, NPR number formatting, status dropdowns, and status colours automatically.
4. The available order statuses are `Order received`, `Phone confirmed`, `Preparing`, `Dispatched`, `Delivered`, and `Cancelled`.
5. The Sheet ID is the text between `/d/` and `/edit` in the spreadsheet URL. Add it as `GOOGLE_SHEET_ID`.
6. In Google Cloud Console, create or select a project, enable the Google Sheets API, and create a service account.
7. Create a JSON key for that service account. Add its `client_email` as `GOOGLE_SERVICE_ACCOUNT_EMAIL` and its `private_key` as `GOOGLE_PRIVATE_KEY`. Keep the `\n` characters in the environment value.
8. Share the spreadsheet with the service-account email and grant **Editor** access.
9. Set `GOOGLE_SHEET_TAB_NAME=Orders`.

The API appends to columns A–Q. The request ID prevents duplicate rows when a checkout is retried, while the email-status column records whether both messages were sent.

## Gmail / SMTP setup

The project uses Nodemailer with SMTP. For Gmail:

1. Turn on 2-Step Verification for the Gmail account.
2. Create a Google App Password. Do not use the normal Gmail password.
3. Configure:

```env
BUSINESS_EMAIL=adtiyadahal964@gmail.com
EMAIL_FROM="HIMA Watches <adtiyadahal964@gmail.com>"
BRAND_NAME=HIMA Watches
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=adtiyadahal964@gmail.com
SMTP_PASS=your-16-character-app-password
```

The business notification uses the customer email as Reply-To. The customer confirmation uses `BUSINESS_EMAIL` as Reply-To. Credentials are read only inside the server route.

## Environment variables

Copy every variable from `.env.example` into `.env.local` or the Vercel project settings:

- `NEXT_PUBLIC_SITE_URL`: the deployed HTTPS URL.
- `BUSINESS_EMAIL`: receives new-order messages and customer replies.
- `EMAIL_FROM`: verified sender address, optionally formatted as `HIMA Watches <address>`.
- `BRAND_NAME`: website/email brand name.
- `GOOGLE_SHEET_ID`, `GOOGLE_SHEET_TAB_NAME`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`: Google Sheets integration.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: email transport.
- `EMAIL_SERVICE_API_KEY`: reserved for a later Resend, Brevo, or SendGrid integration; unused by the SMTP implementation.
- `FRONTEND_URL`: allowed production origin for order requests. Usually the same as `NEXT_PUBLIC_SITE_URL`.

## Test the complete order flow

1. Add all Google and SMTP environment values.
2. Submit an order with a test customer email you can access.
3. Confirm a new row appears in the `Orders` sheet with status `Order received` and email status `Business and customer emails sent`.
4. Confirm the business inbox receives “New Product Order Received”.
5. Confirm the customer inbox receives “Your Order Has Been Received”. Check Spam if needed.
6. Confirm the browser redirects to `/thank-you` and shows the same product, quantity, and total.
7. Temporarily use an invalid SMTP password and verify checkout shows an error instead of redirecting. Restore it after the test. The saved request ID makes a retry update the same row and retry notifications without duplicating the order.

## Deploy to Vercel

1. Push this project to a Git repository and import it into Vercel.
2. Keep the detected framework as **Next.js** and the build command as `next build`.
3. Add the environment variables in **Project Settings → Environment Variables** for Production and Preview as appropriate.
4. For `GOOGLE_PRIVATE_KEY`, paste the complete key, including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`. The route supports escaped `\n` line breaks.
5. Deploy, then set `NEXT_PUBLIC_SITE_URL` and `FRONTEND_URL` to the final HTTPS domain and redeploy.
6. Submit a real test order and verify the sheet row and both emails before advertising the store.

## Product and policy updates

The active product and the retained catalogue archive are centralized in `data/products.ts`. Keep unverified technical details, authenticity claims, discounts, warranty coverage, return terms and testimonials off the live site until they are confirmed. FAQ and product-story copy are in `app/page.tsx`.
