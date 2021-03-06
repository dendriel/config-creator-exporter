const { restService } = require('./rest.service')

const path = "/configuration"


exports.configurationService = {
    getById: (id) => restService.getById(path, id),
    patch: (data) => restService.patch(path, data),
}

