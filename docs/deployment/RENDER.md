# Deploying to Render

1. Create a Render PostgreSQL database or provide an external PostgreSQL URL.
2. Create a Web Service using Node 22.
3. Build command:

   ```bash
   npm ci && npm run prisma:generate && npm run build
   ```

4. Start command:

   ```bash
   npm start
   ```

5. Add environment variables from `.env.example`.
6. Run `npm run prisma:migrate:deploy` as a pre-deploy command or controlled one-off job.
7. Set health monitoring against `/`.
8. Configure a persistent Redis service for rate limiting.
9. Keep documents in private object storage, not Render's ephemeral filesystem.
10. Configure webhook, OAuth and email-domain DNS records before launch.
