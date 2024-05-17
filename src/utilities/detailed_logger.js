export default function log(...args) {
    // 获取当前时间
    const currentTime = new Date().toLocaleString();

    // 获取调用此函数的函数名及其所在的类名
    const stack = new Error().stack.split('\n');
    let callerInfo = stack[2].trim();
    let functionName = callerInfo.match(/at (.*?) \(/);

    // 默认情况下
    let formattedFunctionName = 'Unknown';

    if (functionName) {
        formattedFunctionName = functionName[1];
        // 如果存在类名，则提取类名
        let classNameMatch = formattedFunctionName.match(/(.*?)\./);
        if (classNameMatch) {
            formattedFunctionName = classNameMatch[0] + formattedFunctionName.split('.').pop();
        }
    }

    // 将当前时间、函数名和参数整合成一条日志
    const logMessage = `[${currentTime}] [${formattedFunctionName}] ${args.join(' ')}`;

    // 打印日志
    console.log(logMessage);
}
