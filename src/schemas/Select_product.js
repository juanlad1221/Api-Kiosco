const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Sproduct_schema = Schema({
    product:  {type:String, requerid:true},
})

//Exporto modelo
module.exports = mongoose.model('select_products',Sproduct_schema);