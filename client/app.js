//importing required modules
//allows user input to be read from command line
var readline = require('readline')
var readlineSync = require('readline-sync')
var grpc = require("@grpc/grpc-js")
//required to load the proto files
var protoLoader = require("@grpc/proto-loader")

//path to proto file
var PROTO1_PATH = __dirname + "/protos/blood_glucose_monitoring.proto"
//loading the proto file
var packageDefinition = protoLoader.loadSync(PROTO1_PATH)
var blood_glucose_monitoring_proto = grpc.loadPackageDefinition(packageDefinition).blood_glucose_monitoring
var client1 = new blood_glucose_monitoring_proto.BloodGlucoseMonitoringService("0.0.0.0:40000", grpc.credentials.createInsecure())

//path to proto file
var PROTO2_PATH = __dirname + "/protos/medical_test.proto"
//loading the proto file
var packageDefinition = protoLoader.loadSync(PROTO2_PATH)
var medical_test_proto = grpc.loadPackageDefinition(packageDefinition).medical_test
var client2 = new medical_test_proto.MedicalTestService("0.0.0.0:40000", grpc.credentials.createInsecure());

//path to proto file
var PROTO3_PATH = __dirname + "/protos/patient.proto"
//loading the proto file
var packageDefinition = protoLoader.loadSync(PROTO3_PATH)
var patient_proto = grpc.loadPackageDefinition(packageDefinition).patient
var client3 = new patient_proto.PatientService("0.0.0.0:40000", grpc.credentials.createInsecure())

//path to proto file
var PROTO4_PATH = __dirname + "/protos/blood_results.proto"
//loading the proto file
var packageDefinition = protoLoader.loadSync(PROTO4_PATH)
var blood_results_proto = grpc.loadPackageDefinition(packageDefinition).blood_results
var client4 = new blood_results_proto.BloodResultsService("0.0.0.0:40000", grpc.credentials.createInsecure());

//path to proto file
var PROTO5_PATH = __dirname + "/protos/ambulance_chat.proto"
//loading the proto file
var packageDefinition = protoLoader.loadSync(PROTO5_PATH)
var ambulance_chat_proto = grpc.loadPackageDefinition(packageDefinition).ambulance_chat
var client5 = new ambulance_chat_proto.AmbulanceChatService("localhost:40000", grpc.credentials.createInsecure());

//giving the user the option to select what service they would like to avail of
var action = readlineSync.question(
    "What would you like to do?\n"
    +"\t 1 to check blood glucose levels\n"
    +"\t 2 to get total cost of medical tests\n"
    +"\t 3 to add a new patient\n"
    +"\t 4 to view blood test results of current patients\n"
    +"\t 5 to open chat between ambulance and hospital\n"
)

action = parseInt(action)


if(action === 1) {
  // Service 1 - rpc checkGlucoseLevels
  // Unary service function - checkGlucoseLevels()

  var bloodGlucose = readlineSync.question("What is the blood glucose level?")

  try{
    client1.checkGlucoseLevels({bloodGlucose: bloodGlucose}, function(error, response) {
      try{
        console.log(response.message)
      } catch(e) {
        console.log("An error occurred")
      }
    })
  } catch(e) {
    console.log("An error occurred 2")
  }

} else if(action === 2) {
  // Service 2 - rpc checkGlucoseLevels
  // client side streaming - getTestsCost

  var call = client2.getTestsCost(function(error, response) {
    if(error) {
      console.log("An error occurred")
    } else {
      console.log("You have ordered " +response.numOfTests + " test(s). The total cost of these tests is: €" + response.price)
    }
  })

  while(true) {
    var testName = readlineSync.question("What is the name of the test? q to quit")
    if(testName.toLowerCase() === "q") {
      break
    }
    var price = readlineSync.question("How much does the test cost?")

    call.write({
      price: parseFloat(price),
      testName: testName
    })
  }
  call.end()
} else if (action === 3) {

    // Service 3 - rpc addNewPatient
    // client side streaming

    var call = client3.addNewPatient(function(error, response) {
      if(error) {
        console.log("An error occurred.")
      } else {
        console.log(response.message + response.numOfPatientsAdded)
      }
    })


    while(true) {

      var user_input_name = readlineSync.question("Enter the patient's name: ")
      var user_input_dob = readlineSync.question("Enter the patient's date of birth in the format dd-mm-yyyy: ")
      var user_input_phone = readlineSync.question("Enter the patient's phone number: ")
      var user_input_address = readlineSync.question("Enter the patient's address: ")

      call.write({
        name: user_input_name,
        dob: user_input_dob,
        phone: user_input_phone,
        address: user_input_address,

      })


      var question = readlineSync.question("To quit, press q. To add another patient, press enter.")
      if(question.toLowerCase() === 'q') {
        break
      }
    }

  call.end()

} else if(action === 4) {
  // Service 4 - rpc getBloodResults
  // server side streaming

  var call = client4.getBloodResults({ });

  console.log("The patient blood results are:")
  //this function will be invoked when data is received from the server
  call.on('data', function(response) {
     console.log("Name: " + response.patientName + ", Date blood test taken: " + response.date + ", White Blood Cell Count: " + response.whiteBloodCellCount +
    ", Haemoglobin: " + response.haemoglobin + ", CRP: " + response.cReactiveProtein + ", Sodium: " + response.sodium + ", Potassium: " + response.potassium + ", Calcium: " +response.calcium + ".\n")
  })

  //this function will be invoked when the stream of data ends
  call.on('end', function() {

  })

//this function will be invoked when an error occurs
  call.on('error', function(e) {
    console.log("An error occurred")
  })

} else if(action === 5) {

  // Service 5 - rpc sendMessage
  // bidirectional streaming


  var name = readlineSync.question("What is your name?")
  var call = client5.sendMessage();

//this function will be invoked when data is received from the server
  call.on('data', function(response) {
    console.log(response.name + ": " + response.message)
  })

  //this function will be invoked when the stream of data ends
  call.on('end', function() {

  })

  //this function will be invoked when an error occurs
  call.on("error", function(e) {
    console.log("Cannot connect to chat server")
  })

  call.write({
    message: name + " joined the chat",
    name: name
  })

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.on("line", function(message) {
    if(message.toLowerCase() === "quit") {
      call.write({
        message: name + " left the chat",
        name: name
      })
      call.end()
      rl.close()
    } else {
      call.write({
        message: message,
        name: name
      })
    }
  })
}
