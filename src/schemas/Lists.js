const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const list_schema = Schema({
    name_list:              {type:String,   requerid:true},
    name_product:           {type:String,   requerid:true},
    price:                  {type:Number,   requerid:true},
    mark:                   {type:String,   requerid:true},
    product:                {type:String,   requerid:true},
    active:                 {type:Boolean,  requerid:true, default:true},
    low_motive:             {type:String,   default:''}
})

//Exporto modelo
module.exports = mongoose.model('list',list_schema);