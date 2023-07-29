import { ChatUtil } from "../utils/chatUtil.js"
const chatUtil = new ChatUtil()
const openai = chatUtil.getOpenai()

export class ChatService {
  async jsprompt(message, context) {
    const parsedContext = await JSON.parse(context)

    try {
      const harmful = await chatUtil.evaluateHarm(message);
      if (harmful || !chatUtil.validateInput(message)) {
        return {
          error: true,
          content: "Check your question, it should be 5-100 characters long and not contain any special characters."
        }
      }

      const systemContent = `
      The goal is to generate JavaScript actions based on user's HTML and their requests. The actions should be in JSON format and use the 'data-ai-id' attributes of HTML elements to locate and interact with them. Make sure the JavaScript strings use single quotes and JSON strings use double quotes. No semicolons should be included in the JavaScript code.

      Given the following array of HTML elements:
      
      ${JSON.stringify(parsedContext.elementObjects)}
      
      If the user requests "search for jackets", the actions should be:
      
      [
        {
          "fillSearch": "document.querySelector('[data-ai-id="7nsBzj"]').value = 'jackets'"
        },
        {
          "clickSearch": "document.querySelector('[data-ai-id="txDFRk"]').click()"
        }
      ]
      
      If the user requests "open the shopping cart", the action should be:
      
      [
        {
          "clickCartButton": "document.querySelector('[data-ai-id="TIxtmj"]').click()"
        }
      ]
      
      However, if the metadata for the current page says "You are now on a product page. If you are here, then do not create any more actions", no actions should be performed, regardless of the user request. In this case, return an empty array to represent that no actions are needed. The format for this would be:
      
      []
      
      In the current scenario, the metadata for the page is: ${JSON.stringify(parsedContext.pageMetadata)}. Given this metadata, what actions should be performed in response to any user request: "${message}"?
      
      
      
      `

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
      console.log('Service error:')
      console.log(error)
      console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
      console.log(error?.response?.data?.error)
      console.log('----------------------------------------')
      return {
        error: true,
        content: "Sorry, an unexpected error in the AI service occurred. Please try again!"
      }
    }
  }  
}
