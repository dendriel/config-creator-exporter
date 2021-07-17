const { configurationService } = require('../service/configuration.service')
const { resourceService } = require('../service/resource.service')


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
            const resources = response.data;
            return resources.map(r => {
                return {
                    ...r,
                    data: JSON.parse(r.data)
                }
            })
        })
}
function createDataWrapper(resources) {
    return Promise.resolve({ data: {}, resources: resources})
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

function printData(wrapper) {
    console.log(JSON.stringify(wrapper.data))
}

function handleError(result, res) {
    if (!result.code) {
        throw result
    }
    res.status(result.code).send(result.message)
}

exports.getExport = (req, res, next) => {

    const configId = req.params.id
    getConfiguration(configId)
        .then(getResources)
        .then(createDataWrapper)
        .then(parseItems)
        .then(parseCollections)
        .then(printData)
        .catch(result => {
            handleError(result, res)
        })

    res.status(200).send()
};
