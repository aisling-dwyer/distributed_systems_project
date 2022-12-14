var readline = require('readline')
var readlineSync = require('readline-sync')
var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/ambulance_chat.proto"

var packageDefinition = protoLoader.loadSync(PROTO_PATH)
var ambulance_chat_proto = grpc.loadPackageDefinition(packageDefinition).ambulance_chat

var client = new ambulance_chat_proto.AmbulanceChatService("localhost:40000", grpc.credentials.createInsecure());

var name = readlineSync.question("What is your name?")
var call = client.sendMessage();

call.on('data', function(response) {
  console.log(response.name + ": " + response.message)
})
call.on('end', function() {

})
call.on("error", function(e) {
  console.log("Cannot connect to chat server")
})

call.write({
  message: name + " joined the chat room",
  name: name
})

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on("line", function(message) {
  if(message.toLowerCase() === "quit") {
    call.write({
      message: name + " left the chatroom",
      name: name
    })
    call.end()
    rl.close()
  } else {
    call.write({
      message: message,
      name: name
    })
  }
})
