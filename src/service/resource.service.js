const { restService } = require('./rest.service')

const path = "/resource"

const getAll = (projectId) => {
    return restService.api.get(path + "/all/" + projectId)
}

exports.resourceService = {
    getAll: getAll
}

