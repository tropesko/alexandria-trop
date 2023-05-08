const express = require('express');
const app = express.Router();
const request = require('request');
const pool = require('../../db');
const geoip = require('geoip-lite');
// const moment = require('moment-timezone');


const languages = ['JavaScript', 'Python', 'Java', 'Go', 'Ruby'];
const headers = {
  'User-Agent': 'request'
}

// Rota para buscar e armazenar repositórios destacados de 5 linguagens à sua escolha
app.post('/save-top-repositories', async (req, res) => {
  const repos = [];
  languages.forEach((language) => {
    const options = {
      url: `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc`,
      headers: headers
    };

    request(options, async (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const data = JSON.parse(body);
        const topRepo = data.items[0];
        repos.push(topRepo);

        const { id, node_id, name, full_name, description, url, language,  } = topRepo;

        const query = {
          text: 'INSERT INTO repositories(github_id, node_id, name, full_name, description, url, language) VALUES($1, $2, $3, $4, $5, $6, $7)',
          values: [id, node_id, name, full_name, description, url, language],
        };
        await pool.query(query);

        if (repos.length === languages.length) {
          console.log('Repositories successfully saved.')
          res.json(repos);
        }
      }
    });
  });
});

// Rota para listar os repositórios encontrados
app.get('/repositories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM repositories');

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Rota para visualizar os detalhes de cada repositório
app.get('/repository/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query('SELECT * FROM repositories where github_id = $1', [id]);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Rota para favoritar/desfavoritar repositórios, salvando
// a data, hora e IP usado para realizar a operação
app.post('/favorite/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const query = await pool.query('SELECT * FROM favorites where github_id = $1', [id]);

    // Se não existe ainda na tabela de favoritos, cria uma nova entry
    if (!query.rowCount) {
      const isFavorite = true;

      const ip = req.socket.remoteAddress;
      const geo = geoip.lookup(ip);
      const timezone = geo && geo.timezone;

      d = new Date();
      datetext = d.toTimeString();
      datetext = datetext.split(' ')[0];

      const result = await pool.query(
        'INSERT INTO favorites (github_id, is_favorite, ip, timezone, date, hour) VALUES ($1, $2, $3, $4, $5, $6)',
        [id, isFavorite, ip, timezone, d, datetext]
      );

      console.log('Repository favorited.')
      res.json({ id: req.params.id, isFavorite: isFavorite, message: 'Success' });
    } else {
      // se já existe, apenas inverte se é favorito ou não
      const isFavorite = !query.rows[0]['is_favorite']
      await pool.query('UPDATE favorites SET is_favorite = $1 where github_id = $2', [isFavorite, id]);
      res.json({ id: req.params.id, isFavorite: isFavorite, message: 'Success' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Rota para listar os repositórios favoritados, mostrando a data e hora em que foram
// favoritados no fuso horário do usuário com base no ip utilizado no momento da consulta.
app.get('/favorites', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM favorites where is_favorite = true')

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

module.exports = app;
