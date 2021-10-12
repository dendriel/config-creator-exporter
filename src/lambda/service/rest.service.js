const Axios = require('axios')

const basePath = '/rest'

const restUrl = process.env.SERVICE_URL || 'http://localhost'
const authKey = process.env.SERVICE_AUTH_KEY
const authCookie = process.env.AUTH_COOKIE || 'AUCC'

const axiosInstance = Axios.create({
    baseURL: restUrl,
    headers: {
        'Cookie': `${authCookie}=${authKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

const getById = (path, id) => {
    return axiosInstance.get(basePath + path + "/" + id)
}

const getAll = (path, offset, limit) => {
    return axiosInstance.get(basePath + path + "/all?limit=" + limit + "&offset=" + offset)
}

const removeById = (path, id) => {
    return axiosInstance.delete(basePath + path + "/" + id)
}

const count = (path) => {
    return axiosInstance.get(basePath + path + "/count")
}

const getSaveRequest = (template) => {
    return template.id ? axiosInstance.put : axiosInstance.post;
}

const save = (path, data) => {
    const saveRequest = getSaveRequest(data)
    return saveRequest(path, data)
}

const patch = (path, data) => {
    return axiosInstance.patch(basePath + path, data)
}

exports.restService = {
    api: axiosInstance,
    basePath: basePath,
    getById: getById,
    getAll: getAll,
    count: count,
    removeById: removeById,
    save: save,
    patch: patch
}
