const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Smark_schema = Schema({
    mark:  {type:String, requerid:true},
})

//Exporto modelo
module.exports = mongoose.model('select_mark',Smark_schema);