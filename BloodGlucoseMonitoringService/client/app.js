var readLineSync = require('readline-sync')
var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/blood_glucose_monitoring.proto"

var packageDefinition = protoLoader.loadSync(PROTO_PATH)
var blood_glucose_monitoring_proto = grpc.loadPackageDefinition(packageDefinition).blood_glucose_monitoring
var client = new blood_glucose_monitoring_proto.BloodGlucoseMonitoringService("0.0.0.0:40001", grpc.credentials.createInsecure())

var bloodGlucose = readLineSync.question("What is your current blood glucose level?")

try{
  client.add({bloodGlucose: bloodGlucose}, function(error, response) {
    try{
      console.log(response.message)
    } catch(e) {
      console.log("An error occurred.")
    }
  })
}
