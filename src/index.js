const app = require('./config/express');
require("./database/database.connect")

app.listen(process.env.PORT, () => console.log(`server started on port ${process.env.PORT}`));

module.exports = app;