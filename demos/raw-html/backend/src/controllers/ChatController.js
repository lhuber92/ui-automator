import { Util } from '../utils/util.js'
import { ChatService } from '../services/chat-service.js'
const chatService = new ChatService()

export class ChatController {
  async jsprompt(req, res, next) {
    try {
      const { jsprompt, context } = req.body;
      const answer = await chatService.jsprompt(jsprompt, context);
      res.status(200).send((JSON.stringify(answer)))
    } catch (error) {
      console.log(error)
      next(Util.handleError(error, 404));
    }
  }
}
