const Enmap = require('enmap');

module.exports = {
    'registeredUsers': new Enmap({
        name: 'registeredUsers'
    }),
    'proposals': new Enmap({
        name: 'proposals'
    })
}
