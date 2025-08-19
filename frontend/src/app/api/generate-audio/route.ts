import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, voice, language } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Metin gerekli' }, { status: 400 });
    }

    // Hugging Face API Key kontrol et
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey || apiKey === 'hf_demo') {
      console.warn('Hugging Face API Key bulunamadı, fallback ses kullanılıyor');

      // Fallback: Dummy ses data (base64 encoded silence)
      const dummyAudioData =
        'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';

      return NextResponse.json({
        audio: dummyAudioData,
        text: text,
        voice: voice || 'tr',
        language: language || 'tr',
        fallback: true,
        message: 'Demo mod: Gerçek ses üretimi için HUGGINGFACE_API_KEY gerekli',
      });
    }

    // Hugging Face'in ücretsiz TTS modeli (Türkçe destekli)
    const response = await fetch(
      'https://api-inference.huggingface.co/models/facebook/mms-tts-tur',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
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

      // API hatası durumunda fallback ses döndür
      const dummyAudioData =
        'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';

      return NextResponse.json({
        audio: dummyAudioData,
        text: text,
        voice: voice || 'tr',
        language: language || 'tr',
        fallback: true,
        message: 'API hatası: Fallback ses kullanılıyor',
      });
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
      fallback: false,
    });
  } catch (error) {
    console.error('Ses üretimi hatası:', error);

    // Hata durumunda fallback ses döndür
    const dummyAudioData =
      'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';

    // Catch bloğunda değişkenler tanımlı olmayabilir, güvenli değerler kullan
    return NextResponse.json({
      audio: dummyAudioData,
      text: 'Hata durumunda metin bulunamadı',
      voice: 'tr',
      language: 'tr',
      fallback: true,
      message: 'Sistem hatası: Fallback ses kullanılıyor',
    });
  }
}
