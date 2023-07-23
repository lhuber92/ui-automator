import { Util } from '../utils/util.js'
import { ChatService } from '../services/chat-service.js'
const chatService = new ChatService()

export class ChatController {
  async jsprompt(req, res, next) {
    try {
      const { jsprompt, htmlCode } = req.body;
      console.log(jsprompt)
      const answer = await chatService.jsprompt(jsprompt, htmlCode);
      console.log(typeof answer)
      console.log(typeof answer.commands)
      console.log(answer)
      res.status(200).send((JSON.stringify(answer)))
    } catch (error) {
      console.log('eex')
      console.log(error)
      next(Util.handleError(error, 404));
    }
  }
}
