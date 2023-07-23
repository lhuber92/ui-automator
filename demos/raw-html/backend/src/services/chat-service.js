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
        Considering the user-provided HTML code, your task involves generating JavaScript commands based on the user's request. These JavaScript commands will be executed in the user's browser, facilitating navigational operations and input filling without requiring direct mouse or keyboard interactions. Please ensure the outputted code adheres to a structured JSON format, where each command forms an individual object within an array.

        Each JavaScript command should be represented as a string and placed as a value in a key-value pair. The key should be a descriptive name for the command. Each of these key-value pairs should be placed in an object, and these objects should be placed in an array. Here is an example:

        [
          {
            "command1": "document.getElementById('button1').click()"
          },
          {
            "command2": "document.getElementById('button2').click()"
          }
        ]

        Please remember to always use single quotes within the JavaScript code and double quotes for JSON. Do not include any semicolons as part of the JavaScript code.

        Now, consider the following HTML code provided by the user:
        ${htmlCode}

        In the HTML code, certain data attributes are used to identify important elements. These attributes are specifically in the format of data-ui-automation-element=<identifier>. For example, data-ui-automation-element="search-button" would be a data attribute used to label a key element.

        Moreover, when an identifier is shared between a standard element attribute (like an 'id') and a 'data-ui-automation-element' attribute, priority should always be given to the 'data-ui-automation-element' attribute. This means that even when you have multiple ways of selecting an element (like <button id=search-button>Click me</button> and <button data-ui-automation-element="search-button">Click me</Button>), you should always choose to select it using 'data-ui-automation-element="search-button"'.

        Your task is to provide the requested automation in the JSON format described above. Please ensure the returned JSON is a string that can be directly parsed to a JavaScript object using JSON.parse().
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
