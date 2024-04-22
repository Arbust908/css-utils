export function validateAmountQuery(query: QueryObject): number {
  const amount = Number(Array.isArray(query.amount) ? query.amount[0] : query.amount)
  if (Number.isNaN(amount) || amount < 0 || !amount) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Invalid number',
    })
  }
  return amount
}