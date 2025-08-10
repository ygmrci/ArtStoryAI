import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, voice, language } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Metin gerekli' }, { status: 400 });
    }

    // Hugging Face'in ücretsiz TTS modeli (Türkçe destekli)
    const response = await fetch(
      'https://api-inference.huggingface.co/models/facebook/mms-tts-tur',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY || 'hf_demo'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text,
          parameters: {
            voice: voice || 'tr',
            language: language || 'tr',
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face TTS API Error:', errorText);
      throw new Error(`Ses üretimi başarısız: ${response.status}`);
    }

    // Hugging Face'den gelen binary ses verisini base64'e çevir
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    const dataUrl = `data:audio/wav;base64,${base64Audio}`;

    return NextResponse.json({
      audio: dataUrl,
      text: text,
      voice: voice || 'tr',
      language: language || 'tr',
    });
  } catch (error) {
    console.error('Ses üretimi hatası:', error);
    return NextResponse.json({ error: 'Ses üretimi sırasında hata oluştu' }, { status: 500 });
  }
}
