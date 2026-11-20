import { expect, test } from '@playwright/test'
import { buildQuestionnaireAnswers } from '../../src/consumer/questionnaireAnswers'

test('normalizes home-service qualifier answers and selected issue chips', () => {
  expect(buildQuestionnaireAnswers(
    { system: ' Furnace ', appliance: ['Washer', 'Dryer'] },
    [' Leaky faucet ', 'Pipe burst'],
  )).toEqual({
    system: 'Furnace',
    appliance: ['Washer', 'Dryer'],
    selectedDetailChips: ['Leaky faucet', 'Pipe burst'],
  })
})

test('bounds untrusted answer sizes and omits empty responses', () => {
  const longAnswer = 'x'.repeat(600)
  const answers = buildQuestionnaireAnswers(
    { description: longAnswer, options: Array.from({ length: 25 }, (_, i) => `option-${i}`) },
    Array.from({ length: 25 }, (_, i) => `chip-${i}`),
  )

  expect(answers?.description).toBe('x'.repeat(500))
  expect(answers?.options).toHaveLength(20)
  expect(answers?.selectedDetailChips).toHaveLength(20)
  expect(buildQuestionnaireAnswers()).toBeUndefined()
})
