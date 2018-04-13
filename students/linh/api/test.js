
var users = require('./models/users.js').User;

var a = {
    'name': 'linh',
    'mssv': '1512288',
    'birthdate': 12
};
var list = [];
var li = [];
var b = {
    'name': 'linh1',
    'mssv': '15122881',
    'birthdate': 14
};
list.push(a);
list.push(b);
list.push(1);
list.push('linh');
console.log(list);

