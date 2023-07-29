import { ChatUtil } from "../utils/chatUtil.js"
import { prompt1 } from "../prompts/prompts.js"
const chatUtil = new ChatUtil()
const openai = chatUtil.getOpenai()

export class ChatService {
  async jsprompt(message, context) {
    console.log('jsprompt')
    const parsedContext = await JSON.parse(context)

    try {
      const harmful = await chatUtil.evaluateHarm(message);
      if (harmful || !chatUtil.validateInput(message)) {
        return {
          error: true,
          content: "Check your question, it should be 5-100 characters long and not contain any special characters."
        }
      }

      const systemContent = prompt1(message, parsedContext)

      console.log('********************************************************************************************')
      console.log(systemContent)
      console.log('############################################################################################')

      const fetch = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        // model: "gpt-4",
        messages: [
          { role: "system", content: systemContent },
          // { role: "user", content: message }
        ],
        temperature: 0,
        max_tokens: 500,
        top_p: 1,
      });
      
      let actionstring = fetch.data.choices[0].message.content
      
      console.log(actionstring)
      
      const result = {
        actions: JSON.parse(actionstring),
        extra: "extraInfo"
      }
      
      return result
      
    } catch (error) {
      console.log(error)
      return {
        error: true,
        content: "Sorry, an unexpected error in the AI service occurred. Please try again!"
      }
    }
  }  
}
