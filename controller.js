'use strict'

const connection = require('./connect');
const response = require('./response');

//INSERT INTO note SET title=?' BETTER than
//INSERT INTO note SET title='${title}'
//GET
exports.tes = function (req, res){
    response.ok('Welcome!', res);
}

let sql = `SELECT n.id as id, n.title as title, n.note as note, n.time as time, c.category as category, c.id as categoryId
    FROM note as n INNER JOIN category as c ON n.category=c.id `;

exports.notes = function (req, res){
    let search = req.query.search || "";
    let sort = req.query.sort || "DESC";
    var lim = req.query.limit || 10;
    var off = (req.query.page - 1) * lim || 0;
    if(off < 0){
        off = 1;
    }
    var pageSql = `LIMIT `+ lim +` OFFSET `+ off;
    var totalData;
    var maxPage;

    let countSql = `SELECT COUNT(id) as total FROM note WHERE title LIKE '%${search}%'`;
    connection.query(countSql, function(error, row, field){
        totalData = row[0].total;
        maxPage = Math.ceil(Number(totalData) / lim);
    });
    sort = sort.toUpperCase();
    if(sort == 'DESC' || sort == 'ASC'){
        let ssql = sql + `WHERE n.title LIKE '%${search}%' ORDER BY n.time ${sort} ${pageSql}`;
        connection.query(ssql, function(error, rows, field){
            var data = new Array;
            data = {"total": totalData, "page": Number(req.query.page) || 1,
            "totalPage": maxPage, "limit" : Number(lim) };
            //"data_found": rows.length,
            var output = {"data": rows, "info": data, "totalPage": maxPage}
            //rows.push(data);
            if(totalData == 0){
                res.send({data:"404 not found"})
            }
            else if(req.query.page > maxPage){
                res.send([{data: "no data left", col: 0}])
            }
            else{
                res.json(output);
            }
        })
    }
    else{
        res.send({"sort" : false});
    }
}
exports.note = function (req, res) {
    let id = req.params.id || "";
    let ssql = sql + `WHERE n.id='${id}'`;
    connection.query(ssql,
        function (error, rows, field){
            if(id == ""){
                res.json({"message": "404 not found"});
            }
            else{
                if(error) throw error
                else if(rows.length == 0){
                    res.send({message: "no data found"})
                }
                else{
                    res.json(rows);
                }
            }
        }
    );
}

exports.categories = function (req, res) {
    let sql = `SELECT * FROM category`;
    connection.query(sql, function(error, rows){
        if(error) throw error;
        else{
            res.json(rows);
        }
    })
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
        res.send({
            status: "failed",
            message: "field required",
        })
    }
    if(title == "" && note == "" && category == ""){
        res.send({
            status: "failed",
            message: "field required",
        })
    }
    else{
        let sql = `INSERT INTO note SET title='${title}', note='${note}', category='${category}'`;
        console.log(sql);
        connection.query(sql, function(a, b, c){
            return res.send({
                status: 200,
                message: "note has been added",
            })
        })
    }
}

exports.newcategory = function(req, res){
    let category = req.body.category;
    let iconuri = req.body.iconuri;
    let sql = `INSERT INTO category SET category='${category}', icon='${iconuri}'`;
    connection.query(sql, function(error, rows, field){
        if(error) throw error
        else{
            return res.send({
                status: 200,
                message: "category has been added",
            })
        }
    })

}

//PUT
exports.putnote = function(req, res){
    let title = req.body.title;
    let note = req.body.note;
    let category = req.body.category;
    let id = req.params.id || "";
    if(typeof(title) == 'undefined' && typeof(note) == 'undefined' && typeof(category) == 'undefined'){
        return res.send({
            status: "failed",
            message: "field required",
        })
    }
    else if(id == ""){
        return res.send({
            status: "failed",
            message: "id required",
        })
    }
    else{
        let sql = `UPDATE note SET title='${title}', note='${note}', category='${category}' WHERE id='${id}'`
        console.log(sql)
        connection.query(sql, function(error, rows, field){
            return res.send([{
                status: 200,
                message: "note has been updated",
                data: [{
                    id: id,
                    title: title,
                    note: note,
                    category: category
                }]
            }])
        })
    }
}

//DELETE
exports.delnote = function(req, res){
    let id = req.params.id || "";
    if(id == ""){
        return res.send({
            status: "failed",
            message: "id required",
        })
    }
    else{
        let sql = `DELETE FROM note WHERE id='${id}'`;
        connection.query(sql, function (error, row) {
            if(error) throw error
            else {
                return res.send({
                    status: 200,
                    message: "note has been deleted",
                })
            }
        })
    }
}

exports.delcategory = function(req, res){
    let id = req.params.id || "";
    if(id == ""){
        return res.send({
            status: "failed",
            message: "id required",
        })
    }
    else{
        let sql = `DELETE FROM category WHERE id='${id}'`;
        connection.query(sql, function (error, row) {
            if(error) throw error
            else {
                return res.send({
                    status: 200,
                    message: "category has been deleted",
                })
            }
        })
    }
}
