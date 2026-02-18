'use client';

import { useState } from 'react';

export default function Home() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const analyzeResume = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription }),
      });
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">AI Resume Analyzer</h1>
      <p className="text-gray-600 mb-8">
        Get instant feedback on how well your resume matches a job description
      </p>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Your Resume
          </label>
          <textarea
            className="w-full h-96 p-4 border rounded-lg"
            placeholder="Paste your resume text here..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Job Description
          </label>
          <textarea
            className="w-full h-96 p-4 border rounded-lg"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={analyzeResume}
        disabled={loading || !resume || !jobDescription}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium 
                   hover:bg-blue-700 disabled:bg-gray-300"
      >
        {loading ? 'Analyzing...' : 'Analyze Match'}
      </button>

      {analysis && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
          <div className="prose max-w-none whitespace-pre-wrap">
            {analysis}
          </div>
        </div>
      )}
    </main>
  );
}