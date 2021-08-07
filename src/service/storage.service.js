const FormData = require('form-data')
const fs = require('fs')
const Axios = require('axios')
const tmp = require('tmp')


let urls = {
    test: `http://localhost:8082`,
    development: 'http://localhost:8082/',
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

const getByName = (name) => {
    return axiosInstance.get('/directory/find?name=' + name)
}

const upload = (name, directoryId, data) => {
    const textData = JSON.stringify(data);
    let tmpObj = tmp.fileSync({postfix: '.json'});

    fs.writeFileSync(tmpObj.fd, textData);

    console.log("File: ", tmpObj.name);
    console.log("Filedescriptor: ", tmpObj.fd);
    console.log("JSON OBJ " + JSON.stringify(tmpObj))

    const formData = new FormData();
    formData.append('name', name)
    formData.append('type', 'DEFAULT')
    formData.append('directoryId', directoryId)
    formData.append('file',  fs.createReadStream(tmpObj.name));

    // TODO: remove temp file
    return axiosInstance.post('/resource/upload', formData, { headers: formData.getHeaders()})
}

exports.storageService = {
    directory: {
        getByName: getByName
    },
    resource: {
        upload: upload
    }
}
