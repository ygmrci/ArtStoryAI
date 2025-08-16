import json
import asyncio
from fastapi import HTTPException

async def search_with_openai(query: str, client) -> dict:
    """
    OpenAI ile eser arama
    """
    try:
        response = await asyncio.to_thread(
            client.chat.completions.create,
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "Sen bir sanat tarihi uzmanısın. Verilen eser adına göre detaylı bilgi ver."
                },
                {
                    "role": "user",
                    "content": f"'{query}' adlı sanat eseri hakkında detaylı bilgi ver. JSON formatında yanıtla:\n{{\n  \"artwork_name\": \"eser adı\",\n  \"artist\": \"sanatçı adı\",\n  \"year\": \"yıl\",\n  \"movement\": \"akım\",\n  \"description\": \"açıklama\",\n  \"story\": \"eser hikayesi (2-3 paragraf)\"\n}}"
                }
            ],
            max_tokens=800
        )
        
        content = response.choices[0].message.content
        print(f"🤖 OpenAI arama yanıtı: {content}")
        
        # JSON'ı çıkar
        try:
            start = content.find('{')
            end = content.rfind('}') + 1
            if start != -1 and end != 0:
                json_str = content[start:end]
                result = json.loads(json_str)
                result["success"] = True
                return result
            else:
                raise ValueError("JSON bulunamadı")
        except json.JSONDecodeError:
            return await fallback_search(query)
            
    except Exception as e:
        print(f"❌ OpenAI arama hatası: {e}")
        return await fallback_search(query)

async def fallback_search(query: str) -> dict:
    """
    OpenAI API kullanılamadığında basit arama
    """
    return {
        "success": True,
        "artwork_name": query,
        "artist": "Bilinmeyen Sanatçı",
        "year": "Bilinmeyen",
        "movement": "Bilinmeyen",
        "description": f"'{query}' hakkında bilgi bulunamadı. Lütfen daha spesifik bir arama yapın.",
        "story": f"'{query}' adlı eser hakkında detaylı bilgi için internet üzerinden araştırma yapmanızı öneririz."
    }
