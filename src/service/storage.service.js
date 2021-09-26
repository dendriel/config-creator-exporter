const FormData = require('form-data')
const fs = require('fs')
const { restService } = require('./rest.service')
const tmp = require('tmp')

const basePath = "/storage"

const getByName = (name) => {
    return restService.api.get(basePath + '/directory/find?name=' + name)
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
    return restService.api.post(basePath + '/resource/upload', formData, { headers: formData.getHeaders()})
}

exports.storageService = {
    directory: {
        getByName: getByName
    },
    resource: {
        upload: upload
    }
}
