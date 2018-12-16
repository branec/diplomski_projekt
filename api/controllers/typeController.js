'use strict';


exports.get_types = function (req, res) {
      global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();
        request.query('select * from Tip', function(err, recordset) {
            if (err)
            res.send(err);
      
            res.json(recordset.recordsets);
            sql.close();
        });
    });
}