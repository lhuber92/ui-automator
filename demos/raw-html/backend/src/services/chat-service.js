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

    try {
      const harmful = await chatUtil.evaluateHarm(message);
      if (harmful || !chatUtil.validateInput(message)) {
        return {
          error: true,
          content: "Check your question, it should be 5-100 characters long and not contain any special characters."
        }
      }

      const systemContent = `
      Your task involves generating JavaScript actions that interact with a user's web page based on their requests. These actions should be structured to run in a user's browser, facilitating operations like website navigation and form filling, without requiring direct mouse or keyboard input from the user. The actions should be in a format that can be directly parsed into a JavaScript object using JSON.parse().

      Here is the metadata about the page that the command was sent from, place a lot of weight on the content of the metadata when evaluating what JavaScript actions to generate, if any at all. For example, if the metadata says something like "You are now on a product page. If you are here, then do not create any more actions" then you should not generate any actions and instead return an empty array.

      Metadata: ${parsedContext.pageMetadata}

      Now, let's consider the HTML elements provided by the user as an array that contains the element type, info for the element, and the id that will be used for selecting the element: ${JSON.stringify(parsedContext.elementObjects)}

      Elements with the type 'content' are only providing info about an element, it can not be used to perform any actions.

      The JavaScript actions should exclusively interact with HTML elements using the values in the 'data-ai-id' attributes as identifiers. These identifiers help the JavaScript actions locate the appropriate elements to interact with. It is important that these identifiers in the actions exactly match those present in the provided HTML code.

For example, to select the following element you would do a document.querySelector('[data-ai-id="S5Eba7"]'):

{
  'data-ai-type': 'link',
  'data-ai-info': 'This link will send the user to the start-page.',
  'data-ai-id': 'S5Eba7'
},

      For instance, if the user asks to "search for jackets", two actions will be necessary: one to populate the search field (that in this example has a data-ai-id of "123"), and another to simulate clicking the search button (that in this example has a data-ai-id of "456"). The JSON string representing these actions would look as follows:

      [
      {
        "fillSearch": "document.querySelector('[data-ai-id="123"]').value = 'jacket'"
      },
      {
        "clickSearch": "document.querySelector('[data-ai-id="456"]').click()"
      }
      ]

      For any other user request not involving a search, a single command is sufficient. Even in these cases, this command should be enclosed in an array for consistency. For example, clicking on a button that will open the shopping cart will look like the below if the button has a data-ai-id of "789":

      [
      {
        "clickCartButton": "document.querySelector('[data-ai-id="789"]').click()"
      }
      ]

      Please ensure that all strings within the JavaScript code use single quotes, and that JSON strings use double quotes. The JavaScript code should not include semicolons.

      Based on the user's HTML and their requests, please provide an array of JavaScript actions that fulfill the user's requirements.
      
      If the metadata provided says "You are now on a product page. If you are here, then do not create any more actions" or something similar, do not generate any actions and instead return an empty array. For example:

      Metadata: You are now on a product page. If you are here, then do not create any more actions
      
      The correct response in this case would be:
      
      []
      
      
      `

      console.log('*****')
      console.log(systemContent)
      console.log(systemContent)
      console.log('*****')

      
      const fetch = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        // model: "gpt-4",
        messages: [
          { role: "system", content: systemContent },
          { role: "user", content: message }
        ],
        temperature: 0.8,
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
