


const questionPromots = `帮我将这个字符串转化为json数据，要求忽略掉该字符串标题、页码，以${process.env.DATA_TEMPLATE}为转化的模板，只给我转化好的json数据，其他词不允许出现，这里面包含不是题目的东西（如目录）你需要过滤掉，题目部分为章节，选项类型（单选，多选），题目，选项，一般 章节名前面为空格后面接的是一、单选（或者多选）,特别注意你除了回复我转好的json以外，其他任何话都不要有,id必须是dpxxxx（如dp0001）`;

const answerPromots = `帮我将这个字符串转化为json数据，以${process.env.ANSWER_TENPLATE}为转化的模板，只给我转化好的json数据，特别注意你除了回复我转好的json以外，其他任何话都不要有,前面一部分是单选题后面必是多选然后再是单选，这样循环,id必须是dpxxxx（如dp0001）,单选的type为Achoice，多选为ManyChoice`;

export const fetchStream = async (questions: string,type:number) :Promise<{ code: number; data: string; }> => {
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
                        text: questions + (type === 0? questionPromots:answerPromots)
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
        const res = await response.json();
        return { code:200, data:res.choices[0].message.content};

    } catch (error) {
        throw new Error(error);
        // return { code:500,data:error };
    }
};