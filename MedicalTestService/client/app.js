var readlineSync = require('readline-sync')
var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/medical_test.proto"

var packageDefinition = protoLoader.loadSync(PROTO_PATH)
var medical_test_proto = grpc.loadPackageDefinition(packageDefinition).medical_test
var client = new medical_test_proto.MedicalTestService("0.0.0.0:40000", grpc.credentials.createInsecure());


var call = client.getTestsCost(function(error, response) {
  if(error) {
    console.log("An error occurred,")
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
