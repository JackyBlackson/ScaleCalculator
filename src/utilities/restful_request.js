import axios from 'axios';
import {api_root} from "@/config/global";
import {LoggedInUser} from "@/config/user_config";
import { message } from 'antd';

const customAxios = axios.create({
    baseURL: api_root,
});

const handleResponse = (response) => {
    if (response.code === 114514) {
        message.error(response.message)
    }
    // Always return HTTP 200
    return response.data;
};

const handleError = (error) => {
    // Handle different error status codes here
    let errorMessage = 'An error occurred';
    if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
    }
    const responseData = {
        code: error.response ? error.response.status : 500,
        message: errorMessage,
        data: null,
    };
    return Promise.reject(responseData);
};

/**
 *
 * @param method 请求方法
 * @param url   请求的url，不包含api root url，以“/”开始
 * @param jwtToken  jwtToken的值
 * @param data  需要包含的data
 * @returns {Promise<Result<RootNode>> | Promise<Result<Root>> | Promise<any>}
 */
const RestfulRequest = (method, url, jwtToken = null, data = null) => {
    const headers = {};

    if (jwtToken && jwtToken.trim() !== '') {
        headers.Authorization = `${jwtToken}`;
    }

    return customAxios({
        method,
        url,
        headers,
        data,
    })
        .then(handleResponse)
        .catch(handleError);
};

export default RestfulRequest;
