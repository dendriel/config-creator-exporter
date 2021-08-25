const app = require('./src/dispatcher')

app.start();
console.log("Running dispatcher...")



/* Run as rest service
const app = require('./src/app');
const port = process.env.PORT || 3001

app.listen(port, function () {
    console.log(`app listening on port ${port}`)
})
*/
