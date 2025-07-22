from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_story_with_openai(art_name: str) -> str:
    prompt = f"'{art_name}' adlı tablo için kısa, yaratıcı ve özgün bir hikaye yaz. Hikaye 3-4 cümle olsun."
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Sen yaratıcı bir sanat hikayesi anlatıcısısın."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.8
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print("OpenAI API hatası:", e)
        return "AI ile hikaye üretilemedi."
