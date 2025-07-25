import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
  }

  const apiToken = process.env.HUGGINGFACE_API_TOKEN;
  if (!apiToken) {
    return NextResponse.json({ error: 'Hugging Face API token missing.' }, { status: 500 });
  }

  // Hugging Face text-to-image endpoint (örnek model: aiyouthalliance/Free-Image-Generation-CC0)
  const HF_API_URL =
    'https://api-inference.huggingface.co/models/aiyouthalliance/Free-Image-Generation-CC0';

  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: response.status });
    }

    // Hugging Face genellikle image/png döndürür
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;
    return NextResponse.json({ image: dataUrl });
  } catch (err) {
    return NextResponse.json({ error: 'Image generation failed.' }, { status: 500 });
  }
}
