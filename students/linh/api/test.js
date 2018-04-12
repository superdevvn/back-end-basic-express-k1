
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
// var temp = list;
// for (var i = 0; i < list.length - 1; i++) {
//     for (var j = i + 1; j < list.length; j++) {
//         if (list[i].birthdate < list[j].birthdate) {
//             var temp = list[i];
//             list[i] = list[j];
//             list[j] = temp;
//         }
//     }
// }
// var len = list.length - 1;
// li = list.reverse();
// while(len !== 0){
//     li.push(list[len-1]);
//     len--;
// }
console.log(list);

