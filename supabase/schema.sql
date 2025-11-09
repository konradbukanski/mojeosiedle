-- Enable required extensions
create extension if not exists "pgcrypto";

create or replace function trigger_set_timestamp()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Estates
create table if not exists public.estates (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    address text,
    city text,
    timezone text not null default 'Europe/Warsaw',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger estates_set_updated_at
    before update on public.estates
    for each row
    execute procedure trigger_set_timestamp();

-- Residents
create table if not exists public.residents (
    id uuid primary key default gen_random_uuid(),
    auth_user_id uuid not null unique,
    estate_id uuid not null references public.estates (id) on delete cascade,
    first_name text not null,
    last_name text not null,
    building text,
    staircase text,
    floor text,
    apartment text,
    role text not null default 'resident' check (role in ('resident', 'moderator', 'admin')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists residents_estate_idx on public.residents (estate_id);

create trigger residents_set_updated_at
    before update on public.residents
    for each row
    execute procedure trigger_set_timestamp();

-- Announcements
create table if not exists public.announcements (
    id uuid primary key default gen_random_uuid(),
    estate_id uuid not null references public.estates (id) on delete cascade,
    author_id uuid not null references public.residents (id) on delete set null,
    title text not null,
    body text not null,
    category text not null,
    scope text not null default 'estate' check (scope in ('estate', 'building')),
    building text,
    staircase text,
    status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
    published_at timestamptz,
    expires_at timestamptz,
    moderation_reason text,
    moderated_by uuid references public.residents (id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists announcements_estate_idx on public.announcements (estate_id, created_at desc);
create index if not exists announcements_status_idx on public.announcements (status);

create trigger announcements_set_updated_at
    before update on public.announcements
    for each row
    execute procedure trigger_set_timestamp();

-- Events
create table if not exists public.events (
    id uuid primary key default gen_random_uuid(),
    estate_id uuid not null references public.estates (id) on delete cascade,
    creator_id uuid not null references public.residents (id) on delete set null,
    title text not null,
    description text not null,
    location text not null,
    start_at timestamptz not null,
    end_at timestamptz not null,
    capacity integer,
    status text not null default 'pending' check (status in ('pending', 'approved', 'cancelled')),
    moderated_by uuid references public.residents (id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists events_estate_idx on public.events (estate_id, start_at);

create trigger events_set_updated_at
    before update on public.events
    for each row
    execute procedure trigger_set_timestamp();

create table if not exists public.event_participants (
    event_id uuid not null references public.events (id) on delete cascade,
    resident_id uuid not null references public.residents (id) on delete cascade,
    status text not null default 'going' check (status in ('going', 'interested', 'not_going')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    primary key (event_id, resident_id)
);

create trigger event_participants_set_updated_at
    before update on public.event_participants
    for each row
    execute procedure trigger_set_timestamp();

-- Shops
create table if not exists public.shops (
    id uuid primary key default gen_random_uuid(),
    estate_id uuid not null references public.estates (id) on delete cascade,
    name text not null,
    description text,
    category text not null,
    phone text,
    website text,
    address text,
    opening_hours jsonb,
    status text not null default 'pending' check (status in ('pending', 'approved', 'hidden')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists shops_estate_idx on public.shops (estate_id, status);

create trigger shops_set_updated_at
    before update on public.shops
    for each row
    execute procedure trigger_set_timestamp();

-- Marketplace items
create table if not exists public.marketplace_items (
    id uuid primary key default gen_random_uuid(),
    estate_id uuid not null references public.estates (id) on delete cascade,
    seller_id uuid not null references public.residents (id) on delete set null,
    title text not null,
    description text not null,
    price numeric(10,2),
    currency varchar(3) not null default 'PLN',
    category text not null,
    listing_type text not null default 'offer' check (listing_type in ('offer', 'request')),
    status text not null default 'pending' check (status in ('pending', 'approved', 'sold', 'rejected')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists marketplace_estate_idx on public.marketplace_items (estate_id, created_at desc);

create trigger marketplace_set_updated_at
    before update on public.marketplace_items
    for each row
    execute procedure trigger_set_timestamp();

alter table if exists public.marketplace_items
    alter column price drop not null;

alter table if exists public.marketplace_items
    add column if not exists listing_type text not null default 'offer' check (listing_type in ('offer', 'request'));

-- Issue reports
create table if not exists public.issue_reports (
    id uuid primary key default gen_random_uuid(),
    estate_id uuid not null references public.estates (id) on delete cascade,
    reporter_id uuid not null references public.residents (id) on delete set null,
    title text not null,
    description text not null,
    priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
    status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'dismissed')),
    assigned_to uuid references public.residents (id),
    resolution_note text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists issue_reports_estate_idx on public.issue_reports (estate_id, status);

create trigger issue_reports_set_updated_at
    before update on public.issue_reports
    for each row
    execute procedure trigger_set_timestamp();

-- Media assets
create table if not exists public.media_assets (
    id uuid primary key,
    entity_type text not null check (entity_type in ('announcement', 'event', 'marketplace', 'issue', 'shop', 'profile')),
    entity_id uuid,
    estate_id uuid not null references public.estates (id) on delete cascade,
    storage_path text not null,
    file_name text not null,
    file_type text not null,
    file_size bigint not null,
    uploader_id uuid not null references public.residents (id) on delete set null,
    status text not null default 'pending' check (status in ('pending', 'linked')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists media_assets_entity_idx on public.media_assets (entity_type, entity_id);

create trigger media_assets_set_updated_at
    before update on public.media_assets
    for each row
    execute procedure trigger_set_timestamp();

-- Push tokens
create table if not exists public.push_tokens (
    id uuid primary key default gen_random_uuid(),
    resident_id uuid not null references public.residents (id) on delete cascade,
    estate_id uuid not null references public.estates (id) on delete cascade,
    fcm_token text not null unique,
    platform text not null check (platform in ('android', 'ios', 'web')),
    device text,
    last_used_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists push_tokens_estate_idx on public.push_tokens (estate_id);

create trigger push_tokens_set_updated_at
    before update on public.push_tokens
    for each row
    execute procedure trigger_set_timestamp();

-- Moderation logs
create table if not exists public.moderation_logs (
    id uuid primary key default gen_random_uuid(),
    entity_type text not null,
    entity_id uuid not null,
    moderator_id uuid not null references public.residents (id) on delete set null,
    action text not null,
    reason text,
    created_at timestamptz not null default now()
);

create index if not exists moderation_logs_entity_idx on public.moderation_logs (entity_type, entity_id);
