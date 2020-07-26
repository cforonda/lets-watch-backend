
const express         = require("express");
const index           = require("../routes/index.js");
const http            = require("http");
const socketIo        = require("socket.io");
const path            = require('path');
const config          = require(path.join(__dirname,"../config/global.json"));
const port            = process.env.PORT || config.Server.settings.port;
const app             = express();
const server          = http.createServer(app);
const io              = socketIo(server);
const listeners       = require('./listeners/listeners');
app.use(index);


io.on('connection', socket => {
    listeners.addSocketListeners(socket, io);
});


server.listen(port, () => console.log(`\x1b[40m`,`\x1b[32m`,
`
    [+] Server         : http://localhost:${port}
    [+] Socket         : ws://localhost:${config.Server.settings.port}
    [~] Running Server...
`,`\x1b[0m`));
