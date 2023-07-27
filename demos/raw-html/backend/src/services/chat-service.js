import { ChatUtil } from "../utils/chatUtil.js"
const chatUtil = new ChatUtil()
const openai = chatUtil.getOpenai()

export class ChatService {
  async jsprompt(message, context) {
    console.log(' * ')
    console.log('***')
    console.log('---')
    console.log('USING HTML CONTEXT:')
    console.log(context)
    console.log('---')
    console.log('***')
    console.log(' * ')

    const parsedContext = await JSON.parse(context)
    if (parsedContext?.pageMetadata === "stop") {
      return {
        commands: [],
        extra: "extraInfo"
      }
    }

    try {
      const harmful = await chatUtil.evaluateHarm(message);
      if (harmful || !chatUtil.validateInput(message)) {
        return {
          error: true,
          content: "Check your question, it should be 5-100 characters long and not contain any special characters."
        }
      }

      const systemContent = `
      Your task involves generating JavaScript commands that interact with a user's web page based on their requests. These commands should be structured to run in a user's browser, facilitating operations like website navigation and form filling, without requiring direct mouse or keyboard input from the user. The commands should be in a format that can be directly parsed into a JavaScript object using JSON.parse().

      First, let's consider the HTML provided by the user: ${context}

      The JavaScript commands should exclusively interact with HTML elements using 'data-ui-automation-element' attributes as identifiers. These identifiers help the JavaScript commands locate the appropriate elements to interact with. It is important that these identifiers in the commands exactly match those present in the provided HTML code.

      For instance, if the user asks to "search for jackets", two commands will be necessary: one to populate the search field, and another to simulate clicking the search button. The JSON string representing these commands would look as follows:

      [
      {
        "fillSearch": "document.querySelector('[data-ui-automation-element="search-field"]').value = 'jacket'"
      },
      {
        "clickSearch": "document.querySelector('[data-ui-automation-element="search-button"]').click()"
      }
      ]

      For any other user request not involving a search, a single command is sufficient. Even in these cases, this command should be enclosed in an array for consistency. For example:

      [
      {
        "clickCartButton": "document.querySelector('[data-ui-automation-element="cart-button"]').click()"
      }
      ]

      Please ensure that all strings within the JavaScript code use single quotes, and that JSON strings use double quotes. The JavaScript code should not include semicolons.

      Based on the user's HTML and their requests, please provide an array of JavaScript commands that fulfill the user's requirements.`

      
      const fetch = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        // model: "gpt-4",
        messages: [
          { role: "system", content: systemContent },
          { role: "user", content: message }
        ],
        temperature: 0.2,
        max_tokens: 500,
        top_p: 1,
      });
      
      let commandString = fetch.data.choices[0].message.content
      
      console.log(commandString)
      
      const result = {
        commands: JSON.parse(commandString),
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
