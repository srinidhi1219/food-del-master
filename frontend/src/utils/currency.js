const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

export const formatInr = (value) => inrFormatter.format(Number(value) || 0);