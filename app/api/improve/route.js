import OpenAI from 'openai';

export async function POST(req) {
  try {
    const data = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'Missing OPENAI_API_KEY on server.' }, { status: 500 });
    }
    const openai = new OpenAI({ apiKey });
    const prompt = `You are a professional resume coach. Improve this resume, create an ATS score out of 100, list improvements, and write a personalized cover letter. Return valid JSON with keys: score, improvedSummary, improvedExperience, improvedSkills, improvements, coverLetter. Resume data: ${JSON.stringify(data)}`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });
    const content = completion.choices[0]?.message?.content || '{}';
    return Response.json(JSON.parse(content));
  } catch (e) {
    return Response.json({ error: e.message || 'AI error' }, { status: 500 });
  }
}
