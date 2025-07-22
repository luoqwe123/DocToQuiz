

const DB_NAME = 'DocumentConverterDB';
const STORE_NAME = 'jsonStore';
const RECORD_ID = 'convertedJson';
// 初始化 IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (event) => {
            const db = (event.target as any)!.result;
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        };

        request.onsuccess = (event) => {
            resolve((event.target as any)!.result);
        };

        request.onerror = () => {
            
            reject(new Error('Failed to open database.'));
        };
    });
}

// 获取 JSON 数据
export async function getJsonData() {
    try {
        const db:any = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(RECORD_ID);

            request.onsuccess = () => {
                resolve(request.result ? request.result.data : null);
            };
            request.onerror = () => reject(new Error('Failed to get data.'));
        });
    } catch (e) {
        throw e;
    }
}

// 保存 JSON 数据
export async function saveJsonData(data:any) {
    try {
        const db:any = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            
            const request = store.put({ id: RECORD_ID, data });

            request.onsuccess = () => resolve("success");
            request.onerror = () => reject(new Error('Failed to save data.'));
        });
    } catch (e) {
        throw e;
    }
}

// 删除 JSON 数据
export async function deleteJsonData() {
    try {
        const db:any = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(RECORD_ID);

            request.onsuccess = () => resolve("success");
            request.onerror = () => reject(new Error('Failed to delete data.'));
        });
    } catch (e) {
        throw e;
    }
}