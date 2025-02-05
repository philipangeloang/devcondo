# Steps to apply boilerplate

1. Create t3 app

```
npm create t3-app@latest
```

2. [Create github repository](https://github.com/new)
3. Commit and Push the created t3 app to the newly created repository
4. Install the following dependencies
   `npm install next-themes nodemailer @tabler-icons-react @neondatabase/serverless @paddle/paddle-js @paddle/paddle-node-sdk uploadthing @uploadthing/react`

5. Copy the boilerplate of env.js
6. Fix env for Next Auth Providers

```
Discord
https://discord.com/developers/applications
Create App > OAuth2 > ID and Secret
Add Redirect to http://localhost:3000/api/auth/callback/discord

Google
https://console.cloud.google.com
OAuth Consent Screen > Create Credentials > ID and Secret
Authorized Redirect URI
http://localhost:3000/api/auth/callback/google

Github
https://github.com/settings/developers
OAuth Apps > New OAuth App
Authorized Redirect URI
http://localhost:3000/api/auth/callback/github

Email (Nodemailer)
Just copy over and make a new app password for google

Paddle
https://sandbox-vendors.paddle.com/authentication-v2
Get Paddle API Key, Token, and Webhook Token
Get Seller ID

UploadThing
https://uploadthing.com/dashboard/[team]/[id]/api-keys
Get Uploadthing token and Secret Key

Database
Get Connection URL
```

7. Copy the boilerplate of index and schema and ensure the schema's prefix for table names are updated
   `src > server > db`

8. Push the database and check provider if changes reflected
   `npm run db:push`

9. Copy the boilerplate of config.ts - check if nodemailer needs to be updated
   `src > server > auth`

10. npm run dev should work properly
11. Edit config.js to avoid build errors

```
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default config;
```

12. Deploy the application to vercel

13. Install ShadcnUI
    `npx shadcn@latest init`

14. Copy the boilerplate of components.json
15. Add the following to ShadcnUI
    `npx shadcn@latest add button badge dialog form input label separator sheet`

16. Completely copy all the folder/files of the following

```
app > \_components except ui folder
app > \_page-sections
app > (pages)
app > api > webhook
app > api > uploadthing
utils > uploadthing.ts
app > \_components > checkout.tsx
tailwind.config.ts
src > styles > globals.css
app > layout.tsx
app > page.tsx
```

17. Test in local npm run dev
18. Test authentication if working and if will push to db
19. Test payments if subscription and one time will work
20. Test logout button and visit admin to see if logged out
21. Commit and push to vercel.
22. Development Starts

---

# Summary

## Client

1. env
2. env.js
3. shadcn
4. layout.tsx
5. page.tsx
6. styles.css
7. tailwind-config
8. components.json
9. add shadcn
10. next.config.js ignore build er
11. paddle
12. uploadthing

## Server

1. auth config.ts
2. db
3. seed db npm run db:generate and push
4. Update Schema db and starting name

## Dependencies

1. next-themes
2. @tabler-icons-react
3. nodemailer
4. ShadcnUI
5. @neondatabase/serverless
6. @paddle/paddle-js
7. @paddle/paddle-node-sdk
8. uploadthing @uploadthing/react

## Main things

1. Authentication
2. Payment gateway

### Extra Notes

UI components made by shadcn as of tailwind v4 will override dark class of theming. Ensure to remove dark: on defaults there
