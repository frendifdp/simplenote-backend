'use strict'

const connection = require('./connect');
const response = require('./response');

//GET



exports.tes = function (req, res){
    response.ok('Welcome!', res);
}


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
    let title = req.body.title;
    let note = req.body.note;
    let category = req.body.category;
    if(title == "" && note == "" && category == ""){
        return res.send({
            status: "failed",
            message: "field required",
        })
    }
    else{
        connection.query(`INSERT INTO category SET category=?`, [category],
        function(error, rows, field){
            if(error) throw error
            else{
                connection.query(`INSERT INTO note SET title=?, note=?, category=?`,
                [title, note, rows.insertId],
                function(erro, row, fiel){
                    return res.send({
                        status: 200,
                        message: "note has been added",
                    })
                })
            }
        })
    }
}