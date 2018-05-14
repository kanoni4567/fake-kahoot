/* eslint-env jest */
const usersM = require.requireActual('../models/users')
const questions = require.requireActual('../controllers/questions')
const account = require.requireActual('../models/account')

beforeAll(() => {
  return undefined
})

afterAll(() => {
  return undefined
})

/**
 * If beforeEach is inside a describe block, it runs for each test in the describe block.
 */
beforeEach(() => {
  return undefined
})

/**
 * If afterEach is inside a describe block, it runs for each test in the describe block.
 */
afterEach(() => {
  return undefined
})

describe('Testing methods in Question Class', () => {
  test('Testing assessQuestionResult; Answer True', () => {
    let instanceQuestions = new questions.Questions()
    let instanceUser = new account.Account()

    instanceQuestions.getQuestions().then(data => {
      instanceQuestions.questionsList[1].answers = 1
      expect(instanceQuestions.assessQuestionResult(instanceUser, 1, 1)).toEqual({
        result: true,
        currentUser: instanceUser
      })
    })
  })

  test('Testing assessQuestionResult; Answer False', () => {
    let instanceQuestions = new questions.Questions()
    let instanceUser = new account.Account()
    instanceQuestions.getQuestions().then(data => {
      instanceQuestions.questionsList[1].answers = 1
      expect(instanceQuestions.assessQuestionResult(instanceUser, 1, 2)).toEqual({
        result: false,
        currentUser: instanceUser
      })
    })
  })
})

test('test getQuestions', async () => {
  let testStructure = {
    index: expect.anything(),
    question: expect.anything(),
    option1: expect.anything(),
    option2: expect.anything(),
    option3: expect.anything(),
    option4: expect.anything()
  }
  let instanceQuestions = new questions.Questions()
  await instanceQuestions.getQuestions().then(data => {
    expect(data[0]).toEqual(testStructure)
  })
})
