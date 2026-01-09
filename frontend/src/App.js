import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [atsScore, setAtsScore] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a resume file.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please enter a job description.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('job_desc', jobDescription);

    try {
      const response = await axios.post('http://localhost:8000/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResumeText(response.data.extracted_text);
      setAtsScore(response.data.ats_score);
      setAiFeedback(response.data.ai_feedback);
    } catch (err) {
      setError('Error analyzing resume. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">AI Resume Analyzer</h1>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resume-upload">
            Upload Resume (PDF)
          </label>
          <input
            type="file"
            id="resume-upload"
            accept=".pdf"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="job-description">
            Job Description
          </label>
          <textarea
            id="job-description"
            rows="6"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-y"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>

        <div className="mt-8 border-t pt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Analysis Results</h2>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Extracted Resume Text</label>
            <textarea
              readOnly
              value={resumeText}
              rows="10"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-50 leading-tight focus:outline-none focus:shadow-outline resize-y"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">ATS Match Score</label>
            <input
              readOnly
              value={atsScore}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-50 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">AI Feedback</label>
            <textarea
              readOnly
              value={aiFeedback}
              rows="12"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-50 leading-tight focus:outline-none focus:shadow-outline resize-y"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
