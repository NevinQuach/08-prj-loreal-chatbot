/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Cloudflare Worker endpoint (this is safe to keep public)
const WORKER_URL = "https://muddy-limit-7eee.787688nev0908.workers.dev/";

// System prompt to restrict responses to L'Oréal products and routines
const SYSTEM_PROMPT =

`You are an assistant for L'Oréal, a beauty and personal care company. Your role is to answer questions about L'Oréal products, routines, and recommendations.

You only answer questions about L'Oréal products, routines, and recommendations. Do not answer unrelated questions to L'Oréal. If someone does, then politely decline and change the topic to L'Oréal products, routines, and recommendations.`;

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
    // Send the user message to the Cloudflare Worker
    // The worker calls OpenAI using a hidden server-side API key.
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
      }),
    });

    // Check if the request was successful
    // Parse the response from OpenAI
    const data = await response.json();

    // If the worker/OpenAI request fails, show the error message
    if (!response.ok) {
      const errorMessage =
        data?.error?.message || `API error: ${response.status}`;
      throw new Error(errorMessage);
    }

    // Extract the assistant's response message
    const assistantMessage = data.choices[0].message.content;

    // Remove the loading message and display the actual response
    loadingMsg.textContent = assistantMessage;
  } catch (error) {
    // Handle any errors that occur during the API request
    console.error("Error:", error);
    loadingMsg.textContent =
      "Sorry, I encountered an error. Please check your Cloudflare Worker setup and try again.";
  }

  // Scroll to bottom of chat window
  chatWindow.scrollTop = chatWindow.scrollHeight;
});
