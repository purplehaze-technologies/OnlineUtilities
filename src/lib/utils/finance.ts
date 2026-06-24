/**
 * Financial calculation helpers. Framework-free; reused by GST, SIP and EMI
 * tools and ready for any future finance utility (FD calculator, tax brackets,
 * compound interest, etc.).
 */

/* -------------------------------------------------------------------------- */
/* GST                                                                         */
/* -------------------------------------------------------------------------- */

export interface GstResult {
  base: number;
  gst: number;
  total: number;
}

/** GST-exclusive: base amount given, compute GST and total. */
export function calcGstExclusive(amount: number, rate: number): GstResult {
  const gst = amount * (rate / 100);
  return { base: amount, gst, total: amount + gst };
}

/** GST-inclusive: total (GST-included) amount given, back-calculate base and GST. */
export function calcGstInclusive(total: number, rate: number): GstResult {
  const base = total / (1 + rate / 100);
  return { base, gst: total - base, total };
}

/* -------------------------------------------------------------------------- */
/* SIP                                                                         */
/* -------------------------------------------------------------------------- */

export interface SipResult {
  totalInvested: number;
  returns: number;
  finalValue: number;
}

export interface SipYearRow {
  year: number;
  invested: number;
  value: number;
  returns: number;
}

/**
 * Future value of a SIP using the standard formula:
 * FV = P × ((1+r)^n − 1) / r × (1+r), where r = monthly rate, n = months.
 */
export function calcSip(
  monthly: number,
  annualRate: number,
  years: number
): SipResult {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  const totalInvested = monthly * n;
  const fv =
    r === 0
      ? totalInvested
      : monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  return { totalInvested, returns: fv - totalInvested, finalValue: fv };
}

/** Year-by-year SIP growth table (compounding monthly). */
export function calcSipYearwise(
  monthly: number,
  annualRate: number,
  years: number
): SipYearRow[] {
  const r = annualRate / 12 / 100;
  return Array.from({ length: years }, (_, i) => {
    const n = (i + 1) * 12;
    const invested = monthly * n;
    const value =
      r === 0 ? invested : monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    return { year: i + 1, invested, value, returns: value - invested };
  });
}

/* -------------------------------------------------------------------------- */
/* EMI                                                                         */
/* -------------------------------------------------------------------------- */

export interface EmiResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  principal: number;
}

export interface EmiYearRow {
  year: number;
  principalPaid: number;
  interestPaid: number;
  endBalance: number;
}

/**
 * Monthly EMI: E = P × r × (1+r)^n / ((1+r)^n − 1),
 * where r = monthly rate, n = total months.
 */
export function calcEmi(
  principal: number,
  annualRate: number,
  months: number
): EmiResult {
  const r = annualRate / 12 / 100;
  const emi =
    r === 0
      ? principal / months
      : (principal * r * Math.pow(1 + r, months)) /
        (Math.pow(1 + r, months) - 1);
  const totalPayment = emi * months;
  return {
    emi,
    totalPayment,
    totalInterest: totalPayment - principal,
    principal,
  };
}

/** Year-by-year amortization summary. */
export function calcEmiYearwise(
  principal: number,
  annualRate: number,
  months: number
): EmiYearRow[] {
  const r = annualRate / 12 / 100;
  const emi =
    r === 0
      ? principal / months
      : (principal * r * Math.pow(1 + r, months)) /
        (Math.pow(1 + r, months) - 1);

  let balance = principal;
  const years = Math.ceil(months / 12);
  const rows: EmiYearRow[] = [];

  for (let yr = 1; yr <= years; yr++) {
    const startMonth = (yr - 1) * 12 + 1;
    const endMonth = Math.min(yr * 12, months);
    let principalPaid = 0;
    let interestPaid = 0;
    for (let m = startMonth; m <= endMonth; m++) {
      const interest = balance * r;
      const pmt = Math.min(emi - interest, balance);
      interestPaid += interest;
      principalPaid += pmt;
      balance = Math.max(0, balance - pmt);
    }
    rows.push({ year: yr, principalPaid, interestPaid, endBalance: balance });
  }
  return rows;
}
