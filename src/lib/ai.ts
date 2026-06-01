export interface AIScriptResult {
  introduction: string;
  technicalPoints: string;
  experienceSummary: string;
  behavioralIntro: string;
  closingStatement: string;
  fullScript: string;
  summary: string;
}

export async function generateCandidateScript(
  jobDescription: string,
  candidateName: string,
  resumeText?: string
): Promise<AIScriptResult> {
  const prompt = `You are an expert career coach and speechwriter. Generate a professional video introduction script for a job candidate.

Candidate Name: ${candidateName}
Job Description: ${jobDescription}
${resumeText ? `Resume Summary: ${resumeText}` : ''}

Generate a structured video introduction script with these EXACT sections:

1. INTRODUCTION (15-20 seconds, warm and confident opening)
2. TECHNICAL_POINTS (30-40 seconds, relevant skills and technical expertise for this role)
3. EXPERIENCE_SUMMARY (20-30 seconds, key achievements and experience)
4. BEHAVIORAL_INTRO (15-20 seconds, personality and soft skills)
5. CLOSING_STATEMENT (10-15 seconds, call to action and enthusiasm)
6. FULL_SCRIPT (complete seamless script combining all sections)
7. AI_SUMMARY (2-3 sentence professional summary for recruiters)

Respond ONLY with JSON in this exact format:
{
  "introduction": "...",
  "technicalPoints": "...",
  "experienceSummary": "...",
  "behavioralIntro": "...",
  "closingStatement": "...",
  "fullScript": "...",
  "summary": "..."
}`;

  // Try Groq first, fallback to OpenAI
  if (process.env.GROQ_API_KEY) {
    return await callGroq(prompt);
  } else if (process.env.OPENAI_API_KEY) {
    return await callOpenAI(prompt);
  } else {
    throw new Error('No AI API key configured. Please set GROQ_API_KEY or OPENAI_API_KEY.');
  }
}

async function callGroq(prompt: string): Promise<AIScriptResult> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  return parseAIResponse(content);
}

async function callOpenAI(prompt: string): Promise<AIScriptResult> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  return parseAIResponse(content);
}

function parseAIResponse(content: string): AIScriptResult {
  try {
    const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    // Fallback parsing
    return {
      introduction: content.slice(0, 200),
      technicalPoints: 'Technical expertise relevant to the role.',
      experienceSummary: 'Extensive experience in the field.',
      behavioralIntro: 'Strong team player with excellent communication.',
      closingStatement: 'Excited about this opportunity and look forward to contributing.',
      fullScript: content,
      summary: 'Experienced professional seeking this opportunity.',
    };
  }
}
