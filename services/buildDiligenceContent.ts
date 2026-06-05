import { formatCurrency } from '@/lib/format';
import {
  buildSimulatedDcfScenarios,
  formatDcfCaseIntro,
} from '@/lib/simulatedDcf';
import { generateDiligenceMock } from '@/services/generateDiligenceMock';
import type { DiligenceReport } from '@/types';
import type { FounderSubmissionInput, Startup } from '@/types';

type DiligenceSections = Pick<
  DiligenceReport,
  | 'executiveSummary'
  | 'marketAnalysis'
  | 'competitorAnalysis'
  | 'risks'
  | 'investmentMemo'
  | 'suggestedQuestions'
  | 'aiScore'
>;

const MOCK_SECTIONS: Record<string, DiligenceSections> = {
  quadlink: {
    executiveSummary:
      'QuadLink is attacking pre-semester social graph formation — the highest-intent moment in the campus lifecycle. The Stanford beta shows 38% week-4 retention, which is unusually strong for a social wedge. Key open question: whether density can be replicated at R1 #2 without paid ambassadors. We weight product pull above hype, but institutional distribution remains unproven.',
    marketAnalysis:
      'TAM is framed as ~15M U.S. undergraduates × $8–15 ARPU potential for premium communities = $120M–$225M serviceable if monetization ever lands. SAM focuses on ~2.4M students at top-50 research universities with active club/orientation budgets. SOM for 24 months: 80K MAUs across 8 campuses at $0 ARPU today, with optional B2B orientation licensing at $12K/campus/year. Growth drivers: NSO timing, transfer student influx, and club officer turnover. Headwinds: free alternatives (GroupMe, Discord) and university IT friction.',
    competitorAnalysis:
      'Mapped competitors: (1) GroupMe / WhatsApp — free, chaotic, no matching; (2) Discord servers — high engagement but admin-heavy; (3) university “Class of 20XX” Facebook groups — declining usage; (4) niche apps (Fizz, Sidechat) — anonymous, not onboarding-focused. QuadLink’s wedge is structured micro-communities at peak motivation. Switching costs rise if friend groups persist past week 6. No verified win/loss data vs. Discord yet — diligence gap.',
    risks: [
      'Cold-start failure when launching campus #2 without 50+ trained ambassadors',
      'Safety/moderation incidents in student matching could trigger university bans',
      'Meta or Discord ships “orientation mode” copying core workflow',
      'Monetization unclear — consumer subscription unproven at campus price points',
      'Seasonal churn after students find their core friend group (week 3–5 drop-off risk)',
    ],
    investmentMemo:
      'QuadLink fits the FutarchyVC thesis: collective intelligence on whether community density compounds. At $750K on $4.5M post, investors are buying optionality on network effects, not current ARR. Recommend founder call focused on cohort curves by dorm cluster, ambassador cost per activated user, and LOIs from student affairs offices. DCF bull/bear below bracket valuation sensitivity — simulated for demo.',
    suggestedQuestions: [
      'Show week-1 → week-8 retention by acquisition channel (organic vs. ambassador).',
      'What is CAC per activated user at the next campus launch?',
      'Which student affairs offices have you spoken with about official distribution?',
      'How do you prevent ghost towns after syllabus week?',
      'What moderation stack exists for harassment reports <24h SLA?',
    ],
    aiScore: 78,
  },
  labledger: {
    executiveSummary:
      'LabLedger is one of the few campus-origin companies here with paying customers ($18K ARR, 6 labs). The product replaces spreadsheet grant tracking — a workflow PI’s actually feel pain on. Expansion from 2.3 seats/lab suggests land-and-expand within departments. Seed round at $8M post is supported by early-revenue multiples if NRR holds across academic year turnover.',
    marketAnalysis:
      'U.S. university research spend exceeds $90B annually; thousands of labs still run stipend and supply tracking in Google Sheets. SAM: ~12K life-science and engineering labs at R1/R2 institutions with >$500K annual grant throughput. Pricing hypothesis $1.2K–$4.8K/lab/year vs. enterprise LIMS at $25K+. SOM near-term: 200 labs → $240K–$960K ARR. Procurement cycles shorten when PIs pay on grants (29-day terms vs. 9-month IT).',
    competitorAnalysis:
      'Benchling / Labguru target pharma budgets. Airtable + email approvals are the real incumbent. LabLedger wins on 48-hour setup and undergrad-friendly UX. Competitive risk: vendor “lite” tiers or Notion templates. Moat forms via grant compliance exports and finance system hooks — none verified in data room yet.',
    risks: [
      'PI turnover can zero accounts unless multi-user continuity is designed',
      'Security review delays at .edu institutions',
      'Spreadsheet inertia — “good enough” for small labs',
      'Expansion to department buyers lengthens sales cycle 3–6 months',
      'Grant seasonality creates Q3 cash collection bumps',
    ],
    investmentMemo:
      'LabLedger is the most fundamentals-ready name in the feed. DCF scenarios stress seat expansion vs. churn at PI transition. If net revenue retention >110% across two academic years, $1.2M raise is conservative for inside sales hire + SOC2-lite. Pass if labs are pilot-only with no renewal data.',
    suggestedQuestions: [
      'What is gross retention when the PI who purchased leaves?',
      'Show paid seat expansion curve for the longest-tenured lab.',
      'Any department-level pilots with budget sign-off?',
      'Which grant systems do you export to today?',
    ],
    aiScore: 84,
  },
  dormdash: {
    executiveSummary:
      'DormDash proved demand in a 6-week Berkeley pilot (900 orders, 24-min avg delivery). The business is operationally heavy — not a pure software margin story. Pre-seed at $3M post buys routing software and campus #2 launch. Unit economics per order are the gating metric; software narrative alone is insufficient.',
    marketAnalysis:
      'Campus food delivery TAM is niche: ~2,000 U.S. campuses × peak 500 orders/night × $2 take rate = theoretical ceiling, but ops cap supply. SAM: 50 campuses with >15K students and late-night dining gaps. SOM: 2 campuses, 4K orders/month, $8K net contribution if 12% margin holds. Partnership with dining surplus could improve COGS vs. third-party restaurants.',
    competitorAnalysis:
      'DoorDash/Uber Eats charge $5–8 fees — unpopular with students. Informal “Discord runners” compete on price with zero reliability. DormDash must win ETA variance <8 minutes and food safety protocols. Moat = dining hall contracts + batch routing IP (unpatented, early).',
    risks: [
      'Negative contribution margin if batching fails during rain/finals',
      'Food safety liability and insurance costs understated',
      'University policy may restrict third-party delivery in dorms',
      'Runner supply churn during exam weeks',
      'Capital intensive scale — each campus needs local ops lead',
    ],
    investmentMemo:
      'Treat DormDash as a logistics startup with software enablement. DCF bull assumes route density improves margin to 18% by Y3; bear assumes perpetual sub-5% margin. Only invest if pilot order-level P&L is auditable.',
    suggestedQuestions: [
      'Fully loaded P&L per order in Berkeley pilot?',
      'What percent of orders were batched >2 per trip?',
      'Dining hall contract status at campus #2?',
      'Insurance rider for food handling?',
    ],
    aiScore: 72,
  },
  pitchpal: {
    executiveSummary:
      'PitchPal has the strongest GTM proof in cohort: 11 accelerator partnerships, 2,800 decks reviewed, NPS 61. Revenue quality depends on converting free cohort seats to paid founder plans. AI pitch coaching is commoditizing — distribution through accelerators is the defensible asset if renewals hold.',
    marketAnalysis:
      'Collegiate accelerator TAM: ~400 programs × 20 teams × $500 ARPU = $4M baseline; expand to global accelerators and alumni angels → $25M+ SAM. Add B2B analytics for programs tracking deck quality → $10K/program/year. SOM: 40 programs paying, 8K MAU founders, $1.5M ARR in 18 months if conversion curves hold.',
    competitorAnalysis:
      'ChatGPT, Claude, and Gamma compete on generic deck feedback. PitchPal’s rubric trained on real demo-day scoring is differentiated if proprietary. Mentor networks (Techstars mentors, alumni) compete for attention time, not dollars. Win when accelerators mandate PitchPal before demo day.',
    risks: [
      'Foundation models absorb rubric features within 12 months',
      'Accelerator budgets cut → partnership churn',
      'Founders leak confidential decks — trust incidents',
      'Pricing pressure toward $10/mo consumer tier',
      'Seasonal usage spikes only pre-demo day',
    ],
    investmentMemo:
      'PitchPal merits seed attention at $12M post if 3+ accelerators renew annually. DCF bull case assumes 65% gross margin SaaS with viral cohort loops; bear case assumes single-digit ARPU compression. Validate paid conversion after program ends.',
    suggestedQuestions: [
      'Renewal rate and expansion revenue per accelerator partner?',
      'Paid conversion 90 days post-cohort?',
      'What data moat exists beyond prompts?',
      'Enterprise pipeline for university entrepreneurship centers?',
    ],
    aiScore: 89,
  },
  roomreserve: {
    executiveSummary:
      'RoomReserve solves daily library friction with measurable engagement (1,100 MAUs, 41% bookings via smart alerts). Monetization likely B2B2C through libraries, not student subscriptions. MVP quality is high for campus infra; procurement path determines venture outcome.',
    marketAnalysis:
      'U.S. academic libraries: ~4,000 institutions. SAM: 800 libraries with study-room booking pain and modernization budgets ($5K–$25K/year). SOM: 25 libraries paying $12K ARR average in 3 years = $300K ARR. Student app drives utilization data libraries will pay for — “Space Analytics” upsell.',
    competitorAnalysis:
      'LibCal, EMS, and legacy facility systems own compliance but have poor mobile UX. Browser extensions break when APIs change. RoomReserve needs official API partnerships — Duke pilot is proof of concept, not contract.',
    risks: [
      'IT blocks unofficial integrations',
      'Libraries demand RFP process >9 months',
      'Low willingness to pay from students',
      'Exam-week seasonality skews MAU',
      'Incumbent vendors add mobile layer',
    ],
    investmentMemo:
      'RoomReserve is a infrastructure bet with clear user love. DCF bull assumes library SaaS contracts; bear assumes stalled B2B and stagnant consumer-only usage. Priority: one paid library LOI.',
    suggestedQuestions: [
      'Budget owner and pilot pricing discussed with Duke libraries?',
      'Contract if official API changes?',
      'Revenue model: per-library vs. per-seat?',
    ],
    aiScore: 75,
  },
  venturebowl: {
    executiveSummary:
      'VentureBowl is thesis-aligned with FutarchyVC but pre-product. Survey validation (420 responses, 18% WoW waitlist) is encouraging yet unmonetized. Legal structure for forecasting mechanics must be resolved before scale. Pre-seed appropriate for MVP + single-accelerator beta.',
    marketAnalysis:
      'Prediction/reputation platforms in startup ecosystems are nascent. SAM: campus accelerators + angel groups (~500 institutions) × $15K/year platform fee. SOM: 10 campuses, 5K forecasters, reputation graph as engagement layer. Upside ties to deal flow quality improvement — hard to quantify early.',
    competitorAnalysis:
      'Informal Twitter/LinkedIn hype, demo-day applause voting, and alumni intros are substitutes. Polymarket/Kalshi not campus-focused. VentureBowl wins if reputation scores correlate with outcomes and founders trust signal.',
    risks: [
      'Regulatory uncertainty on forecasting incentives',
      'Chicken-and-egg: founders vs. forecasters',
      'Gaming and friend-bias in student networks',
      'Copycats from established campus apps',
      'Low engagement if outcomes take years to resolve',
    ],
    investmentMemo:
      'Concept-strong, evidence-light. DCF scenarios are highly speculative with near-zero base revenue. Invest only with legal opinion and closed beta design partner (one accelerator cohort).',
    suggestedQuestions: [
      'Legal memo on non-cash reputation rewards?',
      'Anti-gaming design for friend clusters?',
      'Which accelerator signed for beta?',
      'How do forecasts resolve to reputation updates?',
    ],
    aiScore: 69,
  },
};

function submissionFromStartup(startup: Startup): FounderSubmissionInput {
  return {
    name: startup.name,
    tagline: startup.tagline,
    description: startup.description,
    websiteUrl: startup.websiteUrl,
    industry: startup.industry,
    stage: startup.stage,
    amountRaising: startup.amountRaising,
    valuation: startup.valuation,
    traction: startup.traction,
    founderName: startup.founderName,
    founderEmail: startup.founderEmail ?? '',
  };
}

export function buildDiligenceFromStartup(
  startup: Startup,
  generatedAt?: string
): DiligenceReport {
  const input = submissionFromStartup(startup);
  const sections = MOCK_SECTIONS[startup.id];
  const { bull, bear } = buildSimulatedDcfScenarios({
    name: startup.name,
    stage: startup.stage,
    amountRaising: startup.amountRaising,
    valuation: startup.valuation,
    industry: startup.industry,
  });

  const bullCase = formatDcfCaseIntro(bull, startup.name, 'bull');
  const bearCase = formatDcfCaseIntro(bear, startup.name, 'bear');

  if (sections) {
    return {
      id: `diligence-${startup.id}`,
      startupId: startup.id,
      ...sections,
      bullCase,
      bearCase,
      bullCaseDcf: bull,
      bearCaseDcf: bear,
      generatedAt: generatedAt ?? startup.createdAt,
    };
  }

  const mock = generateDiligenceMock(input);
  return {
    id: `diligence-${startup.id}`,
    startupId: startup.id,
    executiveSummary: mock.executiveSummary,
    marketAnalysis: mock.marketAnalysis,
    competitorAnalysis: mock.competitorAnalysis,
    bullCase,
    bearCase,
    bullCaseDcf: bull,
    bearCaseDcf: bear,
    risks: mock.risks,
    investmentMemo: mock.investmentMemo,
    suggestedQuestions: mock.suggestedQuestions,
    aiScore: mock.aiScore,
    generatedAt: generatedAt ?? new Date().toISOString(),
  };
}
