var readlineSync = require('readline-sync')
var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/blood_results.proto"

var packageDefinition = protoLoader.loadSync(PROTO_PATH)
var blood_results_proto = grpc.loadPackageDefinition(packageDefinition).blood_results
var client = new blood_results_proto.BloodResultsService("0.0.0.0:40000", grpc.credentials.createInsecure());

var departmentName = readlineSync.question("What department do you want blood results for?")
var numOfPatients = readlineSync.question("How many patients are in this department?")


call.on('data', function(response) {
  console.log("The patient blood results of this department are " + response)
})

call.on('end', function() {

})

call.on('error', function(e) {
  console.log("An error occurred")
})
