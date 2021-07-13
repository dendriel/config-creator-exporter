// import configurationService from "../service/configuration.service";
const { configurationService } = require('../service/configuration.service')

// exports.post = (req, res, next) => {
//     res.status(201).send('Requisição recebida com sucesso!');
// };
//
// exports.put = (req, res, next) => {
//     let id = req.params.id;
//     res.status(201).send(`Requisição recebida com sucesso! ${id}`);
// };
//
// exports.delete = (req, res, next) => {
//     let id = req.params.id;
//     res.status(200).send(`Requisição recebida com sucesso! ${id}`);
// };

exports.getExport = (req, res, next) => {

    const configurationId = req.params.id
    configurationService.getById(configurationId)
        .then(response => {
            console.log("Configuration to export: " + JSON.stringify(response))
            res.status(201)
                .send('Requisição recebida com sucesso!');
        })
        .catch(error => {
            console.log("Failed to get configuration. " + JSON.stringify(error))
            res.status(502)
        })
};
