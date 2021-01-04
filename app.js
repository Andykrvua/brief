const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

const app = express();
app.use('/api/auth', require('./routes/auth.routes'));

const PORT = config.get('port') || 5000;

async function start() {
  try {
    // check db connection
    await mongoose.connect(config.get('mongoUri'), {
      // base param for connection
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    // listen port
    app.listen(PORT, () => {
      console.log(`App working! ${PORT}`);
    });
  } catch (e) {
    console.log('Server Error', e.message);
    // end process if error
    process.exit(1);
  }
}

start();
