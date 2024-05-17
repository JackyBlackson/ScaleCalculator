import { v4 as uuidv4 } from 'uuid';

// 生成并返回一个唯一的 UUID
export function generateUUID() {
    // 调用 uuidv4 函数生成 UUID
    return uuidv4();
}