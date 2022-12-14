var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/blood_glucose_monitoring.proto"

var packageDefinition = protoLoader.loadSync(PROTO_PATH)
var blood_glucose_monitoring_proto = grpc.loadPackageDefinition(packageDefinition).blood_glucose_monitoring


function checkGlucoseLevels(call, callback) {
  try {
    let bloodGlucoseLevel = parseInt(call.request.bloodGlucose)
    let result = isNaN(bloodGlucoseLevel)

    if(!result) {
      if(bloodGlucoseLevel < 4) {
      callback(null, {
        message: "Your blood glucose level is low. Eat 15g of carbs such as half a cup of orange juice. Check your blood glucose levels again in 15 minutes"
      })
      } else if(bloodGlucoseLevel > 10) {
        callback(null, {
          message: "Your blood glucose levels are high. You may need to take insulin."
        })
      } else {
        callback(null, {
          message: "Your blood glucose levels are normal."
          })
        }

    } else if(result) {
        callback(null, {
          message: "Invalid input."
        })
      }


  } catch(e) {
      callback(null, {
        message: "An error occurred 3."
      })
    }
}

var server = new grpc.Server()
server.addService(blood_glucose_monitoring_proto.BloodGlucoseMonitoringService.service, { checkGlucoseLevels: checkGlucoseLevels})
server.bindAsync("0.0.0.0:40000", grpc.ServerCredentials.createInsecure(), function() {
  server.start()
})
