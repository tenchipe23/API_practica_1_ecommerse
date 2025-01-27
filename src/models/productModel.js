const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  originalPrice: { 
    type: Number 
  },
  image: { 
    type: String 
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category' 
  },
  stock: { 
    type: Number, 
    default: 0 
  },
  inStock: { 
    type: Boolean, 
    default: true 
  },
  discount: { 
    type: Number 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);