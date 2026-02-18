# AI Resume Analyzer

An AI-powered tool that analyzes how well a resume matches a job description using Claude's API.

## Features

- **Text or PDF upload** - paste resume text or upload PDF
- **Text or link upload** - paste job description
- Get instant AI-powered analysis:
  - Match score (1-10)
  - Identified strengths
  - Missing skills/experience
  - Actionable improvement suggestions
  - Cover letter strategy recommendations

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **AI**: Claude API (Anthropic)
- **Deployment**: Vercel

## Demo

[Live Demo](https://resume-analyzer-beta-topaz.vercel.app)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/ellango2612/ai-resume-analyzer.git
cd ai-resume-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=your_key_here
```

4. Run locally:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Deployment

Deployed on Vercel. Environment variables configured in Vercel dashboard.

## Built With

Built in under 48 hours as a demonstration of rapid full-stack development with LLM APIs.

## License

MIT
