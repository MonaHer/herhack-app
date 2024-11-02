import data from "../api-response.json";
import axios from "axios";
import { useState } from "react";

export default function FakeBustersGame() {
  const articles = data?.data?.articles?.edges || []; // Extracting articles from JSON data
  const [randomContent, setRandomContent] = useState({}); // State to hold randomly selected content
  const [botResponse, setBotResponse] = useState(""); // State to hold response from the bot
  const [isGenerated, setIsGenerated] = useState(false); // State to track if content is generated (fake news)
  const [resultMessage, setResultMessage] = useState(""); // State to store result message (true or fake)
  const [originalContent, setOriginalContent] = useState(""); // State to store the original content for verification

  // Function to get random content from the articles
  const getRandomContent = () => {
    // Select a random article from the list
    const randomArticle = articles[Math.floor(Math.random() * articles.length)];

    if (randomArticle) {
      const contentOptions = []; // Array to hold possible content types (text, headline, image)

      // Adding text content if available
      if (randomArticle.content?.text) {
        contentOptions.push({
          type: "text",
          content: randomArticle.content.text,
        });
      }
      // Adding headline content if available
      if (randomArticle.lead?.content) {
        contentOptions.push({
          type: "headline",
          content: randomArticle.lead.content,
        });
      }
      // Adding image content if available
      if (randomArticle.resources && randomArticle.resources[0]?.url?.url) {
        contentOptions.push({
          type: "image",
          content: randomArticle.resources[0].url.url,
        });
      }

      // Randomly select one piece of content
      const randomContent =
        contentOptions[Math.floor(Math.random() * contentOptions.length)];
      setRandomContent(randomContent); // Update state with randomly selected content
      setOriginalContent(randomContent.content); // Store the original content for later use
      setIsGenerated(false); // Mark content as original (not generated)
      setBotResponse(""); // Reset bot response when new content is selected
      setResultMessage(""); // Reset result message
    }
  };

  // Function to send content to the bot for modification
  const sendContentToBot = async () => {
    if (!randomContent.content) return; // Exit if there is no content to send

    let promptAndInput = ""; // Variable to hold the prompt for the bot
    switch (randomContent.type) {
      case "text":
        // Creating a prompt for modifying text content to 'fake news'
        promptAndInput = `Take the content from the provided article and modify it to create a 'fake news' version for our school game aimed at 11-13-year-old children. 
                            The article should still resemble the original in structure but include exaggerated or misleading information. 
                            For example, if the original article is about a school experiment, change it to say that students discovered a potion that allows them to fly after mixing common classroom supplies. 
                            This version should still sound believable to promote critical thinking among the children about the validity of the information: ${randomContent.content}`;
        break;
      case "headline":
        // Creating a prompt for modifying the headline to create three misleading but credible options
        promptAndInput = `From the original headline in the provided JSON data, create three alternate headlines that are misleading but still maintain a level of credibility for our school game aimed at 11-13-year-old children. 
                            These headlines should encourage the children to think critically about their truthfulness.
                            For example, if the original headline was 'Students Win Science Fair', the new headlines could be:
                            1. 'Local Students Claim to Have Found the Key to Instant Learning!'
                            2. 'New Study Shows 90% of Students Prefer Homework Over Playtime!'
                            3. 'Scientists Discover That Listening to Music Boosts Test Scores!'
                            Make sure to render the original headline alongside these three fake headlines to challenge the children in identifying the real one: ${randomContent.content}`;
        break;
      case "image":
        // Creating a prompt for modifying an image to make it misleading yet believable
        promptAndInput = `For our school game for 11-13-year-old children, I will provide you with an image URL. Modify the image slightly to make it appear misleading yet believable. 
                            For instance, if the image shows a campaign rally, alter it to show a crowd that appears much larger than it actually was with the caption 'Record-Breaking Attendance at Candidate's Rally!' 
                            This adjusted image should prompt children to analyze the authenticity and context of the visual content. ${randomContent.content}`;
        break;
      default:
        promptAndInput = randomContent.content; // Default case if content type is not recognized
    }

    try {
      // Sending request to OpenAI API to get the modified content
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: promptAndInput }], // Passing the prompt including the
        },
        {
          headers: {
            "Content-Type": "application/json", // Setting content type
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // Including API key for authorization
          },
        }
      );

      // Storing the bot's response
      setBotResponse(response.data.choices[0].message.content);
      setIsGenerated(true); // Mark content as generated (fake news)
      setOriginalContent(randomContent.content); // Store the original content for verification
    } catch (error) {
      // Handling any errors that occur during the request
      console.error("Error fetching response:", error);
      setBotResponse("There was a problem with the request."); // Set error message
    }
  };

  // Function to handle the result of the true or fake news buttons
  const handleResult = (isTrue) => {
    // Set message based on whether the content is true or fake
    if (isTrue) {
      setResultMessage("It's true!"); // Message for true content
    } else {
      setResultMessage("Fake news!"); // Message for fake news
    }
    console.log("Original Content:", originalContent); // Logging the original content for debugging
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>News Verification Game</h1>

      <button onClick={getRandomContent} style={{ marginBottom: "10px" }}>
        Show Random Content
      </button>

      {randomContent.type && (
        <button onClick={sendContentToBot} style={{ marginLeft: "10px" }}>
          Send Content to Chippy
        </button>
      )}

      {/* Display the randomly selected content */}
      <div style={{ marginTop: "20px" }}>
        {randomContent.type === "text" && (
          <p>{randomContent.content}</p> // Display text content
        )}
        {randomContent.type === "headline" && (
          <h5 style={{ fontWeight: "bold" }}>{randomContent.content}</h5> // Display headline content
        )}
        {randomContent.type === "image" && (
          <img
            src={randomContent.content}
            alt="Randomly selected"
            style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }}
          />
        )}
      </div>

      {/* Display the bot's response */}
      {botResponse && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <h6>Response from Chippy:</h6>
          <p>{botResponse}</p>
        </div>
      )}

      {/* Buttons for user to determine if content is true or fake */}
      {randomContent.content && (
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => handleResult(!isGenerated)}
            style={{ marginRight: "10px" }}
          >
            True
          </button>
          <button onClick={() => handleResult(isGenerated)}>Fake</button>
        </div>
      )}

      {/* Display the result message indicating whether the content is true or fake */}
      {resultMessage && <h6>{resultMessage}</h6>}
    </div>
  );
}
