import { Util } from '../utils/util.js'
import { ChatService } from '../services/chat-service.js'
const chatService = new ChatService()

export class ChatController {
  async jsprompt(req, res, next) {
    try {
      const { jsprompt, context } = req.body;
      const answer = await chatService.jsprompt(jsprompt, context);
      console.log(context)
      console.log(JSON.parse(context))
      // const answer = {
      //   actions: [
      //     {
      //       consoleLog: `console.log("Hello world")`
      //     },
      //   ],
      //   extra: 'extraInfo'
      // }
      console.log(typeof jsprompt)
      console.log(answer)
      res.status(200).send((JSON.stringify(answer)))
    } catch (error) {
      console.log('eex')
      console.log(error)
      next(Util.handleError(error, 404));
    }
  }
}
