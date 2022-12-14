var readlineSync = require('readline-sync')
var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/blood_results.proto"

var packageDefinition = protoLoader.loadSync(PROTO_PATH)
var blood_results_proto = grpc.loadPackageDefinition(packageDefinition).blood_results
var client = new blood_results_proto.BloodResultsService("0.0.0.0:40000", grpc.credentials.createInsecure());

var call = client.getBloodResults({ });

console.log("The patient blood results are:")
call.on('data', function(response) {
   console.log("Name: " + response.patientName + ", Date blood test taken: " + response.date + ", White Blood Cell Count: " + response.whiteBloodCellCount +
  ", Haemoglobin: " + response.haemoglobin + ", CRP: " + response.cReactiveProtein + ", Sodium: " + response.sodium + ", Potassium: " + response.potassium + ", Calcium: " +response.calcium + ".\n")
})

call.on('end', function() {

})

call.on('error', function(e) {
  console.log("An error occurred")
})
