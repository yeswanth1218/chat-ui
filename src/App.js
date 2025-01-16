import React, { useState } from "react";
import "./App.css";
import headerImage from "./assets/header-image.png"; // Importing the header image

function App() {
  const [userInput, setUserInput] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false); // For loading state

  const handleSend = async () => {
    if (!userInput) {
      alert("Please enter your question.");
      return;
    }

    setLoading(true); // Show loading state

    try {
      const response = await fetch("http://13.234.216.255:8000/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: userInput }),
      });

      console.log("Response Status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Details:", errorData);
        throw new Error(errorData.detail || `HTTP error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Response Data:", data);

      setResponseText(data.response);
    } catch (error) {
      console.error("Error sending request:", error.message);
      setResponseText("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={headerImage} alt="Header" className="header-image" /> {/* Header Image */}
        <h1>Connecting Dots - LLM Chat</h1>
      </header>
      <main>
        <div className="chat-window">
          <textarea
            placeholder="Type your question here..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          ></textarea>
          <button onClick={handleSend} disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
        <div className="response-window">
          <h3>Response:</h3>
          <p>{responseText}</p>
        </div>
      </main>
    </div>
  );
}

export default App;

