import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../supabaseClient";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
/**
 * Initialize Gemini model with flash-thinking capabilities
 * Using gemini-2.0-flash-thinking-exp for enhanced reasoning and analysis
 * This specific model is optimized for complex computational tasks and logical reasoning
 */
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp" });


export async function POST(req: NextRequest) {
  try {
    const { projectId, history } = await req.json();

    // Input validation
    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }
    if (!Array.isArray(history)) {
      return NextResponse.json(
        { error: "Message history must be an array" },
        { status: 400 }
      );
    }

    // Transform messages to Gemini API format
    // Maps user messages to 'user' role and any other role to 'assistant'
    // This ensures compatibility with Gemini's expected message structure
    const messages = history.map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "assistant",
      parts: [{ text: msg.content }],
    }));

    // Validate message content
    if (messages.some(msg => !msg.parts[0].text?.trim())) {
      return NextResponse.json(
        { error: "Message content cannot be empty" },
        { status: 400 }
      );
    }

    // Retrieve stored project data from Supabase
    const { data: projects, error: supabaseError } = await supabase
      .from("projects")
      .select("static_data, dynamic_assumptions")
      .eq("id", projectId)
      .single();
    
    if (supabaseError) {
      console.error("Supabase error:", supabaseError);
      return NextResponse.json(
        { error: "Failed to fetch project data" },
        { status: 500 }
      );
    }

    // Prepare context and messages for Gemini API
    // Combines project data with conversation history for contextual understanding
    const contextMessage = {
      role: "user",
      parts: [{
        text: `Project Static Data: ${projects.static_data}\nCurrent Assumptions: ${projects.dynamic_assumptions}`
      }]
    };

    const chat = model.startChat({
      history: [contextMessage, ...messages],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const result = await chat.sendMessage(messages[messages.length - 1].parts[0].text);
    const response = await result.response;
    const message = response.text();
    
    if (!message) {
      console.error("Gemini API returned empty response");
      return NextResponse.json(
        { error: "No response generated from the AI model" },
        { status: 500 }
      );
    }

    // Validate response length
    if (message.length < 2) {
      console.warn("Unusually short response from Gemini API");
      return NextResponse.json(
        { error: "Generated response is too short or incomplete" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message });
  } catch (error: any) {
    console.error("Error in chat API:", error);
    
    // Determine appropriate status code based on error type
    let statusCode = 500;
    let errorMessage = "An error occurred while processing your request";
    
    if (error.message?.includes("API key")) {
      statusCode = 401;
      errorMessage = "Authentication error with AI service";
    } else if (error.message?.includes("rate limit")) {
      statusCode = 429;
      errorMessage = "Rate limit exceeded. Please try again later";
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.message 
      },
      { status: statusCode }
    );
  }
}
