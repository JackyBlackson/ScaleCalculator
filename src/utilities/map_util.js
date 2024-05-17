// 将 Map 转换为包含键值对的数组
export function mapToObj(map) {
    const obj = {};
    map.forEach((value, key) => {
        obj[key] = value;
    });
    return obj;
}

// 将数组转换为 Map 对象
export function objToMap(obj) {
    const map = new Map();
    Object.keys(obj).forEach(key => {
        map.set(key, obj[key]);
    });
    return map;
}