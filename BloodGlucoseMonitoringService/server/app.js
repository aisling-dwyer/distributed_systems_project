var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/blood_glucose_monitoring.proto"

var packageDefinition = protoLoader.loadSync(PROTO_PATH)
var blood_glucose_monitoring_proto = grpc.loadPackageDefinition(packageDefinition).blood_glucose_monitoring


function checkGlucoseLevels(call, callback) {

}

var server = new grpc.Server()
server.addService(blood_glucose_monitoring_proto.BloodGlucoseMonitoringService.service, { checkGlucoseLevels: checkGlucoseLevels})
server.bindAsync("0:0:0:0:40000", grpc.ServerCredentials.createInsecure(), function() {
  server.start()
})
