var readlineSync = require('readline-sync')
var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/medical_test"

var packageDefinition = protoLoader.loadSync(PROTO_PATH)
var medical_test_proto = grpc.loadPackageDefinition(packageDefinition).medical_test
var client = new proto.MedicalTestService("0.0.0.0:40000", grpc.credentials.createInsecure());
