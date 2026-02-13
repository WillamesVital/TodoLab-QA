const express = require('express');
const { resetAllData } = require('../db');

const router = express.Router();

router.post('/reset', (req, res) => {
  if (process.env.NODE_ENV !== 'test') {
    return res.status(404).json({ error: 'Rota não encontrada' });
  }

  resetAllData();
  return res.status(204).send();
});

module.exports = router;
