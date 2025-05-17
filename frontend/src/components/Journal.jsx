import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Journal() {
  const [journal, setJournal] = useState([]);
  const [newJournal, setNewJournal] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch journals on mount
   useEffect(() => {
    const fetchJournals = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/journals", { // <-- plural
          withCredentials: true,
        });
        setJournal(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch journal entries.");
        setLoading(false);
      }
    };
    fetchJournals();
  }, []);

  const addJournal = async () => {
    if (!newJournal.trim() || !content.trim()) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/journals", // <-- plural
        { title: newJournal, content },
        { withCredentials: true }
      );
      setJournal([...journal, res.data]);
      setNewJournal("");
      setContent("");
      setError("");
    } catch (err) {
      setError("Failed to add journal entry. Please try again.");
    }
  };


  return (
    <>
    <div className='max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow'>
      <h2 className='text-2xl font-bold mb-4 text-gray-900'>Journal Entry</h2>
      <input
        type="text"
        value={newJournal}
        onChange={(e) => setNewJournal(e.target.value)}
        placeholder='Title'
        className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        placeholder='Write your journal here...'
        rows={5}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className='w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
      ></textarea>
      <button
        onClick={addJournal}
        className='w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
      >
        Add Entry
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      
    </div>
    <div className=" max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">Your Journal Entries</h3>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <ul>
            {journal.map((j) => (
              <li key={j.id} className="mb-4 p-3 rounded bg-gray-100">
                <div className="font-bold text-gray-800">{j.title}</div>
                <div className="text-gray-700">{j.content}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      </>
  );
}

export default Journal;