'use client';

import { useState } from 'react';

export default function Home() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'text' | 'pdf'>('text');
  const [jobInputMethod, setJobInputMethod] = useState<'text' | 'url'>('text');
  const [jobUrl, setJobUrl] = useState('');

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResume(data.text);
    } catch (error) {
      console.error('Error parsing PDF:', error);
      alert('Failed to parse PDF. Please try pasting text instead.');
    }
  };

  const fetchJobFromUrl = async () => {
    if (!jobUrl) return;
    
    try {
      const response = await fetch('/api/fetch-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: jobUrl }),
      });
      const data = await response.json();
      setJobDescription(data.text);
    } catch (error) {
      console.error('Error fetching job:', error);
      alert('Failed to fetch job description. Please paste text instead.');
    }
  };

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
      alert('Failed to analyze. Please try again.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto bg-gray-50">
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <h1 className="text-4xl font-bold mb-3 text-gray-900">AI Resume Analyzer</h1>
        <p className="text-gray-600 text-lg">
          Get instant feedback on how well your resume matches a job description
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Resume Input */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <label className="block text-sm font-semibold mb-3 text-gray-900">
            Your Resume
          </label>
          
          {/* Toggle between text and PDF */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setUploadMethod('text')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                uploadMethod === 'text'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Paste Text
            </button>
            <button
              onClick={() => setUploadMethod('pdf')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                uploadMethod === 'pdf'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upload PDF
            </button>
          </div>

          {uploadMethod === 'text' ? (
            <textarea
              className="w-full h-96 p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900 placeholder-gray-400"
              placeholder="Paste your resume text here..."
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />
          ) : (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-gray-50">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePDFUpload}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg
                    className="w-12 h-12 text-gray-400 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-sm text-gray-700 font-medium">
                    Click to upload PDF
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PDF files only
                  </span>
                </label>
              </div>
              {resume && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800 font-medium">
                    ✓ PDF parsed ({resume.length} characters)
                  </p>
                </div>
              )}
              <textarea
                className="w-full h-64 p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900"
                placeholder="Extracted text will appear here..."
                value={resume}
                onChange={(e) => setResume(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Job Description Input */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <label className="block text-sm font-semibold mb-3 text-gray-900">
            Job Description
          </label>

          {/* Toggle between text and URL */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setJobInputMethod('text')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                jobInputMethod === 'text'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Paste Text
            </button>
            <button
              onClick={() => setJobInputMethod('url')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                jobInputMethod === 'url'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Paste URL
            </button>
          </div>

          {jobInputMethod === 'text' ? (
            <textarea
              className="w-full h-96 p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900 placeholder-gray-400"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="url"
                  className="flex-1 p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900 placeholder-gray-400"
                  placeholder="https://company.com/jobs/job-id"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                />
                <button
                  onClick={fetchJobFromUrl}
                  disabled={!jobUrl}
                  className="px-6 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 transition-colors whitespace-nowrap"
                >
                  Fetch
                </button>
              </div>
              {jobDescription && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800 font-medium">
                    ✓ Job description loaded ({jobDescription.length} characters)
                  </p>
                </div>
              )}
              <textarea
                className="w-full h-80 p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900"
                placeholder="Fetched job description will appear here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <button
        onClick={analyzeResume}
        disabled={loading || !resume || !jobDescription}
        className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg
                   hover:bg-blue-700 disabled:bg-gray-300 transition-all shadow-lg disabled:shadow-none"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Analyzing...
          </span>
        ) : (
          'Analyze Match'
        )}
      </button>

      {analysis && (
        <div className="mt-8 bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Analysis Results</h2>
          <div className="prose prose-lg max-w-none whitespace-pre-wrap text-gray-800 leading-relaxed">
            {analysis}
          </div>
        </div>
      )}
    </main>
  );
}