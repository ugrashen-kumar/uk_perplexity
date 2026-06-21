// import { generateChatTitle, generateResponse } from "../services/ai.service.js";
// import chatModel from "../models/chat.model.js";
// import messageModel from "../models/message.model.js";

// export const sendMessage = async (req, res) => {
//   const { message, chat : chatId } = req.body;

//   let title = null,
//     chat = null;

//   if (!chatId) {
//     console.log("chat id nhi milne pr chla hai")
//     title = await generateChatTitle(message);
//     chat = await chatModel.create({
//       user: req.user.id,
//       title,
//     });
//   }

//   const userMessage = await messageModel.create({
//     chat: chatId || chat._id,
//     content: message,
//     role: "user",
//   });

//   const messages = await messageModel.find({ chat: chatId });

//   const result = await generateResponse(messages);

//   const aiMessage = await messageModel.create({
//     chat: chatId || chat._id,
//     content: result,
//     role: "ai",
//   });

//   res.status(201).json({
//     title,
//     chat,
//     aiMessage,
//   });
// };


import { generateChatTitle, generateResponse } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  const { message, chat: chatId } = req.body;

  let title = null;
  let chat = null;

  if (!chatId) {
    console.log("chat id nhi milne pr chla hai");

    title = await generateChatTitle(message);

    chat = await chatModel.create({
      user: req.user.id,
      title,
    });
  }

  const currentChatId = chatId || chat._id;

  await messageModel.create({
    chat: currentChatId,
    content: message,
    role: "user",
  });

  const messages = await messageModel
    .find({ chat: currentChatId })
    .sort({ createdAt: 1 });

  console.log("Messages from DB:", messages);

  const result = await generateResponse(messages);

  const aiMessage = await messageModel.create({
    chat: currentChatId,
    content: result,
    role: "ai",
  });

  res.status(201).json({
    title,
    chat,
    aiMessage,
  });
};

export const getChats = async(req, res) =>{
  const user = req.user
  const chats = await chatModel.find({id : user._id})

  res.status(200).json({
    message : "chats Received successfully",
    chats
  })
}

export const getMessages = async(req, res) =>{
  const {chatId} = req.params

  const chat = await chatModel.findOne({
    _id : chatId,
    user : req.user.id
  })

  if(!chat){
    return res.status(404).json({
      message : "Chat not Found"
    })
  }

  const messages = await messageModel.find({chat : chatId})

  res.status(200).json({
    message : "Messages Received successfully",
    messages
  })

}

export const deleteChat = async(req, res) =>{
  const {chatId} = req.params;

  const chat = await chatModel.findByIdAndDelete({
    _id : chatId,
    user : req.user.id
  })

  await messageModel.deleteMany({chat : chatId})

  if(!chat){
    return res.status(404).json({
      message : "Chat Not Found"
    })
  }

  res.status(200).json({
    message : "Chat Delete successfully"
  })
}