const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const routes = require("./routes/v1/index");

let server;

app.use('/v1', routes);

mongoose.connect(config.mongoose.url, config.mongoose.options, () => {
    app.listen(config.port, () => {
        console.log(`Backend coneected ${config.port}`);
    })
})
