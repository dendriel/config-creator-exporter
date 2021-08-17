const { configurationService } = require('../service/configuration.service')
const { resourceService } = require('../service/resource.service')
const { storageService } = require('../service/storage.service')

const TARGET_DIRECTORY_NAME = 'CONFIG_CREATOR_EXPORTED_CONFIGURATIONS'

class Result extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

function getConfiguration(configId) {
    return configurationService.getById(configId)
        .then(response => {
            const config = response.data
            if (config.state !== 'REQUESTED') {
                throw new Result(409, 'Requisição já processada!')
            }

            return config
        })
}

function getResources(config) {
    return resourceService.getAll(config.projectId)
        .then(response => {
            const resources = response.data.map(r => {
                    return {
                        ...r,
                        data: JSON.parse(r.data)
                    }
            })

            return {
                config: config,
                resources: resources
            }
        })
}

function createDataWrapper(target) {
    return Promise.resolve({
        data: {},
        config: target.config,
        resources: target.resources,
        targetDirectory: {}
    })
}

function parseItemValue(item) {
    if (item.componentType === 'template') {
        return parseTemplate({resources: item.value, data: {}}).data
    }
    else if (item.componentType !== 'list') {
        return item.value
    }

    if (!item.value) {
        return []
    }

    return item.value
            .map(e => e.data)
            .map(parseItemValue)
}

function parseTemplate(wrapper) {
    if (!wrapper.resources) {
        console.log("Undefined resources from wrapper")
        return wrapper
    }

    wrapper.resources
        .forEach(r => {
            wrapper.data[r.name] = parseItemValue(r)
        })
    return wrapper
}

function parseItems(wrapper) {
    const items = wrapper.resources
        .map(r => r.data)
        .filter(r => r.type === 'item')

    parseTemplate({resources: items, data: wrapper.data})

    return Promise.resolve(wrapper)
}

function parseCollections(wrapper) {
    const collections = wrapper.resources
        .map(r => r.data)
        .filter(r => r.type === 'collection')

    collections.forEach(c => {
        const items = []
        if (c.value) {
            c.value.map(e => {
                let data = parseItemValue(e.data)
                items.push(data)
            })
        }
        wrapper.data[c.name] = items
    })

    return Promise.resolve(wrapper)
}

function getTargetDirectory(wrapper) {
    return storageService.directory.getByName(TARGET_DIRECTORY_NAME)
        .then(response => {
            wrapper.targetDirectory = response.data
            return wrapper
        })
}

function upload(wrapper) {
    return storageService.resource.upload("EXPORTED", wrapper.targetDirectory.id, wrapper.data)
        .then(response => {
            console.log("DONE: " + JSON.stringify(response.data))
            let resource = response.data;
            return {
                id: wrapper.config.id,
                state: 'READY',
                resourceId: resource.id
            }
        })
}

function updateConfig(data) {
    return configurationService.patch(data)
        .then(() => {
            console.log("Configuration successfully updated!")
        })
}

// TODO: Improve error handling by handling each specific error on place.
function handleError(result, res) {
    if (!result.code) {
        return res.status(500).send()
    }
    console.log(res.statusMessage)
    return res.status(result.code).end()
}

exports.getExport = (req, res, next) => {

    const configId = req.params.id
    getConfiguration(configId)
        .then(getResources)
        .then(createDataWrapper)
        .then(parseItems)
        .then(parseCollections)
        .then(getTargetDirectory)
        .then(upload)
        .then(updateConfig)
        .then(() => {
            return res.status(200).send()
        })
        .catch(result => {
            return handleError(result, res)
        })
};

exports.getExportHandler = (configId) => {
    return getConfiguration(configId)
        .then(getResources)
        .then(createDataWrapper)
        .then(parseItems)
        .then(parseCollections)
        .then(getTargetDirectory)
        .then(upload)
        .then(updateConfig)
}
