var readLineSync = require('readline-sync')
var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/blood_glucose_monitoring.proto"

var packageDefinition = protoLoader.loadSync(PROTO_PATH)
var blood_glucose_monitoring_proto = grpc.loadPackageDefinition(packageDefinition).blood_glucose_monitoring
var client = new blood_glucose_monitoring_proto.BloodGlucoseMonitoringService("0.0.0.0:40000", grpc.credentials.createInsecure())

var call = client.checkGlucoseLevels({});

call.on('data', function(response) {
  console.log()
})

call.on('end', function() {

})

call.on('error', function(e) {
  console.log(e)
})
