import { ChatGoogleGenerativeAI } from "@langchain/google-genai";


// gemini ke bhut saare models available hai jisme hum ye use kr rhe hain ==> gemini-2.5-flash-lite
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});

export const testAi = async() =>{
  try{
    const response = await model.invoke("What is SMTP server")
    console.log(response.content)
    return response.content
  }
  catch(error){
     console.error("Gemini Error:", error.message);
    return "AI service temporarily unavailable.";
  }
}