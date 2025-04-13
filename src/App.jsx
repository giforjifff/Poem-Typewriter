import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import './App.css';

// --- Configuration ---
const AUTHOR_NAME = "Rabindranath Tagore's"; // Replace with the actual author's name
const TYPEWRITER_DELAY_MS = 150; // Milliseconds between each letter appearing (adjust as needed)

function App() {
  // --- State Variables ---
  const [poems, setPoems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPoem, setSelectedPoem] = useState(null);
  const [displayedText, setDisplayedText] = useState('');
  const [textDelay, setTextDelay] = useState(350);
  const [charIndex, setCharIndex] = useState(0);

  const test = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. \n Not to be";

  // --- Refs ---
  
  // Use a ref to hold the interval ID so the cleanup function can access it.
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchPoems = async () => {
      console.log("Effect (async): Fetching poem data...");
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('\poems_complete_data.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        console.log("Effect (async): Data fetched successfully");
        if (data && Array.isArray(data) && data.length > 0) {
          setPoems(data);
          const randomIndex = Math.floor(Math.random() * data.length);
          console.log("Effect (async): Selecting initial poem index:", randomIndex);
          setSelectedPoem(data[randomIndex]);
          // Resetting displayedText happens in Effect 2 now
        } else {
          console.error("Effect (async): Fetched data is empty or invalid format");
          setPoems([]);
          setError("No poems found or data format is incorrect.");
          setSelectedPoem(null);
        }
      } catch (fetchError) {
        console.error("Effect (async): Error fetching poems:", fetchError);
        setError(`Failed to load poems. ${fetchError.message}`);
        setPoems([]);
        setSelectedPoem(null);
      } finally {
        console.log("Effect (async): Setting loading to false.");
        setIsLoading(false);
      }
    };
    fetchPoems();
  }, []);

  // Effect 2: Handle the typewriter effect when selectedPoem changes
  useEffect(() => {
    
    setDisplayedText('');
    setCharIndex(0);
    
    if (intervalRef.current) {
      console.log("Typewriter Effect Cleanup: Clearing previous interval", intervalRef.current);
      clearInterval(intervalRef.current);
      intervalRef.current = null; // Reset the ref
    }
    if (selectedPoem && selectedPoem.poem) {
      console.log("Typewriter Effect: Setting up timer for:", selectedPoem.name);
      let currentIndex = 0;
      console.log("Typewriter Effect: Current index:", currentIndex);
      
      const poemText = selectedPoem.poem; // Get the full text once

      intervalRef.current = setInterval(() => {
        if (currentIndex < poemText.length) {
          let newText = poemText[currentIndex];
          // console.log('newtext',poemText[currentIndex]);
          
          setDisplayedText(prev => prev + newText);
          setCharIndex(currentIndex);
          currentIndex++; // Move to the next character index
        } else {
          // Typing finished, clear the interval
          console.log("Typewriter Effect: Typing complete for:", selectedPoem.name, ". Clearing interval", intervalRef.current);
          clearInterval(intervalRef.current);
          intervalRef.current = null; // Reset the ref
        }
      }, 550-textDelay);

      console.log("Typewriter Effect: Interval started with ID:", intervalRef.current);

    } else {
      console.log("Typewriter Effect: No selected poem or poem text.");
    }

    // --- Return the cleanup function ---
    // This cleanup function handles the case where the component unmounts
    // OR when selectedPoem changes *before* the interval finishes naturally.
    return () => {
      if (intervalRef.current) {
        console.log("Typewriter Effect Return Cleanup: Clearing interval", intervalRef.current, "for poem:", selectedPoem?.name);
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      } else {
        // console.log("Typewriter Effect Return Cleanup: No interval to clear for poem:", selectedPoem?.name);
      }
    };
  }, [selectedPoem])

  useEffect(() => {
    if (intervalRef.current) {
      console.log("Typewriter Effect Cleanup: Clearing previous interval", intervalRef.current);
      clearInterval(intervalRef.current);
      intervalRef.current = null; // Reset the ref
    }
    if (selectedPoem && selectedPoem.poem) {
      console.log("Typewriter Effect: Setting up timer for:", selectedPoem.name);
      let currentIndex = charIndex + 1;
      console.log("Typewriter Effect: Current index:", currentIndex);
      
      const poemText = selectedPoem.poem; // Get the full text once

      intervalRef.current = setInterval(() => {
        if (currentIndex < poemText.length) {
          let newText = poemText[currentIndex];
          // console.log('newtext',poemText[currentIndex]);
          
          setDisplayedText(prev => prev + newText);
          setCharIndex(currentIndex);
          currentIndex++; // Move to the next character index
        } else {
          // Typing finished, clear the interval
          console.log("Typewriter Effect: Typing complete for:", selectedPoem.name, ". Clearing interval", intervalRef.current);
          clearInterval(intervalRef.current);
          intervalRef.current = null; // Reset the ref
        }
      }, 550-textDelay);

      console.log("Typewriter Effect: Interval started with ID:", intervalRef.current);

    } else {
      console.log("Typewriter Effect: No selected poem or poem text.");
    }

    // --- Return the cleanup function ---
    // This cleanup function handles the case where the component unmounts
    // OR when selectedPoem changes *before* the interval finishes naturally.
    return () => {
      if (intervalRef.current) {
        console.log("Typewriter Effect Return Cleanup: Clearing interval", intervalRef.current, "for poem:", selectedPoem?.name);
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      } else {
        // console.log("Typewriter Effect Return Cleanup: No interval to clear for poem:", selectedPoem?.name);
      }
    };

  }, [textDelay]); 


  // --- Event Handlers ---
  const handleSlider = (value) => {
    setTextDelay(value);
    if (intervalRef.current) {
      console.log("Handler: Clearing interval due to slider change", intervalRef.current);
      clearInterval(intervalRef.current);
      intervalRef.current = null; // Reset the ref
    }
  }

  const handleNewPoemClick = () => {
    console.log("Handler: 'Show Another Poem' clicked.");
    if (poems.length > 0) {
      let newIndex;
      if (poems.length > 1 && selectedPoem) {
        const currentIndex = poems.findIndex(p => p.link === selectedPoem.link);
        do {
          newIndex = Math.floor(Math.random() * poems.length);
        } while (newIndex === currentIndex);
      } else {
        newIndex = Math.floor(Math.random() * poems.length);
      }
      console.log("Handler: Selecting new poem index:", newIndex);
      setSelectedPoem(poems[newIndex]);
      // The useEffect hook watching `selectedPoem` will handle resetting text
      // and starting the new typewriter effect, including cleaning up the old one.
    } else {
      console.log("Handler: Cannot select new poem, poems array is empty.");
    }
  };

  // --- Render Logic ---
  return (
    <div className="App">
      <header className="App-header">
        <h1>Random {AUTHOR_NAME} Poem</h1>
      </header>
      <main>
        {isLoading && <p>Loading poems...</p>}
        {error && <p className="error-message">Error: {error}</p>}
        {!isLoading && !error && poems.length === 0 && <p>No poems were found.</p>}

        {!isLoading && !error && selectedPoem && (
          <div className="poem-display">
            <h2>{selectedPoem.name}</h2>
            {/* <p style={{ whiteSpace: "pre-wrap" }}>
              {test}
            </p> */}
            <p className="poem-text" style={{ whiteSpace: 'pre-wrap' }}>
              {displayedText}
              {/* Conditionally render cursor only while typing? */}
              {intervalRef.current && <span className="cursor">|</span>}
              {/* Or always show cursor: */}
              {/* <span className="cursor">|</span> */}
            </p>
          </div>
        )}

      <input type="range"
        min={50}
        max={500} 
        value={textDelay}
        onChange={(e) => handleSlider(e.target.value)}
        step={50}
        />
        <p>Pace of Text</p>

        <button
          onClick={handleNewPoemClick}
          disabled={isLoading || poems.length === 0}
        >
          Show Another Poem
        </button>
        
      </main>
      <footer>
        <p>Tasty-Reflection-333 {':)'} </p>
      </footer>
    </div>
  );
}

export default App;