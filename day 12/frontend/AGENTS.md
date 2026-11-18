# Project Architecture Rules

- Keep user-facing identity fields in an RLS-protected `public.profiles` table, populated from trusted auth-provider metadata, so each account can access only its own profile.