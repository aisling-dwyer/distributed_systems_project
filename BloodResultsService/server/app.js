var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/blood_results.proto"
var packageDefinition = protoLoader.loadSync(
  PROTO_PATH
)
var blood_results_proto = grpc.loadPackageDefinition(packageDefinition).blood_results


var data = [
  {
    patientName: "John Doe",
    date: "13-12-2022",
    whiteBloodCellCount: 6,
    haemoglobin: 13,
    cReactiveProtein: 200,
    sodium: 139,
    potassium: 4,
    calcium: 2.02
  },
  {
    patientName: "Adam Johnson",
    date: "13-12-2022",
    whiteBloodCellCount: 7,
    haemoglobin: 12,
    cReactiveProtein: 5,
    sodium: 145,
    potassium: 6,
    calcium: 1.83
  },
  {
    patientName: "Connie Power",
    date: "13-12-2022",
    whiteBloodCellCount: 3,
    haemoglobin: 6,
    cReactiveProtein: 1,
    sodium: 133,
    potassium: 2,
    calcium: 2.14
  },
  {
    patientName: "Nicola Andrews",
    date: "13-12-2022",
    whiteBloodCellCount: 9,
    haemoglobin: 5,
    cReactiveProtein: 145,
    sodium: 144,
    potassium: 7,
    calcium: 1.23
  },
  {
    patientName: "Bob Hope",
    date: "13-12-2022",
    whiteBloodCellCount: 8,
    haemoglobin: 10,
    cReactiveProtein: 400,
    sodium: 144,
    potassium: 2,
    calcium: 1.93
  }
]



function getBloodResults(call, callback) {
    for(var i = 0; i < data.length; i++) {
      call.write({
        patientName: data[i].patientName,
        date: data[i].date,
        whiteBloodCellCount: data[i].date,
        haemoglobin: data[i].haemoglobin,
        cReactiveProtein: data[i].cReactiveProtein,
        sodium: data[i].sodium,
        potassium: data[i].potassium,
        calcium: data[i].calcium
      })
    }

    call.end()
}

var server = new grpc.Server()
server.addService(blood_results_proto.BloodResultsService.service, { getBloodResults: getBloodResults})
server.bindAsync("0.0.0.0:40000", grpc.ServerCredentials.createInsecure(), function() {
  server.start()
})
