/**
 * Created by benja on 13-06-2017.
 */
//Vista agregar inst.
exports.add_inst = function(req, res){
    if(req.session.isAdminLogged){
        res.render('add_inst',{page_title:"Agregar Institución"});
    }
    else res.redirect('/bad_login');
};
//Vista lista de instituciones.
exports.list = function(req, res){
    if(req.session.isAdminLogged){
        req.getConnection(function(err,connection){

            var query = connection.query('SELECT * FROM institucion',function(err,rows)
            {

                if(err)
                    console.log("Error Selecting : %s ",err );

                res.render('instit_list',{page_title:"Instituciones",data:rows, usr:req.session.user});

            });
            //console.log(query.sql);
        });
    }
    else res.redirect('/bad_login');
};
//Vista detalle observatorio.
exports.admin_obs = function(req, res){
    if(req.session.isAdminLogged){
        req.getConnection(function(err,connection){

            var query = connection.query('SELECT * FROM observatorio WHERE idobservatorio = ?',req.params.idobs,function(err,obs)
            {
                if(err)
                    console.log("Error Selecting : %s ",err );
                connection.query("SELECT user.*,COUNT(post.idpost) AS posts FROM user LEFT JOIN ciudadano ON ciudadano.iduser = user.iduser LEFT JOIN post ON post.iduser = user.iduser" +
                    " WHERE ciudadano.idobs = ? GROUP BY user.iduser",req.params.idobs,function(err,users){
                    if(err)
                        console.log("Error Selecting : %s ",err );
                    connection.query("SELECT proyecto.*,user.username,evento.nombre, COUNT(userproyecto.iduser) AS ints FROM proyecto LEFT JOIN user ON user.iduser = proyecto.idcreador" +
                        " LEFT JOIN evento ON proyecto.idevento = evento.idevento LEFT JOIN userproyecto ON userproyecto.idproyecto = proyecto.idproyecto WHERE proyecto.idobservatorio = ? GROUP BY proyecto.idproyecto",req.params.idobs,function(err,proyects){
                        if(err)
                            console.log("Error Selecting : %s ",err );
                        res.render('admin/obs/admin_obs',{page_title:"Observatorios",obs:obs[0], usr:req.session.user,users: users,proyects: proyects});
                    });

                });

            });
            //console.log(query.sql);
        });
    }
    else res.redirect('/bad_login');
};
exports.obs_list = function(req, res){
    if(req.session.isAdminLogged){
        req.getConnection(function(err,connection){

            connection.query('SELECT observatorio.*,user.correo,COUNT(proyecto.idproyecto) AS proyectos, COUNT(ciudadano.iduser) AS cdds FROM observatorio LEFT JOIN user ON observatorio.idmonitor = user.iduser' +
                ' LEFT JOIN proyecto ON proyecto.idobservatorio = observatorio.idobservatorio LEFT JOIN ciudadano ON ciudadano.idobs = observatorio.idobservatorio WHERE observatorio.idinst = ? GROUP BY observatorio.idobservatorio',req.params.id,function(err,rows)
            {
                if(err)
                    console.log("Error Selecting : %s ",err );

                connection.query('SELECT * FROM institucion WHERE idinstitucion = ?',req.params.id,function(err,insts)
                {
                    if(err)
                        console.log("Error Selecting : %s ",err );

                    res.render('obs_list',{page_title:"Observatorios",data:rows,inst:insts[0], usr:req.session.user});

                });

            });
            //console.log(query.sql);
        });
    }
    else res.redirect('/bad_login');
};
// Logica agregar institucion y monitor principal.
exports.save = function(req,res){
    if(req.session.isAdminLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        req.getConnection(function (err, connection) {

            var inst_data = {
                correo : input.correo,
                fono : input.fono,
                nom   : input.nom,
                avatar_pat : "/assets/img/placeholder.png"
            };

            connection.query("INSERT INTO institucion SET ? ",inst_data, function(err, rows)
            {

                if (err)
                    console.log("Error inserting : %s ",err );

                res.redirect('/instit');

            });
            // console.log(query.sql); get raw query
        });
    }
    else res.redirect('/bad_login');
};
exports.inst_edit = function(req,res){
    if(req.session.isAdminLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        req.getConnection(function (err, connection) {

            var inst_data = {
                correo : input.correo,
                fono : input.fono,
                nom   : input.nom,
                comuna : input.comuna,
                direccion : input.direccion,
                avatar_pat : "/assets/img/placeholder.png"
            };
            console.log(input);
            connection.query("UPDATE institucion SET ? WHERE idinstitucion = ?",[inst_data,input.id], function(err, rows)
            {

                if (err)
                    console.log("Error inserting : %s ",err );

                res.redirect('/instit');

            });
            // console.log(query.sql); get raw query
        });
    }
    else res.redirect('/bad_login');
};
// Logica agregar observatorio.
// Estado:
//      1 - Inactivo
//      2 - Activo
//      3 - Archivado
exports.obs_save = function(req,res){
    if(req.session.isAdminLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        req.getConnection(function (err, connection) {

            var data = {
                estado : 1,
                nom   : input.nom,
                avatar_pat : "/assets/img/placeholder.png",
                max : input.maxim,
                idinst : input.id,
                idmonitor : input.idmonit
            };

            connection.query("INSERT INTO observatorio SET ? ",data, function(err, rows)
            {

                if (err)
                    console.log("Error inserting : %s ",err );

                res.redirect('/obs/' + input.id);

            });
            // console.log(query.sql); get raw query
        });
    }
    else res.redirect('/bad_login');
};
