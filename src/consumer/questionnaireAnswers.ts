export type QuestionnaireAnswer = string | string[]

/** Normalize submitted home-service answers for the existing JSON column. */
export function buildQuestionnaireAnswers(
  answers?: Record<string, QuestionnaireAnswer>,
  detailChips?: string[],
): Record<string, QuestionnaireAnswer> | undefined {
  const normalizedAnswers: Record<string, QuestionnaireAnswer> = {}
  const answerEntries = answers && typeof answers === 'object' && !Array.isArray(answers)
    ? Object.entries(answers).slice(0, 40)
    : []

  for (const [questionId, answer] of answerEntries) {
    if (!questionId || questionId.length > 120) continue
    if (typeof answer === 'string') {
      normalizedAnswers[questionId] = answer.trim().slice(0, 500)
    } else if (Array.isArray(answer)) {
      normalizedAnswers[questionId] = answer
        .filter((value): value is string => typeof value === 'string')
        .slice(0, 20)
        .map(value => value.trim().slice(0, 200))
    }
  }

  const selectedDetailChips = (detailChips ?? [])
    .filter((chip): chip is string => typeof chip === 'string')
    .slice(0, 20)
    .map(chip => chip.trim().slice(0, 200))
    .filter(Boolean)

  const result = {
    ...normalizedAnswers,
    ...(selectedDetailChips.length > 0 ? { selectedDetailChips } : {}),
  }

  return Object.keys(result).length > 0 ? result : undefined
}
