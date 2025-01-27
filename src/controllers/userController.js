const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// @desc    Registrar un nuevo usuario
// @route   POST /api/users
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: 'Usuario ya existe' });
    return;
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Datos de usuario inválidos' });
  }
};

// @desc    Autenticar usuario
// @route   POST /api/users/login
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Email o contraseña inválidos' });
  }
};

// @desc    Obtener perfil de usuario
// @route   GET /api/users/profile
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
};

// @desc    Actualizar perfil de usuario
// @route   PUT /api/users/profile
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
};

// @desc    Cambiar contraseña
// @route   POST /api/users/change-password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (user && (await user.matchPassword(currentPassword))) {
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Contraseña cambiada exitosamente' });
  } else {
    res.status(400).json({ message: 'Contraseña actual incorrecta' });
  }
};

// @desc    Eliminar cuenta de usuario
// @route   DELETE /api/users/account
const deleteAccount = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    await user.remove();
    res.json({ message: 'Cuenta eliminada exitosamente' });
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
};

module.exports = { 
  registerUser, 
  authUser, 
  getUserProfile, 
  updateUserProfile, 
  changePassword, 
  deleteAccount 
};