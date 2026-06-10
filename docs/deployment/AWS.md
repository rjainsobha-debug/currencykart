# Deploying to AWS Lightsail or EC2

1. Provision an Ubuntu instance, RDS PostgreSQL, ElastiCache Redis and private S3 bucket.
2. Attach an IAM role granting only required SES and S3 permissions.
3. Install Node.js 22, clone the repository and run `npm ci`.
4. Store secrets in AWS Systems Manager Parameter Store or Secrets Manager.
5. Run:

   ```bash
   npm run env:validate
   npm run prisma:generate
   npm run prisma:migrate:deploy
   npm run workflow:validate
   npm run build
   ```

6. Run `npm start` under systemd or PM2.
7. Put Nginx or an Application Load Balancer in front of the service with TLS.
8. Restrict database, Redis and instance security groups to required sources.
9. Configure CloudWatch logs, alarms, RDS backups and S3 access logging.
10. Configure Razorpay webhook, Google OAuth and WhatsApp callbacks against the HTTPS domain.
11. Test instance replacement and database restore before launch.

For Lightsail, use a managed external PostgreSQL/Redis service if operational requirements exceed the bundled database options.
