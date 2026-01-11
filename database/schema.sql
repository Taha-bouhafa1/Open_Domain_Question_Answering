-- ==================== SCHEMA QUERYMIND ====================
-- Créer les tables pour l'application de Question-Réponse

-- ==================== TABLE PROFILES ====================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Users can read own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- ==================== TABLE CONVERSATIONS ====================
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT 'Nouvelle conversation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX idx_conversations_last_updated ON public.conversations(last_updated DESC);

-- RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own conversations" 
    ON public.conversations FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations" 
    ON public.conversations FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" 
    ON public.conversations FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations" 
    ON public.conversations FOR DELETE 
    USING (auth.uid() = user_id);

-- ==================== TABLE MESSAGES ====================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
    sources JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_timestamp ON public.messages(timestamp);

-- RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own messages" 
    ON public.messages FOR SELECT 
    USING (
        conversation_id IN (
            SELECT id FROM public.conversations WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create own messages" 
    ON public.messages FOR INSERT 
    WITH CHECK (
        conversation_id IN (
            SELECT id FROM public.conversations WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own messages" 
    ON public.messages FOR DELETE 
    USING (
        conversation_id IN (
            SELECT id FROM public.conversations WHERE user_id = auth.uid()
        )
    );

-- ==================== FONCTION AUTO-CREATION PROFIL ====================
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, first_name, last_name, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', 'Name'),
        COALESCE(
            NEW.raw_user_meta_data->>'display_name',
            CONCAT(
                COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
                ' ',
                COALESCE(NEW.raw_user_meta_data->>'last_name', 'Name')
            )
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ==================== COMMENTAIRES ====================
COMMENT ON TABLE public.profiles IS 'Profils utilisateurs avec informations personnelles';
COMMENT ON TABLE public.conversations IS 'Conversations de question-réponse';
COMMENT ON TABLE public.messages IS 'Messages (questions + réponses) dans les conversations';
COMMENT ON COLUMN public.messages.confidence IS 'Score de confiance du modèle (0-1)';
COMMENT ON COLUMN public.messages.sources IS 'Passages sources utilisés pour la réponse (JSON)';