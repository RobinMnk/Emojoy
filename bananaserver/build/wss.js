"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var uuid_1 = __importDefault(require("uuid"));
var queue = [];
var connectionMapping = {};
var wsMapping = {};
function sendUserId(ws, id) {
    ws.send(JSON.stringify({
        id: id,
        type: 'userId',
    }));
}
function sendInit(ws, id) {
    ws.send(JSON.stringify({
        id: id,
        type: 'init',
    }));
}
function handleSignal(message, type) {
    if (!message.id) {
        console.log('no id in payload');
    }
    else if (!message.signal) {
        console.log('no offer signal in payload');
    }
    else {
        var reciever = connectionMapping[message.id];
        wsMapping[reciever].send(JSON.stringify({
            type: type,
            id: reciever,
            signal: message.signal,
        }));
    }
}
function handleAnswer(ws, message) {
    handleSignal(message, 'answer');
}
function handleOffer(ws, message) {
    handleSignal(message, 'offer');
}
function handleRegister(ws, message) {
    if (!message.id) {
        message.id = uuid_1.default();
        sendUserId(ws, message.id);
    }
    console.log('registered: ', message.id);
    queue.push({ ws: ws, id: message.id });
    if (queue.length > 1) {
        var e1 = queue.pop();
        var e2 = queue.pop();
        if (e1 && e2) {
            var ref1 = e1.ws, id1 = e1.id;
            var ref2 = e2.ws, id2 = e2.id;
            console.log('connecting ', id1, id2);
            connectionMapping[id1] = id2;
            connectionMapping[id2] = id1;
            wsMapping[id1] = ref1;
            wsMapping[id2] = ref2;
            sendInit(ref1, id1);
        }
        else {
            if (e1) {
                queue.push(e1);
            }
            if (e2) {
                queue.push(e2);
            }
        }
    }
}
function onmessage(ws, message) {
    if (!message) {
        console.log('no message');
    }
    var msg;
    try {
        msg = JSON.parse(message);
    }
    catch (err) {
        console.log('could not parse message to json');
        return;
    }
    switch (msg.type) {
        case "answer":
            handleAnswer(ws, msg);
            break;
        case "register":
            handleRegister(ws, msg);
            break;
        case "offer":
            handleOffer(ws, msg);
            break;
    }
}
function init() {
    var wss = new ws_1.default.Server({ port: 8081 });
    console.log('create');
    wss.on('connection', function (ws) {
        console.log('connected');
        ws.on('message', function (message) {
            onmessage(ws, message);
        });
    });
}
exports.init = init;
// var WebSocketServer = require('websocket').server;
// var http = require('http');
// var server = http.createServer(function() {
//   // process HTTP request. Since we're writing just WebSockets
//   // server we don't have to implement anything.
// });
// server.listen(1337, function() { });
// // create the server
// const wsServer = new WebSocketServer({
//   httpServer: server
// });
// // WebSocket server
// wsServer.on('request', function(request: any) {
//   var connection = request.accept(null, request.origin);
//   console.log('connection')
//   // This is the most important callback for us, we'll handle
//   // all messages from users here.
//   connection.on('message', function(message: any) {
//     if (message.type === 'utf8') {
//       // process WebSocket message
//     }
//   });
//   connection.on('close', function(){   // close user connection
//   });
// });
