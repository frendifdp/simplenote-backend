'use strict'

module.exports = function(app){
    const controller = require('./controller');
    const response = require('./response');




    //GET
    app.get('/', response.welcome);
    app.get('/notes', controller.notes);
    app.get('/note/:id', controller.note);
    app.get('/categories', controller.categories);
    //rsapp.get('/notes/:off/:lim', controller.pagination);
    //POST
    app.post('/note', controller.newnote);
    app.post('/category', controller.newcategory);
    //PUT
    app.put('/note/:id', controller.putnote);
    //DELETE
    app.delete('/note/:id', controller.delnote);
    app.delete('/category/:id', controller.delcategory);

}