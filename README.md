# Project 8: L'Oréal Chatbot

L’Oréal is exploring the power of AI, and your job is to showcase what's possible. Your task is to build a chatbot that helps users discover and understand L’Oréal’s extensive range of products—makeup, skincare, haircare, and fragrances—as well as provide personalized routines and recommendations.

## 🚀 Launch via GitHub Codespaces

1. In the GitHub repo, click the **Code** button and select **Open with Codespaces → New codespace**.
2. Once your codespace is ready, open the `index.html` file via the live preview.

## ☁️ Cloudflare Note

This project is set up so the browser sends chat requests to a Cloudflare Worker, and the Worker sends them to OpenAI.

1. In Cloudflare Workers, create a Worker and paste the code from `RESOURCE_cloudflare-worker.js`.
2. Add your API key as a Worker secret named `OPENAI_API_KEY`.
3. Deploy the Worker and copy its URL.
4. In `script.js`, set `WORKER_URL` to your deployed Worker URL.

Important:

- Do not put your OpenAI key in `script.js`, `index.html`, or `secrets.js`.
- The frontend request body should include `messages`, and the response should be read from `data.choices[0].message.content`.

Enjoy building your L’Oréal beauty assistant! 💄
