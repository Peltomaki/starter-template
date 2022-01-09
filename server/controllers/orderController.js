const db = require('../models')
const {Order} = db

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({})
    if (orders) {
      return res.status(200).send({orders})
    }
    res.status(400).send({message: 'Tuotteita ei löytynyt'})
  } catch (error) {
    res.status(400).send({error: 'Jokin meni pieleen'})
  }
}
