export function toNumber(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

export function computeMonthlyPayment(amount, months, annualRate) {
  const P = toNumber(amount);
  const n = Math.max(1, Math.floor(toNumber(months)));
  const r = toNumber(annualRate) / 100 / 12;
  if (r === 0) return P / n;
  const a = (P * r) / (1 - Math.pow(1 + r, -n));
  return a;
}

export function buildAmortization(amount, months, annualRate) {
  const payment = computeMonthlyPayment(amount, months, annualRate);
  const r = toNumber(annualRate) / 100 / 12;
  let remaining = toNumber(amount);
  const rows = [];
  for (let m = 1; m <= months; m++) {
    const interest = remaining * r;
    const principal = Math.max(0, payment - interest);
    remaining = Math.max(0, remaining - principal);
    rows.push({ month: m, interest, principal, remaining });
  }
  return { payment, rows };
}

export function summarize(amount, months, annualRate, fees = 0) {
  const { payment, rows } = buildAmortization(amount, months, annualRate);
  const totalPaid = payment * months;
  const years = months / 12;
  const apr =
    toNumber(annualRate) + (toNumber(fees) / toNumber(amount) / years) * 100;
  return { payment, totalPaid, apr, rows };
}

export const formatMoney = (n, currency = "MAD") =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(n);
