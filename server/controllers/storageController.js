const db = require('../models')
const {Storage} = db

exports.getAllItems = async (req, res, next) => {
  try {
    const items = await Storage.findAll({})
    if (items) {
      return res.status(200).send({items})
    }
    res.status(400).send({message: 'Tuotteita ei löytynyt'})
  } catch (error) {
    res.status(400).send({error: 'Jokin meni pieleen'})
  }
}
