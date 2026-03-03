const Event = require("../models/Event"); 
const factory = require("./factoryController"); 

exports.createEvent = factory.createOne(Event, "Event"); 
exports.getEvents = factory.getAll(Event); 
exports.getEventById = factory.getOne(Event); 
exports.approveEvent = factory.approveOne(Event); 
exports.deleteEvent = factory.deleteOne(Event);