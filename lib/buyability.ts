// Shared Buy-Ability affordability estimate (base currency: NGN).

export const CREDIT_OPTIONS = [
  { value: "excellent", label: "Excellent (740+)" },
  { value: "good", label: "Good (670–739)" },
  { value: "fair", label: "Fair (580–669)" },
  { value: "poor", label: "Building (below 580)" },
];

const RATES: Record<string, number> = {
  excellent: 0.065,
  good: 0.075,
  fair: 0.09,
  poor: 0.11,
};

export interface BuyAbilityInput {
  annual_income?: number | null;
  down_payment?: number | null;
  monthly_debt?: number | null;
  credit_score?: string | null;
}

/** Rough max home price using a 36% DTI back-end and a 30-year mortgage. */
export function estimateBudget(input: BuyAbilityInput): number {
  const income = input.annual_income || 0;
  const down = input.down_payment || 0;
  const debt = input.monthly_debt || 0;

  const monthlyIncome = income / 12;
  const availForHousing = Math.max(0, monthlyIncome * 0.36 - debt);
  const principalAndInterest = availForHousing * 0.8; // reserve ~20% for taxes/insurance
  const annualRate = RATES[input.credit_score ?? ""] ?? 0.08;
  const r = annualRate / 12;
  const n = 360;
  const loan = r > 0 ? (principalAndInterest * (1 - Math.pow(1 + r, -n))) / r : principalAndInterest * n;

  return Math.max(0, Math.round(loan + down));
}
