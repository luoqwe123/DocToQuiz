import axios from 'axios';


export async function upload(file: File): Promise<any> {
    let taskId: string | null = null;
    let progress = 0;
    let totalTasks = 0;
    let result: any = null;
    let error: string | null = null;
    let ws: WebSocket | null = null;
    // 上传文件
    const formData = new FormData();
    console.log(file)
    formData.append('file', file, file.name);
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}pdfFile/convert`, formData);
        taskId = response.data.taskId;
        console.log(response)
        // connectWebSocket(taskId!);
    } catch (err:any) {
        error = "failt";
        throw new Error(err)
    }

    //   loadingStore.setProgress(100);

    function connectWebSocket(taskId: string) {
    ws = new WebSocket(`ws://localhost:3001/api/task?taskId=${taskId}`);
    ws.onmessage = (event) => {
      console.log(event.data)
      const data = JSON.parse(event.data);
      if (data.status === 'progress') {
        progress = data.progress;
        totalTasks = data.totalTasks;
        console.log(`Progress: ${progress}/${totalTasks}`);
      } else if (data.status === 'completed') {
        result = data.result;
        console.log('Result:',result);
        ws?.close();
      } else if (data.status === 'failed') {
        error = data.error;
        console.error('Error:', error);
        ws?.close();
      }
    };
    ws.onerror = () => {
      error = 'WebSocket connection failed';
      console.error(error);
    };
  }
}

