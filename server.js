const express = require('express');
let moment = require('moment');
let os = require('os');

let ip = showObj(os.networkInterfaces());
let port = process.argv[2] || 3000;

let app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', {home: `${ip}:${port}`});
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
    console.log('访问地址为 http://%s:%s', ip, port);
});

function showObj(obj) {
    for (let devName in obj) {
        let iface = obj[devName];
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}
