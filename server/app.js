var grpc = require("@grpc/grpc-js")
//required to load the proto files
var protoLoader = require("@grpc/proto-loader")


// Service 1 - rpc checkGlucoseLevels
// Unary service function - checkGlucoseLevels()
//path to proto file
var PROTO1_PATH = __dirname + "/protos/blood_glucose_monitoring.proto"
//loading the proto file
var packageDefinition = protoLoader.loadSync(PROTO1_PATH)
var blood_glucose_monitoring_proto = grpc.loadPackageDefinition(packageDefinition).blood_glucose_monitoring

//implementing the functionality of the checkGlucoseLevels method
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

// Service 2 - rpc checkGlucoseLevels
// client side streaming - getTestsCost
//path to proto file
var PROTO2_PATH = __dirname + "/protos/medical_test.proto"
//loading the proto file
var packageDefinition = protoLoader.loadSync(PROTO2_PATH)
var medical_test_proto = grpc.loadPackageDefinition(packageDefinition).medical_test

//implementing the functionality of the getTestsCost method
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


// Service 3 - rpc addNewPatient
// client side streaming
//path to proto file
var PROTO3_PATH = __dirname + "/protos/patient.proto"
//loading the proto file
var packageDefinition = protoLoader.loadSync(PROTO3_PATH)
var patient_proto = grpc.loadPackageDefinition(packageDefinition).patient

//implementing the functionality of the addNewPatient method
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

// Service 4 - rpc getBloodResults
// server side streaming
//path to proto file
var PROTO4_PATH = __dirname + "/protos/blood_results.proto"
//loading the proto file
var packageDefinition = protoLoader.loadSync(PROTO4_PATH)
var blood_results_proto = grpc.loadPackageDefinition(packageDefinition).blood_results

//the data which will be requested by the client and returned to the client
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


//implementing the functionality of the getBloodResults method
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

// Service 5 - rpc sendMessage
// bidirectional streaming
//path to proto file
var PROTO5_PATH = __dirname + "/protos/ambulance_chat.proto"
//loading the proto file
var packageDefinition = protoLoader.loadSync(PROTO5_PATH)
var ambulance_chat_proto = grpc.loadPackageDefinition(packageDefinition).ambulance_chat


var clients = {

}

//implementing the functionality of the sendMessage method
function sendMessage(call) {
  call.on('data', function(chat_message) {

    if(!(chat_message.name in clients)) {
      clients[chat_message.name] = {
        name: chat_message.name,
        call: call
      }
    }

    for(var client in clients) {
      clients[client].call.write(
        {
          name: chat_message.name,
          message: chat_message.message
        }
      )
    }
  });

  call.on('end', function() {
    call.end();
  });

  call.on("error", function(e) {
    console.log(e)
  });
}


//creating the server
var server = new grpc.Server()

//adding each service to the server
server.addService(blood_glucose_monitoring_proto.BloodGlucoseMonitoringService.service, { checkGlucoseLevels: checkGlucoseLevels})
server.addService(medical_test_proto.MedicalTestService.service, { getTestsCost: getTestsCost })
server.addService(patient_proto.PatientService.service, { addNewPatient: addNewPatient})
server.addService(blood_results_proto.BloodResultsService.service, { getBloodResults: getBloodResults})
server.addService(ambulance_chat_proto.AmbulanceChatService.service, { sendMessage: sendMessage})

//specification of the address and port to listen for client requests
server.bindAsync("0.0.0.0:40000", grpc.ServerCredentials.createInsecure(), function() {
  //starting the server
  server.start()
})
