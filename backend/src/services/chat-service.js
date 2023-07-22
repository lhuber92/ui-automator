import { ChatUtil } from "../utils/chatUtil.js"
const chatUtil = new ChatUtil()
const openai = chatUtil.getOpenai()

export class ChatService {
  async jsprompt(message) {
    try {
      const harmful = await chatUtil.evaluateHarm(message);
      if (harmful || !chatUtil.validateInput(message)) {
        return {
          error: true,
          content: "Check your question, it should be 5-100 characters long and not contain any special characters."
        }
      }

      const systemContent = `
      Given the HTML code sent by the user, your job is to write javascript selenium code given a user's request. Only output the code, and always use single quotes, except for the start and end of the javascript string returned.

      Example: Given the html code below:
      
      <!DOCTYPE html>
      <html>
        <head>
          <title>Basic HTML Page</title>
          <style>
            button {
              margin: 5px;
              padding: 10px;
              font-size: 18px;
            }
          </style>
        </head>
        <body>
          <button id="button1">Button 1</button>
          <button id="button2">Button 2</button>
        </body>
      </html>
      
      If the user asks "I want to click on button 1" you should reply with "document.getElementById('button1').click()" and nothing more. Please note that I used single-quotes for ('button1'). 
      `

      const openaiResult = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemContent },
          { role: "user", content: message }
        ],
        temperature: 0.8,
        max_tokens: 500,
        top_p: 1,
      });
      const aiAnswer = openaiResult.data.choices[0].message.content;

      return openaiResult.data.choices[0].message.content
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
