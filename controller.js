'use strict'

const connection = require('./connect');
const response = require('./response');





//GET
exports.tes = function (req, res){
    response.ok('Welcome!', res);
}

let sql = `SELECT n.id as id, n.title as title, n.note as note, n.time as time, c.category as category
    FROM note as n INNER JOIN category as c ON n.category=c.id `;

exports.notes = function (req, res){
    //console.log(JSON.stringify(req.query));
    let search = req.query.search || "";
    let sort = req.query.sort || "ASC";
    var lim = 5;
    if(typeof(req.query.page) == 'undefined' || req.query.page == ""){
        var pageSql = '';
    }
    else{
        var off = (req.query.page - 1) * lim;
        var pageSql = `LIMIT `+ lim +` OFFSET `+ off;
        //console.log(pageSql)
    }
    //console.log(pageSql)
    var totalData;
    var maxPage;
    let countSql = `SELECT COUNT(id) as total FROM note`;
    connection.query(countSql, function(error, rows, field){
        totalData = rows[0].total;
        maxPage = Math.ceil(Number(totalData) / lim);
    });
    //console.log(totalData)
    let ssql = sql + `WHERE n.title LIKE '%${search}%' ORDER BY n.time ${sort} ${pageSql}`;
    connection.query(ssql, function(error, rows, field){
        var data = new Array;
        data = {"total": totalData, "page": Number(req.query.page) || 1,
         "totalPage": maxPage, "limit" : lim };
        //"data_found": rows.length,
        var output = {"data": rows, "info": data}
        //rows.push(data);
        return res.json(output);
    })
}
exports.note = function (req, res) {
    let id = req.params.id;
    let ssql = sql + `WHERE n.id='${id}'`;
    connection.query(ssql,
        function (error, rows, field){
            if(error) throw error
            else{
                return res.json(rows);
            }
        }
    );
}

// exports.pagination = function (req, res) {
//     let lim = req.params.lim;
//     let off = req.params.off;
//     let ssql = sql + `LIMIT ${lim} OFFSET ${off}`
//     connection.query(ssql, function(error, rows, field){
//         res.json(rows);
//     })
// }
//POST
exports.newnote = function (req, res) {
    let title = req.body.title;
    let note = req.body.note;
    let category = req.body.category;
    if(typeof(title) == 'undefined' && typeof(note) == 'undefined' && typeof(category) == 'undefined'){
        return res.send({
            status: "failed",
            message: "field required",
        })
    }
    if(title == "" && note == "" && category == ""){
        return res.send({
            status: "failed",
            message: "field required",
        })
    }
    else{
        let sql = `INSERT INTO category SET category='${category}'`;
        connection.query(sql, function(error, rows, field){
            if(error) throw error
            else{
                let sql = `INSERT INTO note SET title='${title}', note='${note}', category='${rows.insertId}'`;
                connection.query(sql,
                function(a, b, c){
                    return res.send({
                        status: 200,
                        message: "note has been added",
                    })
                })
            }
        })
    }
}

//PUT
exports.putnote = function(req, res){
    let title = req.body.title;
    let note = req.body.note;
    let category = req.body.category;
    let id = req.params.id;
    if(typeof(title) == 'undefined' && typeof(note) == 'undefined' && typeof(category) == 'undefined'){
        return res.send({
            status: "failed",
            message: "field required",
        })
    }
    else{
        let sql = `UPDATE note SET title='${title}', note='${note}' WHERE id='${id}'`
        connection.query(sql, function(error, rows, field){
            let sql = `SELECT category as id FROM note WHERE id='${id}'`
            connection.query(sql, function (error, row) {
                let sql = `UPDATE category SET category='${category}' WHERE id='${row[0].id}'`
                //console.log(sql)
                connection.query(sql, function () {
                    return res.send({
                        status: 200,
                        message: "note has been updated",
                    })
                })
            })
        })
    }
}

//DELETE
exports.delnote = function(req, res){
    let id = req.params.id;
    if(typeof(id) == 'undefined' || id == ""){
        return res.send({
            status: "failed",
            message: "id required",
        })
    }
    else{
        let sql = `DELETE FROM note WHERE id='${id}'`;
        connection.query(sql, function (error, rows, field) {
                return res.send({
                    status: 200,
                    message: "note has been deleted",
                })
            }
        )
    }
}