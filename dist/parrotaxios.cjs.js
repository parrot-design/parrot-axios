'use strict';

const toString = Object.prototype.toString;
function isDate(val) {
    return toString.call(val) === '[object Date]';
}
// export function isObject (val: any): val is Object {
//   return val !== null && typeof val === 'object'
// }
function isPlainObject(val) {
    return toString.call(val) === '[object Object]';
}
function isFormData(val) {
    return typeof val !== 'undefined' && val instanceof FormData;
}
function isURLSearchParams(val) {
    return typeof val !== 'undefined' && val instanceof URLSearchParams;
}
function extend(to, from) {
    console.log("extends key", from);
    for (const key in from) {
        console.log("extends key", key);
        to[key] = from[key];
    }
    return to;
}
function deepMerge(...objs) {
    const result = Object.create(null);
    objs.forEach(obj => {
        if (obj) {
            Object.keys(obj).forEach(key => {
                const val = obj[key];
                if (isPlainObject(val)) {
                    if (isPlainObject(result[key])) {
                        result[key] = deepMerge(result[key], val);
                    }
                    else {
                        result[key] = deepMerge(val);
                    }
                }
                else {
                    result[key] = val;
                }
            });
        }
    });
    return result;
}

function normalizeHeaderName(headers, normalizedName) {
    if (!headers) {
        return;
    }
    Object.keys(headers).forEach(name => {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
            headers[normalizedName] = headers[name];
            delete headers[name];
        }
    });
}
function processHeaders(headers, data) {
    normalizeHeaderName(headers, 'Content-Type');
    if (isPlainObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8';
        }
    }
    return headers;
}
function parseHeaders(headers) {
    let parsed = Object.create(null);
    if (!headers) {
        return parsed;
    }
    headers.split('\r\n').forEach(line => {
        let [key, ...vals] = line.split(':');
        key = key.trim().toLowerCase();
        if (!key) {
            return;
        }
        const val = vals.join(':').trim();
        parsed[key] = val;
    });
    return parsed;
}
function flattenHeaders(headers, method) {
    if (!headers) {
        return headers;
    }
    headers = deepMerge(headers.common, headers[method], headers);
    const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common'];
    methodsToDelete.forEach(method => {
        delete headers[method];
    });
    return headers;
}

class AxiosError extends Error {
    /* istanbul ignore next */
    constructor(message, config, code, request, response) {
        super(message);
        this.config = config;
        this.code = code;
        this.request = request;
        this.response = response;
        this.isAxiosError = true;
        Object.setPrototypeOf(this, AxiosError.prototype);
    }
}
function createError(message, config, code, request, response) {
    const error = new AxiosError(message, config, code, request, response);
    return error;
}

function encode(val) {
    return encodeURIComponent(val)
        .replace(/%40/g, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/gi, '[')
        .replace(/%5D/gi, ']');
}
function buildURL(url, params, paramsSerializer) {
    if (!params) {
        return url;
    }
    let serializedParams;
    if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
    }
    else if (isURLSearchParams(params)) {
        serializedParams = params.toString();
    }
    else {
        const parts = [];
        Object.keys(params).forEach(key => {
            const val = params[key];
            if (val === null || typeof val === 'undefined') {
                return;
            }
            let values = [];
            if (Array.isArray(val)) {
                values = val;
                key += '[]';
            }
            else {
                values = [val];
            }
            values.forEach(val => {
                if (isDate(val)) {
                    val = val.toISOString();
                }
                else if (isPlainObject(val)) {
                    val = JSON.stringify(val);
                }
                parts.push(`${encode(key)}=${encode(val)}`);
            });
        });
        serializedParams = parts.join('&');
    }
    if (serializedParams) {
        const markIndex = url.indexOf('#');
        if (markIndex !== -1) {
            url = url.slice(0, markIndex);
        }
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }
    return url;
}
function isAbsoluteURL(url) {
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}
function combineURL(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
}
function isURLSameOrigin(requestURL) {
    const parsedOrigin = resolveURL(requestURL);
    return (parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host);
}
const urlParsingNode = document.createElement('a');
const currentOrigin = resolveURL(window.location.href);
function resolveURL(url) {
    urlParsingNode.setAttribute('href', url);
    const { protocol, host } = urlParsingNode;
    return {
        protocol,
        host
    };
}

const cookie = {
    read(name) {
        const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return match ? decodeURIComponent(match[3]) : null;
    }
};

function xhr(config) {
    return new Promise((resolve, reject) => {
        const { data = null, url, method, headers = {}, responseType, timeout, cancelToken, withCredentials, xsrfCookieName, xsrfHeaderName, onDownloadProgress, onUploadProgress, auth, validateStatus } = config;
        const request = new XMLHttpRequest();
        request.open(method.toUpperCase(), url, true);
        configureRequest();
        addEvents();
        processHeaders();
        processCancel();
        request.send(data);
        function configureRequest() {
            if (responseType) {
                request.responseType = responseType;
            }
            if (timeout) {
                request.timeout = timeout;
            }
            if (withCredentials) {
                request.withCredentials = withCredentials;
            }
        }
        function addEvents() {
            request.onreadystatechange = function handleLoad() {
                if (request.readyState !== 4) {
                    return;
                }
                if (request.status === 0) {
                    return;
                }
                const responseHeaders = parseHeaders(request.getAllResponseHeaders());
                const responseData = responseType && responseType !== 'text' ? request.response : request.responseText;
                const response = {
                    data: responseData,
                    status: request.status,
                    statusText: request.statusText,
                    headers: responseHeaders,
                    config,
                    request
                };
                handleResponse(response);
            };
            request.onerror = function handleError() {
                reject(createError('Network Error', config, null, request));
            };
            request.ontimeout = function handleTimeout() {
                reject(createError(`Timeout of ${config.timeout} ms exceeded`, config, 'ECONNABORTED', request));
            };
            if (onDownloadProgress) {
                request.onprogress = onDownloadProgress;
            }
            if (onUploadProgress) {
                request.upload.onprogress = onUploadProgress;
            }
        }
        function processHeaders() {
            if (isFormData(data)) {
                delete headers['Content-Type'];
            }
            if ((withCredentials || isURLSameOrigin(url)) && xsrfCookieName) {
                const xsrfValue = cookie.read(xsrfCookieName);
                if (xsrfValue && xsrfHeaderName) {
                    headers[xsrfHeaderName] = xsrfValue;
                }
            }
            if (auth) {
                headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password);
            }
            Object.keys(headers).forEach(name => {
                if (data === null && name.toLowerCase() === 'content-type') {
                    delete headers[name];
                }
                else {
                    request.setRequestHeader(name, headers[name]);
                }
            });
        }
        function processCancel() {
            if (cancelToken) {
                cancelToken.promise
                    .then(reason => {
                    request.abort();
                    reject(reason);
                })
                    .catch(
                /* istanbul ignore next */
                () => {
                    // do nothing
                });
            }
        }
        function handleResponse(response) {
            if (!validateStatus || validateStatus(response.status)) {
                resolve(response);
            }
            else {
                reject(createError(`Request failed with status code ${response.status}`, config, null, request, response));
            }
        }
    });
}

function transform(data, headers, fns) {
    if (!fns) {
        return data;
    }
    if (!Array.isArray(fns)) {
        fns = [fns];
    }
    fns.forEach(fn => {
        data = fn(data, headers);
    });
    return data;
}

function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    processConfig(config);
    return xhr(config).then(res => {
        return transformResponseData(res);
    }, e => {
        if (e && e.response) {
            e.response = transformResponseData(e.response);
        }
        return Promise.reject(e);
    });
}
function processConfig(config) {
    config.url = transformURL(config);
    config.data = transform(config.data, config.headers, config.transformRequest);
    config.headers = flattenHeaders(config.headers, config.method);
}
function transformURL(config) {
    let { url, params, paramsSerializer, baseURL } = config;
    if (baseURL && !isAbsoluteURL(url)) {
        url = combineURL(baseURL, url);
    }
    return buildURL(url, params, paramsSerializer);
}
function transformResponseData(res) {
    res.data = transform(res.data, res.headers, res.config.transformResponse);
    return res;
}
function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
    }
}

class InterceptorManager {
    constructor() {
        this.interceptors = [];
    }
    use(resolved, rejected) {
        this.interceptors.push({
            resolved,
            rejected
        });
        return this.interceptors.length - 1;
    }
    forEach(fn) {
        this.interceptors.forEach(interceptor => {
            if (interceptor !== null) {
                fn(interceptor);
            }
        });
    }
    eject(id) {
        if (this.interceptors[id]) {
            this.interceptors[id] = null;
        }
    }
}

const strats = Object.create(null);
function defaultStrat(val1, val2) {
    return typeof val2 !== 'undefined' ? val2 : val1;
}
function fromVal2Strat(val1, val2) {
    if (typeof val2 !== 'undefined') {
        return val2;
    }
}
function deepMergeStrat(val1, val2) {
    if (isPlainObject(val2)) {
        return deepMerge(val1, val2);
    }
    else if (typeof val2 !== 'undefined') {
        return val2;
    }
    else if (isPlainObject(val1)) {
        return deepMerge(val1);
    }
    else {
        return val1;
    }
}
const stratKeysFromVal2 = ['url', 'params', 'data'];
stratKeysFromVal2.forEach(key => {
    strats[key] = fromVal2Strat;
});
const stratKeysDeepMerge = ['headers', 'auth'];
stratKeysDeepMerge.forEach(key => {
    strats[key] = deepMergeStrat;
});
function mergeConfig(config1, config2) {
    if (!config2) {
        config2 = {};
    }
    const config = Object.create(null);
    for (let key in config2) {
        mergeField(key);
    }
    for (let key in config1) {
        if (!config2[key]) {
            mergeField(key);
        }
    }
    function mergeField(key) {
        const strat = strats[key] || defaultStrat;
        config[key] = strat(config1[key], config2[key]);
    }
    return config;
}

class Axios {
    constructor(initConfig) {
        this.defaults = initConfig;
        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager()
        };
    }
    request(url, config) {
        if (typeof url === 'string') {
            if (!config) {
                config = {};
            }
            config.url = url;
        }
        else {
            config = url;
        }
        config = mergeConfig(this.defaults, config);
        config.method = config.method.toLowerCase();
        const chain = [
            {
                resolved: dispatchRequest,
                rejected: undefined
            }
        ];
        this.interceptors.request.forEach(interceptor => {
            chain.unshift(interceptor);
        });
        this.interceptors.response.forEach(interceptor => {
            chain.push(interceptor);
        });
        let promise = Promise.resolve(config);
        while (chain.length) {
            const { resolved, rejected } = chain.shift();
            promise = promise.then(resolved, rejected);
        }
        return promise;
    }
    get(url, config) {
        return this._requestMethodWithoutData('get', url, config);
    }
    delete(url, config) {
        return this._requestMethodWithoutData('delete', url, config);
    }
    head(url, config) {
        return this._requestMethodWithoutData('head', url, config);
    }
    options(url, config) {
        return this._requestMethodWithoutData('options', url, config);
    }
    post(url, data, config) {
        return this._requestMethodWithData('post', url, data, config);
    }
    put(url, data, config) {
        return this._requestMethodWithData('put', url, data, config);
    }
    patch(url, data, config) {
        return this._requestMethodWithData('patch', url, data, config);
    }
    getUri(config) {
        config = mergeConfig(this.defaults, config);
        return transformURL(config);
    }
    _requestMethodWithoutData(method, url, config) {
        return this.request(Object.assign(config || {}, {
            method,
            url
        }));
    }
    _requestMethodWithData(method, url, data, config) {
        return this.request(Object.assign(config || {}, {
            method,
            url,
            data
        }));
    }
}

function transformRequest(data) {
    if (isPlainObject(data)) {
        return JSON.stringify(data);
    }
    return data;
}
function transformResponse(data) {
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        }
        catch (e) {
            // do nothing
        }
    }
    return data;
}

const defaults = {
    method: 'get',
    timeout: 0,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    headers: {
        common: {
            Accept: 'application/json, text/plain, */*'
        }
    },
    transformRequest: [
        function (data, headers) {
            processHeaders(headers, data);
            return transformRequest(data);
        }
    ],
    transformResponse: [
        function (data) {
            return transformResponse(data);
        }
    ],
    validateStatus(status) {
        return status >= 200 && status < 300;
    }
};
const methodsNoData = ['delete', 'get', 'head', 'options'];
methodsNoData.forEach(method => {
    defaults.headers[method] = {};
});
const methodsWithData = ['post', 'put', 'patch'];
methodsWithData.forEach(method => {
    defaults.headers[method] = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
});

class Cancel {
    constructor(message) {
        this.message = message;
    }
}
function isCancel(value) {
    return value instanceof Cancel;
}

class CancelToken {
    constructor(executor) {
        let resolvePromise;
        this.promise = new Promise(resolve => {
            resolvePromise = resolve;
        });
        executor(message => {
            if (this.reason) {
                return;
            }
            this.reason = new Cancel(message);
            resolvePromise(this.reason);
        });
    }
    throwIfRequested() {
        if (this.reason) {
            throw this.reason;
        }
    }
    static source() {
        let cancel;
        const token = new CancelToken(c => {
            cancel = c;
        });
        return {
            cancel,
            token
        };
    }
}

function createInstance(config) {
    const context = new Axios(config);
    const instance = Axios.prototype.request.bind(context);
    console.log("context", context);
    extend(instance, context);
    return instance;
}
const axios = createInstance(defaults);
axios.create = function create(config) {
    return createInstance(mergeConfig(defaults, config));
};
axios.CancelToken = CancelToken;
axios.Cancel = Cancel;
axios.isCancel = isCancel;
axios.all = function all(promises) {
    return Promise.all(promises);
};
axios.spread = function spread(callback) {
    return function wrap(arr) {
        return callback.apply(null, arr);
    };
};
axios.Axios = Axios;

module.exports = axios;
