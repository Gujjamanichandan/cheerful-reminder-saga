
-- Enable the pg_cron and pg_net extensions if they're not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a scheduled job to run once daily at 8:00 AM UTC
SELECT cron.schedule(
  'daily-reminder-check', -- unique job name
  '0 8 * * *',          -- cron schedule (8:00 AM UTC daily)
  $$
  SELECT net.http_post(
    url:='https://nflrubpdjebbqbdacbli.supabase.co/functions/v1/check-reminders',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mbHJ1YnBkamViYnFiZGFjYmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMTEzNzYsImV4cCI6MjA1Njg4NzM3Nn0._YBfEI9R2ZhdcIh0Yz11ajaVq_MgzWtCgahfKcB0Taw"}'::jsonb,
    body:='{}'::jsonb
  ) AS request_id;
  $$
);
