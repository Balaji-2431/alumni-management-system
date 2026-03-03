const Job = require("../models/Job"); 
const factory = require("./factoryController"); 

exports.createJob = factory.createOne(Job, "Job"); 
exports.getJobs = factory.getAll(Job); 
exports.getJobById = factory.getOne(Job); 
exports.approveJob = factory.approveOne(Job); 
exports.deleteJob = factory.deleteOne(Job);