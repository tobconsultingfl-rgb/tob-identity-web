// Base API response types
export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
}

export interface ValidationProblemDetails extends ProblemDetails {
  errors?: Record<string, string[]> | null;
}

// API Response wrappers
export type ApiResponse<T> = T;
export type ApiError = ProblemDetails | ValidationProblemDetails;

// Common types
export const State = {
  AL: 'AL',
  AK: 'AK',
  AR: 'AR',
  AZ: 'AZ',
  CA: 'CA',
  CO: 'CO',
  CT: 'CT',
  DC: 'DC',
  DE: 'DE',
  FL: 'FL',
  GA: 'GA',
  HI: 'HI',
  IA: 'IA',
  ID: 'ID',
  IL: 'IL',
  IN: 'IN',
  KS: 'KS',
  KY: 'KY',
  LA: 'LA',
  MA: 'MA',
  MD: 'MD',
  ME: 'ME',
  MI: 'MI',
  MN: 'MN',
  MO: 'MO',
  MS: 'MS',
  MT: 'MT',
  NC: 'NC',
  ND: 'ND',
  NE: 'NE',
  NH: 'NH',
  NJ: 'NJ',
  NM: 'NM',
  NV: 'NV',
  NY: 'NY',
  OK: 'OK',
  OH: 'OH',
  OR: 'OR',
  PA: 'PA',
  RI: 'RI',
  SC: 'SC',
  SD: 'SD',
  TN: 'TN',
  TX: 'TX',
  UT: 'UT',
  VA: 'VA',
  VT: 'VT',
  WA: 'WA',
  WI: 'WI',
  WV: 'WV',
  WY: 'WY'
} as const;

export type State = typeof State[keyof typeof State];