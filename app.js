const express = require('express');
const app = express();
const routes = require("./routes");
const swaggerSetup = require('./swagger');

const PORT = 8000;

app.use(express.json());
app.use(routes);
swaggerSetup(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;