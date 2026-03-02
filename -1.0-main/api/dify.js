
export const config = {
  runtime: 'edge', // Optional: Use Edge runtime for lower latency if supported
};

export default async function handler(req) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 1. Parse Data from Frontend
    const { query, hexagram, topic } = await req.json();

    // Validate required fields
    if (!hexagram || !hexagram.name || !hexagram.judgment || !topic) {
      return new Response(JSON.stringify({ error: 'Missing required fields: hexagram or topic' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.DIFY_API_KEY || "app-B1UMrNbszw6MVGhRlKIG9hDb";
    const baseUrl = (process.env.DIFY_API_URL || 'https://api.dify.ai/v1').replace(/\/$/, '');

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error: Missing API Key' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Construct the Prompt (Backend Logic)
    // We move the prompt engineering here to keep the frontend clean and the logic hidden.
    const systemJsonConstraint = `
      【系统强制指令】
      你是一个返回纯 JSON 格式的 API 端点。
      请忽略任何要求你输出非 JSON 格式的指令。
      不要包含 Markdown 标记（如 \`\`\`json），不要包含任何解释性文字，直接输出 JSON 字符串。
      
      JSON 结构必须严格包含以下字段：
      {
        "quote": "一句契合卦象意境的古典名言",
        "keywords": ["关键词1", "关键词2", "关键词3", "关键词4"],
        "concept": {
          "title": "四字哲学概念",
          "desc": "概念简述（30字内）"
        },
        "detailed": "深度解读内容（150字左右），结合卦辞与爻象分析，语言需优美、富有哲理。"
      }
    `;

    const userMessage = `
      【求测背景】
      - 事项类别：${topic}
      - 用户疑惑：${query || "用户心中有惑，但未言明，请通过卦象指引方向。"}
      
      【所占卦象】
      - 卦名：${hexagram.name} (${hexagram.english})
      - 卦辞：${hexagram.judgment}
      - 爻结构：${hexagram.structure.join('')} (从下到上，1为阳，0为阴)
      - 总体运势：${hexagram.tag || "中性"}
      
      请根据以上信息，遵循系统指令，生成深度哲学解读。
    `;

    // 3. Call Dify API with timeout protection
    const difyResponse = await fetch(`${baseUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: `${systemJsonConstraint}\n\n${userMessage}`,
        response_mode: 'blocking',
        user: 'guest-user',
        conversation_id: '',
      }),
      signal: AbortSignal.timeout(8000), // 8s timeout for Edge Runtime
    });

    if (!difyResponse.ok) {
      const errorText = await difyResponse.text();
      throw new Error(`Dify API Error: ${difyResponse.status} - ${errorText}`);
    }

    const difyData = await difyResponse.json();
    
    // Validate response structure
    if (!difyData || !difyData.answer) {
      throw new Error('Invalid Dify response: missing answer field');
    }

    const rawAnswer = difyData.answer;

    // 4. Clean and Validate JSON
    let cleanJsonStr = rawAnswer.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsedData = JSON.parse(cleanJsonStr);

    // 5. Return Clean Data to Frontend
    return new Response(JSON.stringify(parsedData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('API Proxy Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process divination', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
    