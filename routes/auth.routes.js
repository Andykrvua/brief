const { Router } = require('express');
const User = require('./../models/User');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

const router = Router();

// /api/auth - current route + ...
// registration page
router.post(
  '/register',
  // validation fields
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 3 символа').isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации',
        });
      }

      // get fields
      const { email, password } = req.body;

      // search user with email
      const candidate = await User.findOne({ email });
      if (candidate) {
        return res.status(400).json({ message: 'Такой email уже существует' });
      }

      // password crypt
      const hashedPassword = await bcrypt.hash(password, 12);

      // create user
      const user = new User({ email, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: 'Пользователь успешно создан' });
    } catch (e) {
      res.status(500).json({ message: 'Ошибка запроса регистрации' });
    }
  }
);

// authentication page
router.post(
  '/login',
  // validation fields
  [
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные авторизации',
        });
      }

      // get fields
      const { email, password } = req.body;

      // search user with email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Нет такого пользователя' });
      }

      // check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Неправильный пароль' });
      }

      // create token
      const token = jwt.sign({ userID: user.id }, config.get('jwtSecret'), {
        expiresIn: '1h',
      });

      // push token and user id
      res.json({ token, userID: user.id });
    } catch (e) {
      res.status(500).json({ message: 'Ошибка запроса авторизации' });
    }
  }
);

module.exports = router;
