/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// OpenAI API endpoint
const API_ENDPOINT = "https://api.openai.com/v1/chat/completions";

// System prompt to restrict responses to L'Oréal products and routines
const SYSTEM_PROMPT =

`You are an assistant for L'Oréal, a beauty and personal care company. Your role is to answer questions about L'Oréal products, routines, and recommendations.

You only answer questions about L'Oréal products, routines, and recommendations. Do not answer unrelated questions to L'Oréal. If someone does, then politely decline and change the topic to L'Oréal products, routines, and recommendations.`

;

// Set initial message
chatWindow.innerHTML =
  '<div class="msg ai"> 👋 Hello! I am a LOréal assistant. How may I help you today? </div>';

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get the user's message from the input field
  const userMessage = userInput.value.trim();

  // Clear the input field after getting the message
  userInput.value = "";

  // Display user message in chat window
  chatWindow.innerHTML += `<div class="msg user">${userMessage}</div>`;

  // Show loading message while waiting for response
  const loadingMsg = document.createElement("div");
  loadingMsg.className = "msg ai";
  loadingMsg.textContent = "Thinking Please wait...";
  chatWindow.appendChild(loadingMsg);

  // Scroll to bottom of chat window
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    // Send the user message to OpenAI API with the system prompt
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
      }),
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Parse the response from OpenAI
    const data = await response.json();

    // Extract the assistant's response message
    const assistantMessage = data.choices[0].message.content;

    // Remove the loading message and display the actual response
    loadingMsg.textContent = assistantMessage;
  } catch (error) {
    // Handle any errors that occur during the API request
    console.error("Error:", error);
    loadingMsg.textContent =
      "Sorry, I encountered an error. Please make sure your API key is set up correctly and try again.";
  }

  // Scroll to bottom of chat window
  chatWindow.scrollTop = chatWindow.scrollHeight;
});
