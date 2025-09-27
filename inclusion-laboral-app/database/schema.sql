-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE user_role AS ENUM ('client', 'counselor', 'admin');
CREATE TYPE experience_level AS ENUM ('entry', 'mid', 'senior');
CREATE TYPE availability_type AS ENUM ('full-time', 'part-time', 'flexible');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no-show');
CREATE TYPE assessment_type AS ENUM ('skills', 'personality', 'career-interest');
CREATE TYPE job_type AS ENUM ('full-time', 'part-time', 'contract', 'internship');
CREATE TYPE resource_type AS ENUM ('article', 'video', 'course', 'tool', 'template');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE progress_category AS ENUM ('skills', 'applications', 'interviews', 'assessments');

-- Users table (extends auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role DEFAULT 'client',
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles
CREATE TABLE public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    bio TEXT,
    skills TEXT[] DEFAULT '{}',
    experience_level experience_level DEFAULT 'entry',
    preferred_industries TEXT[] DEFAULT '{}',
    location TEXT,
    availability availability_type DEFAULT 'full-time',
    disabilities TEXT[] DEFAULT '{}',
    accommodations_needed TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Appointments
CREATE TABLE public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    counselor_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER DEFAULT 60, -- minutes
    status appointment_status DEFAULT 'scheduled',
    meeting_link TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessments
CREATE TABLE public.assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type assessment_type NOT NULL,
    questions JSONB NOT NULL DEFAULT '[]',
    answers JSONB NOT NULL DEFAULT '[]',
    results JSONB,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job matches
CREATE TABLE public.job_matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    job_title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    match_score DECIMAL(3,2) CHECK (match_score >= 0 AND match_score <= 1),
    location TEXT,
    salary_range TEXT,
    job_type job_type DEFAULT 'full-time',
    accessibility_features TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources
CREATE TABLE public.resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type resource_type NOT NULL,
    content_url TEXT,
    content TEXT,
    tags TEXT[] DEFAULT '{}',
    difficulty_level difficulty_level DEFAULT 'beginner',
    estimated_time INTEGER, -- minutes
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Progress tracking
CREATE TABLE public.progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    category progress_category NOT NULL,
    metric_name TEXT NOT NULL,
    current_value DECIMAL NOT NULL,
    target_value DECIMAL,
    unit TEXT NOT NULL,
    tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Counselors can view client profiles" ON public.users
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM public.users WHERE role = 'counselor'
        ) OR auth.uid() = id
    );

-- Profiles policies
CREATE POLICY "Users can manage their own profile" ON public.profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Counselors can view client profiles" ON public.profiles
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM public.users WHERE role = 'counselor'
        ) OR auth.uid() = user_id
    );

-- Appointments policies
CREATE POLICY "Users can view their appointments" ON public.appointments
    FOR SELECT USING (auth.uid() = client_id OR auth.uid() = counselor_id);

CREATE POLICY "Clients can create appointments" ON public.appointments
    FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Participants can update appointments" ON public.appointments
    FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = counselor_id);

-- Assessments policies
CREATE POLICY "Users can manage their own assessments" ON public.assessments
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Counselors can view client assessments" ON public.assessments
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM public.users WHERE role = 'counselor'
        ) OR auth.uid() = user_id
    );

-- Job matches policies
CREATE POLICY "Users can view their job matches" ON public.job_matches
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create job matches" ON public.job_matches
    FOR INSERT WITH CHECK (true);

-- Resources policies
CREATE POLICY "Everyone can view resources" ON public.resources
    FOR SELECT USING (true);

CREATE POLICY "Counselors can manage resources" ON public.resources
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM public.users WHERE role IN ('counselor', 'admin')
        )
    );

-- Progress policies
CREATE POLICY "Users can manage their own progress" ON public.progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Counselors can view client progress" ON public.progress
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM public.users WHERE role = 'counselor'
        ) OR auth.uid() = user_id
    );

-- Functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO public.users (id, email, full_name, role) VALUES
    ('00000000-0000-0000-0000-000000000001', 'admin@inclusion-laboral.com', 'Administrador Sistema', 'admin'),
    ('00000000-0000-0000-0000-000000000002', 'counselor@inclusion-laboral.com', 'María González', 'counselor');

-- Insert sample resources
INSERT INTO public.resources (title, description, type, content_url, tags, difficulty_level, estimated_time, created_by) VALUES
    ('Guía de Entrevistas Laborales', 'Consejos y técnicas para destacar en entrevistas de trabajo', 'article', 'https://example.com/interview-guide', ARRAY['entrevistas', 'preparación', 'consejos'], 'beginner', 30, '00000000-0000-0000-0000-000000000002'),
    ('Curso de Habilidades Digitales Básicas', 'Aprende las habilidades digitales esenciales para el trabajo moderno', 'course', 'https://example.com/digital-skills', ARRAY['tecnología', 'habilidades', 'curso'], 'beginner', 120, '00000000-0000-0000-0000-000000000002'),
    ('Plantilla de CV Inclusivo', 'Plantilla de currículum vitae diseñada para personas con discapacidad', 'template', 'https://example.com/cv-template', ARRAY['cv', 'plantilla', 'inclusión'], 'beginner', 15, '00000000-0000-0000-0000-000000000002');