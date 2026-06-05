import type { StartupForecastSubmission } from '@/types';

export const mockForecastSubmissions: StartupForecastSubmission[] = [
  {
    id: 'forecast-submission-1',
    startupId: 'pitchpal',
    userId: 'current',
    answers: [
      {
        questionId: 'next-round-18m',
        probability: 82,
        reasoning: 'Strong accelerator distribution supports a follow-on round.',
      },
      {
        questionId: 'arr-1m-24m',
        probability: 74,
        reasoning: 'Early revenue and program contracts suggest ARR ramp potential.',
      },
    ],
    createdAt: '2026-05-27T18:00:00Z',
    updatedAt: '2026-05-27T18:00:00Z',
  },
  {
    id: 'forecast-submission-2',
    startupId: 'labledger',
    userId: 'current',
    answers: [
      {
        questionId: 'arr-1m-24m',
        probability: 68,
        reasoning: 'Seat expansion is real, but academic procurement may slow ARR pace.',
      },
    ],
    createdAt: '2026-05-26T12:30:00Z',
    updatedAt: '2026-05-26T12:30:00Z',
  },
  {
    id: 'forecast-submission-3',
    startupId: 'venturebowl',
    userId: 'current',
    answers: [
      {
        questionId: 'next-round-18m',
        probability: 45,
        reasoning: 'Still pre-product; funding depends on a successful closed beta.',
      },
      {
        questionId: 'exit-100m-5y',
        probability: 38,
      },
    ],
    createdAt: '2026-05-22T09:15:00Z',
    updatedAt: '2026-05-22T09:15:00Z',
  },
];
