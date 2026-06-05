import { initialsFromName } from '@/lib/initials';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Database } from '@/types/database';

export type SignUpParams = {
  email: string;
  password: string;
  fullName: string;
  username: string;
  campus: string;
};

export type AuthResult = {
  error?: string;
  needsEmailConfirmation?: boolean;
};

function requireClient() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client unavailable');
  }
  return supabase;
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const supabase = requireClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) return { error: error.message };
    return {};
  } catch (caught) {
    return { error: caught instanceof Error ? caught.message : 'Sign in failed' };
  }
}

export async function signUpWithEmail(params: SignUpParams): Promise<AuthResult> {
  try {
    const supabase = requireClient();
    const { data, error } = await supabase.auth.signUp({
      email: params.email.trim(),
      password: params.password,
      options: {
        data: {
          full_name: params.fullName.trim(),
          username: params.username.trim(),
          campus: params.campus.trim(),
        },
      },
    });

    if (error) return { error: error.message };

    const user = data.user;
    if (!user) {
      return { error: 'Sign up did not return a user. Please try again.' };
    }

    if (data.session) {
      const profileError = await createProfileForUser({
        id: user.id,
        fullName: params.fullName,
        username: params.username,
        campus: params.campus,
      });
      if (profileError) return { error: profileError };
      return {};
    }

    return { needsEmailConfirmation: true };
  } catch (caught) {
    return { error: caught instanceof Error ? caught.message : 'Sign up failed' };
  }
}

export async function createProfileForUser(params: {
  id: string;
  fullName: string;
  username: string;
  campus: string;
}): Promise<string | undefined> {
  const supabase = getSupabase();
  if (!supabase) return 'Supabase is not configured';

  const payload: Database['public']['Tables']['profiles']['Insert'] = {
    id: params.id,
    username: params.username.trim(),
    campus: params.campus.trim(),
    avatar_initials: initialsFromName(params.fullName, params.username),
    bio: '',
    reputation_score: 0,
    forecasts_made: 0,
    investment_decisions_made: 0,
    watchlist_count: 0,
    accuracy_rate: 0,
    rank: 0,
    badges: [],
    recent_activity: [],
    default_thesis: '',
  };

  const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });

  if (error) return error.message;
  return undefined;
}

export async function signOutFromSupabase(): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
}
