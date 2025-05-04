# A fully functional forum system built with Next.js
> This is still a Work In Proccess project, so there might be a lot of bugs and issues.
# Features✨
- OAuth2 Authentication
- Dark / Light Mode
- Internationalization(i18n) Support
- User Dashboard
- Infinite Scroll Post Feed
- Create Posts
- View Posts
- GET, POST, PATCH, DELETE RESTful APIs
# Installation
1. Clone the repository.
2. Navigate to the repository directory and run `npm install --force`.
3. Rename `.env.example` to `.env`.
4. Setup Postgres and fill in `DATABASE_URL`.
5. Generate `AUTH_SECRET` with `npx auth secret` or manually with `openssl rand -base64 32`.
6. Setup your OAuth2 providers.
7. Setup [FileAPI](https://github.com/SHD-Development/fileapi) to support image upload.
8. Edit your configurations in `src/config.ts`.
9. Generate Prisma client with `npx prisma generate`.
10. Migrate your database with `npx prisma db push`.
11. Generate an optimized build for production with `npm run build`.
12. Start your application with `npm run start`.
