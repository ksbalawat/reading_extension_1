


import React, { useState } from 'react';
import './_app'; // Ensure this path is correct

function App() {
  const [selectedText, setSelectedText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(''); // Add error state

  // Function to handle text selection
  const handleTextSelect = () => {
    const selected = window.getSelection().toString().trim(); // Get selected text and trim whitespace
    if (selected) {
      setSelectedText(selected); // Store the selected text in state
      setError(''); // Clear any existing error
    }
  };

  // Function to get context from the backend
  const handleGetContext = async () => {
    if (!selectedText) {
      alert("Please select some text first.");
      return;
    }

    setLoading(true); // Start loading
    setError(''); // Clear any previous error

    try {
      // Make POST request to the backend
      const response = await fetch('http://localhost:5000/api/context', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.explanation) {
        setResult(data.explanation); // Use 'explanation' from the response
      } else {
        setError('No explanation received from the backend.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error communicating with the backend.'); // Display error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="App">
      <h1>AI Web Extension</h1>

      {/* Paragraph with selectable text */}
      <p onMouseUp={handleTextSelect}>
        Select any text from this paragraph, then click the button to get its context.
      </p>
      <p onMouseUp={handleTextSelect}>
        Artificial Intelligence is revolutionizing many industries, from healthcare to finance, by providing new ways to analyze data and automate tasks.
      </p>

      {/* Display selected text */}
      {selectedText && (
        <div>
          <p>
            <strong>Selected Text:</strong> {selectedText}
          </p>
        </div>
      )}

      {/* Button to trigger backend request */}
      <button onClick={handleGetContext} disabled={loading}>
        {loading ? 'Loading...' : 'Get AI Context'}
      </button>

      {/* Display AI response or error */}
      {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
      {result && <p><strong>AI Response:</strong> {result}</p>}
    </div>
  );
}

export default App;
