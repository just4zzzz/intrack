# InTrack - Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in to your Supabase account
3. Click "New Project"
4. Fill in the project details:
   - **Name**: InTrack (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to you
5. Click "Create new project" and wait for it to be set up

## Step 2: Get Your API Credentials

1. Once your project is created, go to **Settings** (gear icon on the left sidebar)
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 3: Configure Your Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Set Up Authentication (Optional but Recommended)

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Configure email settings:
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation and password reset emails if needed

### Email Confirmation Settings

By default, Supabase requires email confirmation. You can disable this for development:

1. Go to **Authentication** → **Providers**
2. Under **Email**, toggle **"Confirm email"** off for development
3. For production, keep this enabled for security

## Step 5: Create Database Tables (Optional)

You can create tables for storing logbook entries, attendance records, etc.

### Example: Logbook Entries Table

```sql
create table logbook_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  date date not null,
  time_in time,
  time_out time,
  activities text,
  hours_worked numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table logbook_entries enable row level security;

-- Create policy so users can only see their own entries
create policy "Users can view own logbook entries"
  on logbook_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own logbook entries"
  on logbook_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own logbook entries"
  on logbook_entries for update
  using (auth.uid() = user_id);
```

### Example: User Profiles Table

```sql
create table profiles (
  id uuid references auth.users primary key,
  first_name text,
  last_name text,
  student_id text,
  department text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);
```

## Step 6: Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try registering a new account
3. Check your email for the confirmation link (if email confirmation is enabled)
4. Try logging in with your credentials

## Troubleshooting

### "Missing Supabase environment variables" Error
- Make sure your `.env` file is in the project root
- Restart your development server after updating `.env`
- Verify the variable names start with `VITE_`

### Email Not Sending
- Check Supabase **Authentication** → **Email Templates**
- For development, disable email confirmation
- For production, configure SMTP settings in Supabase

### Authentication Not Working
- Check browser console for errors
- Verify your Supabase credentials in `.env`
- Make sure the Supabase project is active (not paused)

## Next Steps

- Set up database tables for your application data
- Configure Row Level Security policies
- Add more authentication features (password reset, social logins, etc.)
- Set up real-time subscriptions for live updates across devices
