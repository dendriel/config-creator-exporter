const { restService } = require('./rest.service')

const path = "/resource"

const getAll = (projectId) => {
    return restService.api.get(restService.basePath + path + "/all/" + projectId)
}

exports.resourceService = {
    getAll: getAll
}

