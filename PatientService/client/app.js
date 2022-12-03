var readLineSync = require('readline-sync')
var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/patient.proto"

var packageDefinition = protoLoader.loadSync(PROTO_PATH)
var patient_proto = grpc.loadPackageDefinition(packageDefinition).patient
var client = new patient_proto.PatientService("0.0.0.0:40000", grpc.credentials.createInsecure())


var call = client.addNewPatient(function(error, response) {
  if(error) {
    console.log("An error occurred.")
  } else {
    console.log(response.message + response.numOfPatientsAdded)
  }
})


while(true) {

  var user_input_name = readLineSync.question("Enter the patient's name: ")
  var user_input_dob = readLineSync.question("Enter the patient's date of birth in the format dd-mm-yyyy: ")
  var user_input_phone = readLineSync.question("Enter the patient's phone number: ")
  var user_input_address = readLineSync.question("Enter the patient's address: ")

  call.write({
    name: user_input_name,
    dob: user_input_dob,
    phone: user_input_phone,
    address: user_input_address,

  })


  var question = readLineSync.question("To quit, press q. To add another patient, press enter.")
  if(question.toLowerCase() === 'q') {
    break
  }
}

call.end()
