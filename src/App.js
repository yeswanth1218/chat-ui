import React, { useState } from "react";
import "./App.css";
import headerImage from "./assets/header-image1.png";

function App() {
  const [userInput, setUserInput] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!userInput) {
      alert("Please enter your question.");
      return;
    }

    setLoading(true);
    setResponseText("");

    try {
      const response = await fetch("http://13.234.216.255:8000/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: userInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error: ${response.statusText}`);
      }

      const data = await response.json();
      const formattedResponse = `
        <strong>Question:</strong>${userInput}<br/>
        <strong>Response:</strong> ${data.response.replace(/\*\*/g, "")}
      `;

      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < formattedResponse.length) {
          setResponseText((prev) => prev + formattedResponse[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 0.1);
      setUserInput("");
    } catch (error) {
      setResponseText("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={headerImage} alt="Header" className="header-image" />
      </header>
      <main>
        <div className="chat-window">
          <div className="textarea-container">
            <textarea
              placeholder="Message ConnectingDots..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            ></textarea>
            <button
              className="send-button"
              onClick={handleSend}
              disabled={loading}
              aria-label="Send"
            >
              <i className="fas fa-arrow-up"></i>
            </button>
          </div>
        </div>
        <div className="response-window">
          <h3>Your Response will be Generated below</h3>
          <p>
            <span dangerouslySetInnerHTML={{ __html: responseText }}></span>
            {loading && <span className="cursor"></span>}
          </p>
        </div>
      </main>
      <footer className="App-footer">
        ConnectingDots can make mistakes. Please verify critical information.
      </footer>
    </div>
  );
}

export default App;
