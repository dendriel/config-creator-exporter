const { restService } = require('./rest.service')

const path = "/rest/resource"

const getAll = (projectId) => {
    return restService.api.get(path + "/all/" + projectId)
}

exports.resourceService = {
    getAll: getAll
}

