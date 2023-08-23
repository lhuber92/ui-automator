import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})

const openai = new OpenAIApi(configuration)

export class ChatUtil {
  getOpenai () {
    return openai
  }

  async evaluateHarm (question) {
    const response = await openai.createModeration({ input: question })
    return response.data.results[0].flagged
  }

  async validateInput (question) {
    if (question.length > 1000 || question.length < 5) {
      return false
    }
    return true
  }
}