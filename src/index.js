const app = require('./config/express');
const db = require("./api/models");

db.sequelize.sync({ force: true });

app.listen(process.env.PORT, () => console.log(`server started on port ${process.env.PORT}`));

module.exports = app;