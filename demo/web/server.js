"use strict"

const express = require('express');
const app = express();
const fs = require('fs');

console.log(`Server START`);

const list = ['page', 'navigator', 'sidebar', 'tabs', 'toucharea', 'form'];

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/welcome.html`);
  });

list.forEach(demo => {
  app.get(`/${demo}`, (req, res) => {
    res.sendFile(`${__dirname}/${demo}.html`);
  });
});

const server = app.listen('8080', 'localhost', () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log (` Server is running at http://${host}:${port}`);
});