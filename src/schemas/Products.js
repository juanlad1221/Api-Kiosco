const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const product_schema = Schema({
    name:                   {type:String,   requerid:true},
    price:                  {type:Number,   requerid:true},
    mark:                   {type:String,   requerid:true},
    product:                   {type:String,   requerid:true},
    active:                 {type:Boolean,  requerid:true, default:true},
    low_motive:             {type:String,   default:''}
})

//Exporto modelo
module.exports = mongoose.model('products',product_schema);