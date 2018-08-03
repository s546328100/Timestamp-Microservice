const express = require('express');
let moment = require('moment');
const http = require('http');

let port = process.argv[2] || 3000;

let app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    http.get('http://members.3322.org/dyndns/getip', res1 => {
        res1.setEncoding('utf8');
        let rawData = '';
        res1.on('data', chunk => {
            rawData += chunk;
        });
        res1.on('end', () => {
            rawData = rawData.trim();
            console.log(rawData);
            res.render('index', {home: `${rawData}:${port}`});
        });
    }).on('error', e => {
        return res.send(e);
    });
});

app.get('/:id', (req, res) => {
    if (req.path === '/favicon.ico') return;
    let id = req.params.id;

    let result = {unix: null, natural: null};
    if (isNaN(id)) {
        if (!isNaN(Date.parse(id))) {
            let date = new Date(id);
            result.unix = moment(date).unix();
            result.natural = moment(date).format('LL');
        }
    } else {
        result.unix = +id;
        result.natural = moment(new Date(id * 1000)).format('LL');
    }

    return res.json(result);
});

app.listen(port, () => {
    console.log('listen to port: %s', port);
});
