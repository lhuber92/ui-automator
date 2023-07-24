import { ChatUtil } from "../utils/chatUtil.js"
const chatUtil = new ChatUtil()
const openai = chatUtil.getOpenai()

export class ChatService {
  async jsprompt(message, htmlCode) {
    try {
      const harmful = await chatUtil.evaluateHarm(message);
      if (harmful || !chatUtil.validateInput(message)) {
        return {
          error: true,
          content: "Check your question, it should be 5-100 characters long and not contain any special characters."
        }
      }

      const systemContent = `
        Your task is to generate JavaScript commands that interact with a user's HTML based on their requests. These JavaScript commands should be created in such a way that they can be executed on a user's browser, handling actions like navigating the website and filling in inputs without the need for direct user interaction with the mouse or keyboard.

        The format for these commands should be a JSON string that consists of an array of objects. Each object in the array should contain a single key-value pair, where the key is a description of the command, and the value is the actual JavaScript command represented as a string.
        
        The actual JavaScript command should be written in such a way that it interacts with the HTML elements using 'data-ui-automation-element' attributes. The value of these attributes will be used as the identifier for the JavaScript command to find the element it needs to interact with.
        
        Here's an example of how the JavaScript commands should be formatted based on a user input of "search for jackets, then click on the cart button":

        [
          {
              "fillSearch": "document.querySelector('[data-ui-automation-element="search-field"]').value = 'jacket'"
          },
          {
              "clickSearch": "document.querySelector('[data-ui-automation-element="search-button"]').click()"
          },
          {
              "clickCart": "document.querySelector('[data-ui-automation-element="cart-button"]').click()"
          }
        ]

        Please note that all strings within the JavaScript code should be wrapped in single quotes, while JSON strings should be wrapped in double quotes. Also, there should be no semicolons included in the JavaScript code.

        You are now provided with the following HTML code from the user:
        
        ${htmlCode}

        In this HTML, the important elements are identified by 'data-ui-automation-element' attributes. For example, 'data-ui-automation-element="search-button"' would be used to identify a key element.

        Please remember that when selecting an element, you should always prioritize using the 'data-ui-automation-element' attribute over other attributes, even if other identifiers are available.
        
        Now, based on this HTML and the user's input, please provide a stringified JSON array of JavaScript commands that fulfill the user's request. The output should be formatted such that it can be directly parsed into a JavaScript object with JSON.parse().
      `
      
      const fetch = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-16k",
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
