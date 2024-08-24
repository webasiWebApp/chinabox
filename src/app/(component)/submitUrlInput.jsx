'use client';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SubmitUrlInput() {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(false); // State to manage loading state

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Start loader

    // Simulate form submission process (e.g., making an API call)
    setTimeout(() => {
      if (isValid) {
        toast.success('Valid URL submitted: ' + url);
      } else {
        toast.error('URL is not valid');
      }
      setLoading(false); // Stop loader
    }, 1000); // Simulate a delay of 1 second
  };

  const handleUrlChange = (e) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    validateUrl(inputUrl);
  };

  const validateUrl = (inputUrl) => {
    if (inputUrl.trim() === '') {
      setIsValid(false);
      return;
    }

    try {
      new URL(inputUrl);
      setIsValid(true);
    } catch (_) {
      setIsValid(false);
    }
  };

  return (
    <div className="w-full flex justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full flex justify-center gap-4 submit-url-form">
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          placeholder="Submit URL"
          className={`w-70 p-2 border-2 rounded focus:outline-none ${
            isValid ? 'border-[#ef8121]' : 'border-red-500'
          } text-[#1c486f]`}
        />
        <button
          type="submit"
          disabled={!isValid || loading} // Disable button if not valid or loading
          className="w-20 p-2 bg-[#ef8121] text-white rounded hover:bg-[#d9751a] focus:outline-none"
        >
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
