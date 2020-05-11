const express = require("express");
var ObjectId = require('mongoose').Types.ObjectId;
const path = require('path');
const bcrypt = require('bcryptjs');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const Tools = require('../public/ObjExport')
const BackValidate = require('../public/Back_Validate')



//Shemas
const User = require('../schemas/Users')
const Products = require('../schemas/Products')
const List = require('../schemas/Lists')
const Sel_Product = require('../schemas/Select_product')
const Sel_Mark = require('../schemas/Select_mark')


//Creo el obj router
const router = express.Router();




router.get('/login', IsNotAuthenticated,function (req, res) {
  res.status(200).render('../views/login')
})//end get

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/home',
  failureRedirect: '/login',
  passReqToCallback: true
}))//end post

router.get("/logout", IsAuthenticated, function (req, res) {
  req.logOut();
  res.redirect('/login');
})//end get

router.get('/home',IsAuthenticated ,async function (req, res) {
  let shops = await User.where({active:true, _id:ObjectId(req.user.id)})

  let array = []
  shops.forEach(e => {
    e.shops.forEach(f => {
      array.push({
        name:f.name,
        adress:f.adress,
        list:f.list
      })
    })//end for2
  })//end for

  console.log(array)
  res.status(200).render('../views/home',{user: req.user.username, pin:123, id_user:req.user.id, shops:array})
})//end get

router.get('/crearLista' ,async function (req, res) {
  let sel_product = await Sel_Product.where({})
  let sel_mark = await Sel_Mark.where({})

  res.status(200).render('../views/crear_lista',{user: req.user.username, sel_product, sel_mark})
})//end get







router.post('/CrearComercio' ,async function (req, res) {
  //Validacion
  if(!BackValidate.Obj.Data(req.body.id, ['string'])){
    res.status(401).end()
    return false
  }
  if(!BackValidate.Obj.Data(req.body.comercio, ['string'])){
    res.status(401).end()
    return false
  }
  if(!BackValidate.Obj.Data(req.body.direccion, ['string'])){
    res.status(401).end()
    return false
  }

  let user = await User.where({active:true, _id:ObjectId(req.body.id)})
  if(user.length !== 1){
    //usuario inexistente
    res.sendStatus(402).end()
    return false
  }

  //Controla que NO exista el comercio
  if(Tools.Obj.findValueInObjectArray(user[0].shops, req.body.comercio)){
    //comercio inexistente
    res.sendStatus(403).end()
    return false
  }

  //Controla que NO exista la direccion
  if(Tools.Obj.findValueInObjectArray(user[0].shops, req.body.direccion)){
    //direccion inexistente
    res.sendStatus(403).end()
    return false
  }
  
  //si no existe
  await User.updateOne({active:true, _id:ObjectId(req.body.id)},{$push: {shops: {name:req.body.comercio, 
    adress:req.body.direccion, list:''}} })
  console.log('Creacion de Comercio Exitosa...')
  res.sendStatus(200).end()
  return false

})//end post


router.delete('/EliminarComercio', async (req, res) => {
  //Validacion
  if(!BackValidate.Obj.Data(req.body.id, ['string'])){
    res.status(401).end()
    return false
  }
  if(!BackValidate.Obj.Data(req.body.comercio, ['string'])){
    res.status(401).end()
    return false
  }

  //Corlola que exista el usuario
  let user = await User.where({active:true, _id:ObjectId(req.body.id)})
  if(user.length !== 1){
    //usuario inexistente
    res.sendStatus(402).end()
    return false
  }

  //Controla que exista el comercio
  if(!Tools.Obj.findValueInObjectArray(user[0].shops, req.body.comercio)){
    //comercio inexistente
    res.sendStatus(403).end()
    return false
  }

  //Elimino Comercio
  await User.updateOne({active:true, _id:ObjectId(req.body.id)},{$pull: {shops: {name:req.body.comercio}} })
  console.log('Eliminacion Exitosa...')
  res.sendStatus(200).end()
  
})//end





router.post('/crearProducto' ,async function (req, res) {
  console.log(req.body)
  res.sendStatus(200)
})//end get






router.get('/api/marcas',async (req, res) => {
  let array = []
  let consult = await Products.where({active:true}).sort({mark:1})
  consult.forEach(e => {
      array.push({
          product:e.mark.toUpperCase()+ ' ' + e.product,
          price:e.price
      })
  })//end
  //console.log(array)
  res.status(200).json(array)
})

router.get('/api/productos',async (req, res) => {
  let array = []
  let consult = await Products.where({active:true}).sort({product:1})
  consult.forEach(e => {
      array.push({
          product:e.product.toUpperCase()+ ' ' + e.mark,
          price:e.price
      })
  })//end
  //console.log(array)
  res.status(200).json(array)
})

router.get('/api/nombres',async (req, res) => {
  let array = []
  let consult = await Products.where({active:true}).sort({name:1})
  consult.forEach(e => {
      array.push({
          product:e.name.toUpperCase()+ ' ' + e.mark,
          price:e.price
      })
  })//end
  //console.log(array)
  res.status(200).json(array)
})


router.get('/cargarUsuario',  (req, res) => {
  let user = new User()
  user.username = 'juan'
  user.password = bcrypt.hashSync('123', 10)
  user.pin = '1221'
  user.save()
  res.send('ok')
})//end get




























//Functions
function IsAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

function IsNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/home");
  }
}

//Exporto las rutas
module.exports = router;
