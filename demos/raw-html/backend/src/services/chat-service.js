import { ChatUtil } from "../utils/chatUtil.js"
const chatUtil = new ChatUtil()
const openai = chatUtil.getOpenai()

export class ChatService {
  async jsprompt(message, htmlCode) {
    console.log(' * ')
    console.log('***')
    console.log('---')
    console.log('USING HTML CONTEXT:')
    console.log(htmlCode)
    console.log('---')
    console.log('***')
    console.log(' * ')

    try {
      const harmful = await chatUtil.evaluateHarm(message);
      if (harmful || !chatUtil.validateInput(message)) {
        return {
          error: true,
          content: "Check your question, it should be 5-100 characters long and not contain any special characters."
        }
      }

      const systemContent = `
        Your mission is to craft JavaScript commands that can interface with a user-provided HTML based on their specific requests. These commands should be designed to run in the user's browser, enabling tasks such as web page navigation and form filling without requiring direct input from the user's mouse or keyboard.

        The desired commands should be formatted as a single JSON string. This string should represent an object containing one key-value pair. The key describes the nature of the command, while the value is the actual JavaScript command itself, depicted as a string.
        
        The JavaScript command should interact with the HTML elements using the 'data-ui-automation-element' attributes. These attributes serve as the identifiers that the JavaScript command uses to find the necessary element to interact with.
        
        For instance, based on a user input of "search for jackets", the JavaScript command could be formatted like this:
        
        {
          "fillSearch": "document.querySelector('[data-ui-automation-element="search-field"]').value = 'jacket'"
        }

        Please ensure that all strings in the JavaScript code are surrounded by single quotes, while JSON strings should be wrapped in double quotes. Importantly, refrain from including any semicolons in the JavaScript code.

        Now, take into consideration the following HTML code from the user:
        
        ${htmlCode}

        In this HTML, 'data-ui-automation-element' attributes are used to mark important elements. For instance, 'data-ui-automation-element="search-button"' could be utilized to identify a key element.

        Remember that when choosing an element, priority should always be given to the 'data-ui-automation-element' attribute over other attributes, even when other identifiers are available.
        
        With this HTML and the user's input in mind, please generate a single JavaScript command in the aforementioned JSON format that caters to the user's request. This output should be a string that can be parsed directly into a JavaScript object using JSON.parse().
        
        This revised approach ensures that after executing one command, the client can make a subsequent fetch request to obtain the next command. This can cater to situations where executing one command might alter the HTML context, like navigating from one page to another.
      `
      
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
