'use strict'

module.exports = function(app){
    const controller = require('./controller');
    //GET
    app.get('/note/get', controller.noteget);



    //POST
    app.post('/note/post', controller.notepost);

    //PATCH
    app.patch('/note/patch', controller.notepatch);

    //DELETE
    app.delete('/note/delete', controller.notedelete);
}