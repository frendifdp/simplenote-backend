'use strict'

const connection = require('./connect');

//GET
exports.noteget = function (req, res) {



    connection.query(`
        SELECT n.title as title, n.note as note, n.time as time, c.category as category FROM
        note as n INNER JOIN category as c ON n.category=c.id GROUP BY n.category`,
        function (error, rows, field){
            if(error) throw error
            else{
                return res.json(rows);
            }
        }
    );
}


exports.notepost = function (req, res) {
    let category = req.body.category;
    connection.query('INSERT INTO category SET category=?', [category],
    function(error, rows, field){
        if(error) throw
        else{
            
        }
    })
}