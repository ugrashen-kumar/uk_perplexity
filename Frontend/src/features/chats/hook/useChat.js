import { useDispatch } from "react-redux";
import { initializeSocketConnection } from "../services/chat.socket";
import {
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
  createNewChat,
  addNewMessage,
  addMessages,
  removeChat,
} from "../chat.slice";
import {
  sendMessage,
  getMessages,
  getChats,
  deleteChat,
} from "../services/chat.api";

export const useChat = () => {
  const dispatch = useDispatch();

  //   const handelSendMessage = async ({ message, chatId }) => {
  //     dispatch(setLoading(true));
  //     const data = await sendMessage({ message, chatId });
  //     const { chat, aiMessage } = data;

  //     if (!chatId)
  //       dispatch(
  //         createNewChat({
  //           chatId: chat._id,
  //           title: chat.title,
  //         }),
  //       );
  //     dispatch(
  //       addNewMessage({
  //         chatId: chatId || chat._id,
  //         content: message,
  //         role: "user",
  //       }),
  //     );
  //     dispatch(
  //       addNewMessage({
  //         chatId: chatId || chat._id,
  //         content: aiMessage.content,
  //         role: aiMessage.role,
  //       }),
  //     );
  //     dispatch(setCurrentChatId(chat._id));
  //   };

  // async function handleGetChats() {
  //     dispatch(setLoading(true))
  //     const data = await getChats()
  //     const { chats } = data
  //     dispatch(setChats(chats.reduce((acc, chat) => {
  //         acc[ chat._id ] = {
  //             id: chat._id,
  //             title: chat.title,
  //             messages: [],
  //             lastUpdated: chat.updatedAt,
  //         }
  //         return acc
  //     }, {})))
  //     dispatch(setLoading(false))
  // }

  //     async function handleGetChats() {
  //     dispatch(setLoading(true));

  //     const data = await getChats();
  //     const { chats } = data;

  //     dispatch(
  //         setChats({
  //             [chats._id]: {
  //                 id: chats._id,
  //                 title: chats.title,
  //                 messages: [],
  //                 lastUpdated: chats.updatedAt,
  //             },
  //         })
  //     );

  //     dispatch(setLoading(false));
  // }

  const handelSendMessage = async ({ message, chatId }) => {
    dispatch(setLoading(true));

    const data = await sendMessage({ message, chatId });
    // console.log(data);

    const { chat, aiMessage } = data;

    const activeChatId = chatId || chat?._id;

    if (!activeChatId) {
      console.error("No chat id found", data);
      return;
    }

    if (!chatId && chat) {
      dispatch(
        createNewChat({
          chatId: chat._id,
          title: chat.title,
        }),
      );
    }

    dispatch(
      addNewMessage({
        chatId: activeChatId,
        content: message,
        role: "user",
      }),
    );

    dispatch(
      addNewMessage({
        chatId: activeChatId,
        content: aiMessage.content,
        role: aiMessage.role,
      }),
    );

    dispatch(setCurrentChatId(activeChatId));
  };

  async function handleGetChats() {
    dispatch(setLoading(true));

    const data = await getChats();
    const chatsData = Array.isArray(data.chats) ? data.chats : [data.chats];

    dispatch(
      setChats(
        chatsData.reduce((acc, chat) => {
          acc[chat._id] = {
            id: chat._id,
            title: chat.title,
            messages: [],
            lastUpdated: chat.updatedAt,
          };
          return acc;
        }, {}),
      ),
    );

    dispatch(setLoading(false));
  }

  async function handleOpenChat(chatId, chats) {
    // console.log(chats[chatId]?.messages.length);

    if (chats[chatId]?.messages.length === 0) {
      const data = await getMessages(chatId);
      const { messages } = data;

      const formattedMessages = messages.map((msg) => ({
        content: msg.content,
        role: msg.role,
      }));

      dispatch(
        addMessages({
          chatId,
          messages: formattedMessages,
        }),
      );
    }
    dispatch(setCurrentChatId(chatId));
  }

  //   async function handelDeleteChat(chatId) {
  //   try {
  //     console.log("chat id from handelDeleteChat", chatId);

  //     await deleteChat(chatId);

  //     dispatch(removeChat(chatId));

  //     if (currentChatId === chatId) {
  //       dispatch(setCurrentChatId(null));
  //     }

  //     toast.success("Chat deleted successfully");
  //   } catch (error) {
  //     console.error("Delete chat error:", error);
  //     toast.error("Failed to delete chat");
  //   }
  // }

  async function handelDeleteChat(chatId) {
    try {
      await deleteChat(chatId);

      dispatch(removeChat(chatId));
    } catch (error) {
      console.error("Delete chat error:", error);
    }
  }

  return {
    initializeSocketConnection,
    handelSendMessage,
    handleGetChats,
    handleOpenChat,
    handelDeleteChat,
  };
};
