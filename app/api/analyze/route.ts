import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { resume, jobDescription } = await request.json();

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `You are an expert resume reviewer and career coach. Analyze how well this resume matches the job description.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resume}

Provide a detailed analysis in this format:

**MATCH SCORE: X/10**

**STRENGTHS:**
- List 3-5 strong matches between resume and job requirements

**MISSING SKILLS/EXPERIENCE:**
- List specific requirements from the JD that aren't clearly demonstrated

**RECOMMENDED IMPROVEMENTS:**
- Specific, actionable suggestions to strengthen the application
- Which experiences to emphasize more
- Technical keywords to add

**COVER LETTER STRATEGY:**
- 2-3 key points to address in the cover letter
- Gaps to proactively explain

Be direct, specific, and constructive. Focus on actionable advice.`,
        },
      ],
    });

    const analysis = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error calling Claude:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume' },
      { status: 500 }
    );
  }
}