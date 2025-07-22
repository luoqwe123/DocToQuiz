


const promots = `帮我将这个字符串转化为json数据，要求忽略掉该字符串标题、页码，以${process.env.DATA_TEMPLATE}为转化的模板，只给我转化好的json数据，其他词不允许出现，这里面包含不是题目的东西（如目录）你需要过滤掉，题目部分为章节，选项类型（单选，多选），题目，选项，一般 章节名前面为空格后面接的是一、单选（或者多选）,特别注意你除了回复我转好的json以外，其他任何话都不要有`;

export const fetchStream = async (questions: string) :Promise<{ code: number; data: string; }> => {
    const url = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
    const apiKey = process.env.OPENAI_API_KEY;
    const payload = {
        messages: [
            {
                role: 'system',
                content: '你是一个擅长将字符转化为json数据的助手',
            },
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: questions + promots
                    },
                ],
            },
        ],
        model: "ep-20250207171255-vnrmt", // DOUbao1.5
        // stream: true, // 启用流式传输
        // max_tokens: 10000,
    };

    // 请求配置
    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json', // 使用 JSON 格式
        },
        body: JSON.stringify(payload),
    };
    try {
        // 发起 fetch 请求
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            return { code:500,data:"" };
        }
        // 检查是否支持 SSE（Content-Type 应为 text/event-stream）
        // if (!response.headers.get('content-type')?.includes('text/event-stream')) {
        //   throw new Error('Server does not support SSE');
        // }
        // // 获取响应体的 ReadableStream
        // const reader = response.body!.getReader();
        // const decoder = new TextDecoder('utf-8');

        //   const { done, value } = await reader.read();

        const res = await response.json();
        return { code:200, data:res.choices[0].message.content};
        //   // 解码流数据
        //   const chunk:any = decoder.decode(value);
        //   let res = JSON.parse(chunk);
        //   console.log(chunk,chunk.choices)
        //   const lines = chunk.split('\n');
        //   let res  = "";
        //   // 解析每行 SSE 数据
        //   for (const line of lines) {
        //     if (line.startsWith('data: ')) {
        //       const data = line.slice(6);
        //       if (data === '[DONE]') {
        //         // res.write('data: [DONE]\n\n');
        //         console.log('end')
        //         return res;

        //       }
        //       try {
        //         let parsed = JSON.parse(data);
        //         let content = parsed.choices?.[0]?.delta.content;         
        //         // if (content === '') {         
        //         //   content = parsed.choices[0].delta.reasoning_content;
        //         // }
        //         if (content) {
        //             console.log(content)
        //           res+=content;
        //         }
        //         if (parsed.choices?.[0]?.finish_reason === 'top') {
        //           break;
        //         }
        //       } catch (e) {
        //         console.error('Parse error:', e);
        //       }
        //     }
        //   }

    } catch (error) {
        return { code:500,data:"" }
        console.error('Fetch error:', error);
    }
};