const Axios = require('axios')

let urls = {
    test: `http://localhost:8081`,
    development: 'http://localhost:8081/',
    production: 'https://your-production-url.com/'
}

const authKey = process.env.AUTH_KEY
const axiosInstance = Axios.create({
    baseURL: urls[process.env.NODE_ENV],
    headers: {
        'Authorization': 'Bearer ' + authKey,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

const getById = (path, id) => {
    return axiosInstance.get(path + "/" + id)
}

const getAll = (path, offset, limit) => {
    return axiosInstance.get(path + "/all?limit=" + limit + "&offset=" + offset)
}

const removeById = (path, id) => {
    return axiosInstance.delete(path + "/" + id)
}

const count = (path) => {
    return axiosInstance.get(path + "/count")
}

const getSaveRequest = (template) => {
    return template.id ? axiosInstance.put : axiosInstance.post;
}

const save = (path, data) => {
    const saveRequest = getSaveRequest(data)
    return saveRequest(path, data)
}

exports.restService = {
    api: axiosInstance,
    getById: getById,
    getAll: getAll,
    count: count,
    removeById: removeById,
    save: save
}
