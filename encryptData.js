const fs = require('fs');
const Blowfish = require('javascript-blowfish');

let key = fs.readFileSync('./.key').toString();
let secret = fs.readFileSync('./Dashlane Export.json').toString();
let vector = 'cbcvector';

const bf = new Blowfish(key, 'cbc');

let encrypted = bf.encrypt(secret, vector);
let encrypted64 = bf.base64Encode(encrypted);

//console.log(encrypted64);

fs.writeFileSync('./encrypted-data.txt', encrypted64);