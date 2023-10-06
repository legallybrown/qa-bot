// pages/ask.js
import React, { useState } from 'react';
import '../styles/styles.css'

export default function Ask() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/getAnswer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        console.error('Error while fetching answer:', await response.text());
        setAnswer('Sorry, something went wrong while fetching your answer.');
        return;
      }

      const data = await response.json();
      setAnswer(data.answer || 'Sorry, I couldn’t understand the question.');

    } catch (error) {
      console.error('Error while fetching answer:', error);
      setAnswer('Sorry, something went wrong while fetching your answer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <label>
          <input type="text" value={question} onChange={handleQuestionChange} className="input" />
        </label>
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <button type="submit" className="button">Submit</button>
        )}
      </form>
      {answer && <p>{answer}</p>}
    </div>
  );
}
