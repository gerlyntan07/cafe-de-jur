const express = require('express');
const ImageKit = require('imagekit');
const router = express.Router();
require('dotenv').config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

router.get('/auth', (req, res) => {
  const authParams = imagekit.getAuthenticationParameters();
  res.send(authParams);
});

module.exports = router;
