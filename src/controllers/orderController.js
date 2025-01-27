const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// @desc    Crear un nuevo pedido
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice
    } = req.body;

    // Verificar stock de productos
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Producto ${item.product} no encontrado` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Producto ${product.name} no tiene suficiente stock` 
        });
      }

      // Reducir stock
      product.stock -= item.quantity;
      product.inStock = product.stock > 0;
      await product.save();
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear pedido', error: error.message });
  }
};

// @desc    Obtener pedidos del usuario
// @route   GET /api/orders/myorders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos', error: error.message });
  }
};

// @desc    Obtener pedido por ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedido', error: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById
};