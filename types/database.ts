import type { ForecastQuestionId } from './forecast';
import type { InvestmentDecisionType } from './investment';
import type { ProfileActivityItem, ProfileBadgeEarned } from './profile';
import type { LeaderboardBadge } from './leaderboard';
import type { StartupStage, StartupStatus } from './startup';

/**
 * Supabase table row shapes (snake_case columns).
 * Run the SQL in README.md (or lib/supabase.ts header) to create matching tables.
 */

export type ProfileRow = {
  id: string;
  username: string;
  campus: string;
  avatar_initials: string;
  bio: string;
  reputation_score: number;
  forecasts_made: number;
  investment_decisions_made: number;
  watchlist_count: number;
  accuracy_rate: number;
  rank: number;
  badges: ProfileBadgeEarned[];
  recent_activity: ProfileActivityItem[];
  default_thesis: string;
  created_at: string;
  updated_at: string;
};

export type StartupRow = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  website_url: string;
  logo_url: string;
  industry: string;
  stage: StartupStage;
  status: StartupStatus;
  amount_raising: number;
  valuation: number;
  traction: string;
  founder_name: string;
  founder_email: string | null;
  ai_score: number;
  percent_invest: number;
  percent_pass: number;
  average_conviction: number;
  average_forecast: number;
  created_at: string;
};

export type DiligenceReportRow = {
  id: string;
  startup_id: string;
  executive_summary: string;
  market_analysis: string;
  competitor_analysis: string;
  bull_case: string;
  bear_case: string;
  risks: string[];
  investment_memo: string;
  suggested_questions: string[];
  ai_score: number;
  generated_at: string;
};

export type InvestmentDecisionRow = {
  id: string;
  startup_id: string;
  user_id: string;
  decision: InvestmentDecisionType;
  conviction: number;
  reasoning: string | null;
  created_at: string;
};

export type ForecastRow = {
  id: string;
  startup_id: string;
  user_id: string;
  question: ForecastQuestionId;
  probability: number;
  reasoning: string | null;
  resolved: boolean;
  created_at: string;
  updated_at: string;
};

export type LeaderboardEntryCategory = 'top_forecaster' | 'most_active' | 'campus';

export type LeaderboardEntryRow = {
  id: string;
  category: LeaderboardEntryCategory;
  rank: number;
  username: string | null;
  campus: string;
  reputation_score: number | null;
  forecast_count: number | null;
  accuracy_placeholder: string | null;
  badge: LeaderboardBadge | null;
  total_reputation: number | null;
  forecaster_count: number | null;
  avg_accuracy_placeholder: string | null;
  top_forecaster: string | null;
  weekly_momentum: string | null;
  created_at: string;
};

type TableDef<Row, Insert = Row, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<
        ProfileRow,
        Omit<ProfileRow, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        }
      >;
      startups: TableDef<StartupRow, Omit<StartupRow, 'created_at'> & { created_at?: string }>;
      diligence_reports: TableDef<
        DiligenceReportRow,
        Omit<DiligenceReportRow, 'generated_at'> & { generated_at?: string }
      >;
      investment_decisions: TableDef<
        InvestmentDecisionRow,
        Omit<InvestmentDecisionRow, 'created_at'> & { created_at?: string }
      >;
      forecasts: TableDef<
        ForecastRow,
        Omit<ForecastRow, 'created_at' | 'updated_at' | 'resolved'> & {
          resolved?: boolean;
          created_at?: string;
          updated_at?: string;
        }
      >;
      leaderboard_entries: TableDef<
        LeaderboardEntryRow,
        Omit<LeaderboardEntryRow, 'created_at'> & { created_at?: string }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
