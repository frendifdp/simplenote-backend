'use strict'

exports.welcome = function (values, res) {
    const data = {
        message: "Welcome to simplenotes",
    };

    
    res.json(data);
    res.end();
}