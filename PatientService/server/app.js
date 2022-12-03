var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/patient.proto"
var packageDefinition = protoLoader.loadSync(PROTO_PATH)
var patient_proto = grpc.loadPackageDefinition(packageDefinition).patient


function addNewPatient(call, callback) {
  var message = ""
  var numOfPatientsAdded = 0

  call.on('data', function(request) {
    message = "Number of patients successfully added: ",
    numOfPatientsAdded += 1
  })

  call.on("end", function() {
    callback(null, {
      message: message,
      numOfPatientsAdded: numOfPatientsAdded
    })
  })


  call.on('error', function(e) {
    console.log("An error has occurred.")
  })
}




var server = new grpc.Server()

server.addService(patient_proto.PatientService.service, { addNewPatient: addNewPatient})

server.bindAsync("0.0.0.0:40000", grpc.ServerCredentials.createInsecure(), function() {
  server.start()
})
