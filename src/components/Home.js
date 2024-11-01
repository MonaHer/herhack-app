// Home.js
import React from "react";
import { Typography } from "@mui/material";
import data from "../../src/api-response.json";
import axios from "axios";
import { useState } from "react";

function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo", // Das kostenlose Modell
          messages: updatedMessages,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      const botMessage = {
        role: "assistant",
        content: response.data.choices[0].message.content,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Fehler beim Abrufen der Antwort:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, ein Fehler ist aufgetreten.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  const articles = data?.data?.articles?.edges || [];

  const getArticleById = (id) => {
    const article = articles.find((item) => item.id === id);
    if (article) {
      return { text: article.content.text, imageUrl: article.url.url };
    }
    return { text: "Artikel nicht gefunden", imageUrl: "" };
  };

  // Beispiel: Abrufen des Artikels mit einer bestimmten ID
  const { text: textForId1, imageUrl: imageForId1 } = getArticleById(
    "urn:pdp:cms_srf:article:urn:srf:article:414409458"
  );

  console.log(textForId1);

  return (
    <>
      <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
        <h1>Einträge aus der JSON-Datei</h1>
        {articles.map((article) => (
          <div
            key={article.id}
            style={{
              marginBottom: "20px",
              border: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <Typography variant="h6">{article.id}</Typography>
          </div>
        ))}
      </div>
      <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
        <h1>Text für Artikel mit ID "1"</h1>
        <Typography variant="body1">{textForId1}</Typography>
        {imageForId1 && (
          <img
            src={imageForId1}
            alt="Artikelbild"
            style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }}
          />
        )}
      </div>
      <button>True</button>
      <button>Fake</button>
      <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
        <h1>Chat mit GPT-3.5</h1>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            height: "300px",
            overflowY: "auto",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.role === "user" ? "right" : "left",
                margin: "10px 0",
              }}
            >
              <strong>{msg.role === "user" ? "Du" : "Chippy"}:</strong>{" "}
              {msg.content}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Schreibe eine Nachricht..."
          style={{ width: "100%", padding: "10px" }}
        />
        <button
          onClick={sendMessage}
          style={{ marginTop: "10px", width: "100%" }}
        >
          Senden
        </button>
      </div>
    </>
  );
}

export default Home;
