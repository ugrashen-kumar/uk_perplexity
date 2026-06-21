// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { ChatMistralAI } from "@langchain/mistralai";
// import {HumanMessage, SystemMessage, AIMessage} from 'langchain'

// // gemini ke bhut saare models available hai jisme hum ye use kr rhe hain ==> gemini-2.5-flash-lite
// const geminiMmodel = new ChatGoogleGenerativeAI({
//   model: "gemini-2.5-flash-lite",
//   apiKey: process.env.GEMINI_API_KEY
// });

// const mistralaiModel = new ChatMistralAI({
//   model: "mistral-small-latest",
//   apiKey: process.env.MISTRAL_API_KEY,
// });

// // export const testAi = async() =>{
// //   try{
// //     const response = await model.invoke("What is SMTP server")
// //     console.log(response.content)
// //     return response.content
// //   }
// //   catch(error){
// //      console.error("Gemini Error:", error.message);
// //     return "AI service temporarily unavailable.";
// //   }
// // }

// export const generateResponse = async(messages) =>{
//   try{
//     const response = await geminiMmodel.invoke(messages.map((msg)=>{
//       if(msg.role == "user"){
//         return new HumanMessage(msg.content)
//       }else if (msg.role == "ai"){
//         return new AIMessage(msg.content)
//       }
//     }))
//     // console.log(response.text)
//     return response.text
//   }catch(error){
//     console.log("gemini Error", error)
//     return "AI Service is unavailable"
//   }
// }

// export const generateChatTitle = async(message) =>{
//   const response = await mistralaiModel.invoke([
//         new SystemMessage(`
//             You are a helpful assistant that generates concise and descriptive titles for chat conversations.

//             User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.
//         `),
//         new HumanMessage(`
//             Generate a title for a chat conversation based on the following first message:
//             "${message}"
//             `)
//     ])
//     return response.text;
// }

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import { tool, createAgent } from "langchain";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";

const geminiMmodel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralaiModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const searchInternetTool = tool(searchInternet, {
  name: "searchInternet",
  description: "Use this tool to get the latest information from the internet.",
  schema: z.object({
    query: z.string().describe("The search query to look up on the internet."),
  }),
});

const agent = createAgent({
  model: geminiMmodel,
  tools: [searchInternetTool],
});


export async function generateResponse(messages) {
  const response = await agent.invoke({
    messages: [
      new SystemMessage(`
        You are a helpful and precise assistant.

        If the user asks for current events, latest information,
        date, time, weather, news, stock prices, or anything
        requiring real-time information, use the searchInternet tool.

        For general knowledge questions, answer directly without
        using tools.
      `),

      ...messages.map((msg) =>
        msg.role === "user"
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content)
      ),
    ],
  });

  console.log(
    "Agent Response:",
    JSON.stringify(response, null, 2)
  );

  return response.messages.at(-1).content;
}

// ==================================================================
// export async function generateResponse(messages) {
//   const result = await searchInternetTool.invoke({
//     query: "today date",
//   });

//   // console.log(result);
//   // console.log(messages);

//   const response = await agent.invoke({
//     messages: [
//       new SystemMessage(`
//                 You are a helpful and precise assistant for answering questions.
//                 If you don't know the answer, say you don't know. 
//                 If the question requires up-to-date information, use the "searchInternet" tool to get the latest information from the internet and then answer based on the search results.
//             `),
//       ...messages.map((msg) => {
//         if (msg.role == "user") {
//           return new HumanMessage(msg.content);
//         } else if (msg.role == "ai") {
//           return new AIMessage(msg.content);
//         }
//       }),
//     ],
//   });

//   console.log("Agent Response:", JSON.stringify(response, null, 2));
//   return response.messages[response.messages.length - 1].content;
// }
// =============================================================

export const generateChatTitle = async (message) => {
  try {
    const response = await mistralaiModel.invoke([
      new SystemMessage(`
        You are a helpful assistant that generates concise and descriptive titles for chat conversations.

        User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words.
      `),

      new HumanMessage(`
        Generate a title for a chat conversation based on:
        "${message}"
      `),
    ]);

    return response.content;
  } catch (error) {
    console.error("Title Generation Error:", error);
    return "New Chat";
  }
};
