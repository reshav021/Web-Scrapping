import React, { useState } from "react";
import axios from "axios";
import "./styles.css";

const SearchResults = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const formatContent = (content) => {
    const div = document.createElement("div");
    div.innerHTML = content;
    div.querySelectorAll("script, style").forEach((el) => el.remove());
    return div.outerHTML;
  };

  const handleSearch = async () => {
    try {
      const searchAPIKey = "AIzaSyCuEIcUOK2Vdko1Rhw6gfWhGScjn5czIJQ";
      const searchEngineID = "455acc24fe18048aa";
      const numResults = 5;

      const searchResults = await axios.get(
        `https://www.googleapis.com/customsearch/v1?q=${query}&key=${searchAPIKey}&cx=${searchEngineID}&num=${numResults}`
      );

      const urls = searchResults.data.items.map((item) => item.link);
      const scrapedTexts = await Promise.all(
        urls.map(async (url) => {
          const scrapeBeeAPIKey =
            "CEYQKDKSHC61QK9JZT6I4VPQ7SM2VSTBEYW0CW8AHI8INZJSFBT4G4XVJ8P3FGA6FJKZJODCTT8XQAVK";

          const response = await axios.get(
            `https://app.scrapingbee.com/api/v1?api_key=${scrapeBeeAPIKey}&url=${encodeURIComponent(
              url
            )}&render_js=true`
          );

          return response.data;
        })
      );

      setResults(scrapedTexts);
    } catch (error) {
      console.error("Error fetching data:", error);
      console.error("Error fetching data from ScrapingBee:", error.message);
      console.error("ScrapingBee Response Data:", error.response?.data);
    }
  };

  return (
    <div>
      <div className="gcse-search"></div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        className="search-input" // Apply the "search-input" class
      />
      <button onClick={handleSearch} className="search-button">
        Search
      </button>{" "}
      {/* Apply the "search-button" class */}
      {results.map((text, index) => (
        <div
          key={index}
          className="scraped-content" // Apply the "scraped-content" class
          dangerouslySetInnerHTML={{ __html: formatContent(text) }}
        />
      ))}
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <h1>Web Scraping App</h1>
      <SearchResults />
    </div>
  );
};

export default App;
