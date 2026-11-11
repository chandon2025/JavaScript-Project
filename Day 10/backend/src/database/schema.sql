-- ==============================================================================
-- TerraShift (Field Shift): Production Database Schema (PostgreSQL / Supabase)
-- Adapting Farms with NASA Earth Observation & Local Intelligence
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ------------------------------------------------------------------------------
-- 1. Farmers Profiles Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.farmers_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    district VARCHAR(64) NOT NULL,
    upazila VARCHAR(64) NOT NULL,
    coordinates GEOMETRY(Point, 4326) NOT NULL,
    phone_number VARCHAR(20),
    preferred_language VARCHAR(5) DEFAULT 'bn' CHECK (preferred_language IN ('bn', 'en')),
    total_farm_area_bigha NUMERIC(8, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for spatial and user lookups
CREATE INDEX IF NOT EXISTS idx_farmers_profiles_user_id ON public.farmers_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_farmers_profiles_district ON public.farmers_profiles(district);
CREATE INDEX IF NOT EXISTS idx_farmers_profiles_coords ON public.farmers_profiles USING GIST(coordinates);

-- ------------------------------------------------------------------------------
-- 2. Field Analyses Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.field_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    polygon_geojson JSONB NOT NULL,
    calculated_area_bigha NUMERIC(8, 2) NOT NULL DEFAULT 1.0,
    soil_type VARCHAR(64) NOT NULL,
    measured_ph NUMERIC(4, 2) NOT NULL CHECK (measured_ph BETWEEN 3.0 AND 10.0),
    drainage VARCHAR(32) NOT NULL DEFAULT 'Well-drained',
    crop_history JSONB DEFAULT '[]'::jsonb,
    nasa_metrics JSONB NOT NULL,
    recommendations JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_field_analyses_user_id ON public.field_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_field_analyses_created_at ON public.field_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_field_analyses_nasa_metrics ON public.field_analyses USING GIN(nasa_metrics);
CREATE INDEX IF NOT EXISTS idx_field_analyses_recommendations ON public.field_analyses USING GIN(recommendations);

-- ------------------------------------------------------------------------------
-- 3. Crop Rotations Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crop_rotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID REFERENCES public.field_analyses(id) ON DELETE CASCADE,
    seasons JSONB NOT NULL,
    nitrogen_curve JSONB NOT NULL,
    risk_audit JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crop_rotations_field_id ON public.crop_rotations(field_id);
CREATE INDEX IF NOT EXISTS idx_crop_rotations_seasons ON public.crop_rotations USING GIN(seasons);

-- ------------------------------------------------------------------------------
-- 4. Weather Action Cache Table (6-Hour Expiry for NASA & Open-Meteo)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.weather_action_cache (
    id VARCHAR(128) PRIMARY KEY, -- Hash of district or rounded lat/lon
    district VARCHAR(64) NOT NULL,
    lat NUMERIC(8, 4) NOT NULL,
    lon NUMERIC(8, 4) NOT NULL,
    payload JSONB NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weather_cache_expires_at ON public.weather_action_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_weather_cache_district ON public.weather_action_cache(district);

-- ------------------------------------------------------------------------------
-- 5. Community Discussions Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.community_discussions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_name VARCHAR(128) NOT NULL,
    district VARCHAR(64) NOT NULL,
    title VARCHAR(256) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    comments JSONB DEFAULT '[]'::jsonb,
    likes_count INTEGER DEFAULT 0 CHECK (likes_count >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_district ON public.community_discussions(district);
CREATE INDEX IF NOT EXISTS idx_community_created_at ON public.community_discussions(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.farmers_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_rotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_action_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_discussions ENABLE ROW LEVEL SECURITY;

-- 1. Farmers Profiles RLS: Users can only view and edit their own profiles
CREATE POLICY "Users can view own profile" 
    ON public.farmers_profiles FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
    ON public.farmers_profiles FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
    ON public.farmers_profiles FOR UPDATE 
    USING (auth.uid() = user_id);

-- 2. Field Analyses RLS: Users can view their own field analyses; Public/anonymous can view demo
CREATE POLICY "Users can manage own field analyses"
    ON public.field_analyses FOR ALL
    USING (auth.uid() = user_id OR user_id IS NULL);

-- 3. Crop Rotations RLS
CREATE POLICY "Users can view and manage their crop rotations"
    ON public.crop_rotations FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.field_analyses 
            WHERE public.field_analyses.id = public.crop_rotations.field_id 
            AND (public.field_analyses.user_id = auth.uid() OR public.field_analyses.user_id IS NULL)
        )
    );

-- 4. Weather Action Cache RLS: Readable by any authenticated or anonymous user; writable by backend
CREATE POLICY "Public read-only for weather cache"
    ON public.weather_action_cache FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Backend service role can insert/update weather cache"
    ON public.weather_action_cache FOR ALL
    TO service_role
    USING (true);

-- 5. Community Discussions RLS: Anyone can read, authenticated or guest can insert
CREATE POLICY "Public can view community posts"
    ON public.community_discussions FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Anyone can create community posts"
    ON public.community_discussions FOR INSERT
    TO PUBLIC
    WITH CHECK (true);

CREATE POLICY "Author can update community posts"
    ON public.community_discussions FOR UPDATE
    TO PUBLIC
    USING (true);
