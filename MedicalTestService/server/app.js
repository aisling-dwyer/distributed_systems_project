var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/medical_test.proto"
var packageDefinition = protoLoader.loadSync(
  PROTO_PATH
)
var medical_test_proto = grpc.loadPackageDefinition(packageDefinition).medical_test

function getTestsCost(call, callback) {
  var price = 0
  var numOfTests = 0

  call.on('data', function(request) {
    price += request.price
    numOfTests += 1
  })

  call.on("end", function() {
    callback(null, {
      price: price,
      numOfTests: numOfTests
    })
  })

  call.on('error', function(e) {
    console.log("An error occurred")
  })
}

var server = new grpc.Server()
server.addService(medical_test_proto.MedicalTestService.service, { getTestsCost: getTestsCost })
server.bindAsync("0.0.0.0:40000", grpc.ServerCredentials.createInsecure(), function() {
  server.start()
})
