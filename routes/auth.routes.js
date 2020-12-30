const { Router } = require('express');
const User = require('./../models/User');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const router = Router();

// /api/auth - current route + ...
router.post(
  '/register',
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

      const { email, password } = req.body;

      const candidate = await User.findOne({ email });
      if (candidate) {
        return res.status(400).json({ message: 'Такой email уже существует' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({ email, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: 'Пользователь успешно создан' });
    } catch (e) {
      res.status(500).json({ message: 'Ошибка запроса регистрации' });
    }
  }
);

router.post(
  '/login',
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

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Нет такого пользователя' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Неправильный пароль' });
      }

      res.status(201).json({ message: 'Пользователь успешно создан' });
    } catch (e) {
      res.status(500).json({ message: 'Ошибка запроса авторизации' });
    }
  }
);

module.exports = router;
