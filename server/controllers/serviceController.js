const db = require('../models')
const {Service} = db

exports.getAllServices = async (req, res, next) => {
  try {
    const services = await Service.findAll({})
    if (services) {
      return res.status(200).send({services})
    }
    res.status(400).send({message: 'Huoltoja ei löytynyt'})
  } catch (error) {
    res.status(400).send({error: 'Jokin meni pieleen'})
  }
}
