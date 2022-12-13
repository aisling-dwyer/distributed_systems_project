var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/blood_results.proto"
var packageDefinition = protoLoader.loadSync(
  PROTO_PATH
)
var blood_results_proto = grpc.loadPackageDefinition(packageDefinition).blood_results

function getBloodResults(call, callback) {
    for(var i = 0; i < call.request.numOfPatients; i++) {
      call.write({
        patientName: "xx",
        date: "xx",
        whiteBloodCellCount: 000,
        haemoglobin: 000,
        cReactiveProtein: 000,
        sodium: 000,
        potassium: 000,
        calcium: 000
      })
    }

    call.end()
}

var server = new grpc.Server()
server.addService(blood_results_proto.BloodResultsService.service, { getBloodResults: getBloodResults})
server.bindAsync("0.0.0.0:40000", grpc.ServerCredentials.createInsecure(), function() {
  server.start()
})
