export async function POST(req) {
  try {
    const body = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({
        demo: true,
        atsScore: body.localScore || 78,
        improvedSummary: 'Reliable and motivated candidate with strong communication, teamwork, organization and problem-solving skills, ready to contribute in a professional work environment.',
        improvements: [
          'Add measurable results to your experience, for example: helped 40+ customers per shift.',
          'Use stronger action verbs such as managed, improved, supported, organized and resolved.',
          'Add keywords from the job offer to improve ATS compatibility.',
          'Keep the CV clean, simple and easy to scan.'
        ],
        coverLetters: [
          'Dear Hiring Manager, I am excited to apply for this position. My experience, reliability and communication skills make me confident that I can contribute positively to your team. I am motivated to learn quickly, support customers and bring a strong work ethic every day.',
          'Dear Hiring Team, I would like to express my interest in this opportunity. I bring strong teamwork, organization and problem-solving skills, and I am ready to contribute to a professional and fast-paced environment.',
          'Hello, I am applying for this role because I believe my background, motivation and willingness to learn match what your team is looking for. I would appreciate the opportunity to discuss how I can contribute.'
        ],
        interviewQuestions: [
          'Tell me about yourself.',
          'Why do you want this job?',
          'What are your main strengths?',
          'Describe a time you solved a problem.',
          'How do you handle stress or pressure?',
          'Why should we hire you?',
          'Tell me about a time you worked in a team.',
          'What are your availability and schedule preferences?',
          'Where do you see yourself in one year?',
          'Do you have any questions for us?'
        ]
      });
    }

    const prompt = `You are a professional resume and career coach. Return VALID JSON only, no markdown. Create: atsScore number 0-100, improvedSummary string, improvements array of 6 practical points, coverLetters array of exactly 3 different cover letters, interviewQuestions array of exactly 10 questions for the target job. Resume data: ${JSON.stringify(body)}`;

    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, responseMimeType: 'application/json' }
      })
    });

    const data = await r.json();
    if (!r.ok) {
      return Response.json({ error: 'Gemini request failed', details: data }, { status: 500 });
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const parsed = JSON.parse(text);
    return Response.json(parsed);
  } catch (e) {
    return Response.json({ error: 'Generation failed', details: String(e) }, { status: 500 });
  }
}
