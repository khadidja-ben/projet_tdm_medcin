var express = require("express");
var mysql = require("mysql");
var md5 = require('md5');
var app = express();
app.use(express.static('public'));
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.raw());

// data base connection: par défaut le mot de passe est ''
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database :'tdm'
});
connection.connect();

//******************************************************** PATIENT SERVICE ****************************************************/

// get all doctors 
app.get('/patient',function(req,res){  
    var query = "select * from patients";
    connection.query(query,function(error,results){
        if (error) { 
            throw(error) 
        }else{
            res.send(JSON.stringify(results));
        }
    })
});

// get patient by Id 
app.get('/patient/:id',function(req,res){  
    var data = Object() 
    var query = "select * from patients where idPatient=?";
    connection.query(query,[req.params.id],function(error,results){
        if (error) { 
            throw(error) 
        } else {
            if(results.length>0) {
                data = results[0]
            }
            res.send(JSON.stringify(data));
        }
    })
});

// add a new patient
app.post('/patient',function(req,res){ 
    var query = "INSERT  INTO patients (name, lastName, age, phone, image) VALUES (?,?,?,?,?)";
    connection.query(query,[req.body.name,
                            req.body.lastName, 
                            req.body.age, 
                            req.body.phone, 
                            req.body.image, ],
                            function(error,results){
    if(error) {
       next(error) 
    }
    else {
    res.send(JSON.stringify('patient added successfully 💜'));
        }
    })  
});

// authentification for a patient (using the hashing function md5)
app.post('/patientAuth',function(req,res){  
    var query = "select * from authpatient where phone=? and password=?";
    connection.query(query,[req.body.phone,req.body.pwd],function(error,results){
        if (error) { 
            throw(error) 
        }else{
            res.send(JSON.stringify(results));
        }
    })

});

//*********************************************** ADVICE SERVICE *****************************************************/

// get all advices 
app.get('/advice',function(req,res){  
    var query = "select * from advice";
    connection.query(query,function(error,results){
        if (error) { 
            throw(error) 
        }else{
            res.send(JSON.stringify(results));
        }
    })
});

// get advice by Id advice
app.get('/advice/:id',function(req,res){  
    var data = Object() 
    var query = "select * from advice where idAdvice=?";
    connection.query(query,[req.params.id],function(error,results){
        if (error) { 
            throw(error) 
        } else {
            if(results.length>0) {
                data = results[0]
            }
            res.send(JSON.stringify(data));
        }
    })
});

// add one advice 
app.post('/advice',function(req,res){ 
    var query = "INSERT  INTO advice (idPatient, idDoctor, advice) VALUES (?,?,?)";
    connection.query(query,[req.body.idPatient,req.body.idDoctor, req.body.advice],function(error,results){
    
     if(error) {
       next(error) 
    }
    else {
     res.send(JSON.stringify('advice added successfully 💜'));
         }
     })  
});

// add a liste of advices 
app.post('/advices',function(req,res){  
    var advices = req.body
    var values = [];
    for(i in advices) {    
    values.push([advices[i].idPatient,advices[i].idDoctor, advices[i].advice]);
    }
    var query = "INSERT  INTO advice (idPatient, idDoctor, advice) values ?";
    connection.query(query,[values],function(error,results){
     if(error) {
        next(error)
    }
    else {
     res.send(JSON.stringify('advices added successfully 💜'));
        }
    })  
});

//*************************************************** BOOKINGS (RDV) SERVICE *********************************************/

// get all bookings 
app.get('/booking',function(req,res){  
    var query = "select * from bookings";
    connection.query(query,function(error,results){
        if (error) { 
            throw(error) 
        }else{
            res.send(JSON.stringify(results));
        }
    })
});

// get all bookings of a doctor (given id in parametres)
app.get('/bookingDoctor/:idDoctor',function(req,res){ 
    var query = "select * from  bookings natural join doctors where idDoctor=?"; 
    connection.query(query,[req.params.idDoctor],function(error,results){
        if (error) { 
            throw(error) 
        } else {
            res.send(JSON.stringify(results));
        }
    })
});

// get all bookings of a patient (given id in parametres)
app.get('/bookingPatient/:idPatient',function(req,res){ 
    var query = "select * from  bookings natural join patients where idPatient=?"; 
    connection.query(query,[req.params.idPatient],function(error,results){
        if (error) { 
            throw(error) 
        } else {
            res.send(JSON.stringify(results));
        }
    })
});

// get booking by Id booking
app.get('/booking/:id',function(req,res){  
    var data = Object() 
    var query = "select * from bookings where idBooking=?";
    connection.query(query,[req.params.id],function(error,results){
        if (error) { 
            throw(error) 
        } else {
            if(results.length>0) {
                data = results[0]
            }
            res.send(JSON.stringify(data));
        }
    })
});

// check if a booking already exists by testing if the date and time given by the user already exists 
app.get('/bookingExiste',function(req,res){  
    var query = "select bookingDate, bookingTime from bookings where bookingDate=? and bookingTime=?";
    connection.query(query,[req.body.bookingDate,req.body.bookingTime],function(error,results){
        console.log(results.length); 
        if (error) { 
            throw(error) 
        } else {
            if(results.length>0) {
                console.log('booking time and date already exists 😞'); 
                res.send(JSON.stringify('exists'));
            } else {
                console.log('yay, good for you, you can make the booking (all clear) 😃'); 
                res.send(JSON.stringify('empty'));
            }
        }
    })
});

// add booking  
app.post('/booking',function(req,res){ 
    var query = "INSERT  INTO bookings (bookingDate, bookingTime, idPatient, idDoctor, idTreatment) VALUES (?,?,?,?,?)";
    connection.query(query,[
        req.body.bookingDate, 
        req.body.bookingTime, 
        req.body.idPatient,
        req.body.idDoctor, 
        req.body.idTreatment
    ],function(error,results){
    
    if(error) {
       next(error) 
    }
    else {
    res.send(JSON.stringify('booking added successfully 💜'));
        }
    })  
});

//*************************************************** treatments SERVICE *****************************************************/

// get all the current treatments of a doctor (id given in parametres)
app.get('/currentTreatmentsDoctor/:idDoctor',function(req,res){ 
    var currentDate = new Date(); 
    //console.log(currentDate.toISOString().slice(0,10));   

    var query = "select * from treatments natural join bookings natural join doctors where treatmentEndDate >= ? and idDoctor=?";
    connection.query(query,[currentDate,req.params.idDoctor],function(error,results){
    if (error) { 
        throw(error) 
    } else{
        if (results.length<=0){
            res.send(JSON.stringify('Heyy, you have no treatments going, have a nice day 😀'));
        }else{
            res.send(JSON.stringify(results));
        }
    }
})
});

// get all the current treatments of a patient (id given in parameters)
app.get('/currentTreatmentsPatient/:idPatient',function(req,res){ 
    var currentDate = new Date();
    //console.log(currentDate.toISOString().slice(0,10));

    var query = "select * from treatments natural join bookings natural join patients where treatmentEndDate >= ? and idPatient=?";
    connection.query(query,[currentDate,req.params.idPatient],function(error,results){
    if (error) { 
        throw(error) 
    } else {
        if (results.length<=0){
            res.send(JSON.stringify('Heyy, you have no treatments going, have a nice day 😀'));
        }else{
            res.send(JSON.stringify(results));
        }
    }
})
});


//******************************************************** DOCTORS SERVICE ****************************************************/

// get all doctors 
app.get('/doctor',function(req,res){  
    var query = "select * from doctors";
    connection.query(query,function(error,results){
        if (error) { 
            throw(error) 
        }else{
            res.send(JSON.stringify(results));
        }
    })
});

// get doctor by Id 
app.get('/doctor/:id',function(req,res){  
    var data = Object() 
    var query = "select * from doctors where idDoctor=?";
    connection.query(query,[req.params.id],function(error,results){
        if (error) { 
            throw(error) 
        } else {
            if(results.length>0) {
                data = results[0]
            }
            res.send(JSON.stringify(data));
        }
    })
});

// add a new doctor
app.post('/doctor',function(req,res){ 
    var query = "INSERT  INTO doctors (name, lastName, phone, speciality, image, exp, lat, lng, fb) VALUES (?,?,?,?,?,?,?,?,?)";
    connection.query(query,[req.body.name,
                            req.body.lastName, 
                            req.body.phone, 
                            req.body.speciality, 
                            req.body.image, 
                            req.body.exp, 
                            req.body.lat,
                            req.body.lng, 
                            req.body.fb],
                            function(error,results){
    if(error) {
       next(error) 
    }
    else {
    res.send(JSON.stringify('doctor added successfully 💜'));
        }
    })  
});


// authentification for a doctor (using the hashing function md5)
app.post('/doctorAuth',function(req,res){  
    var query = "select * from authdoctor where phone=? and password=?";

    //console.log(req.body.phone)
    //console.log(req.body.pwd)
    //console.log(md5(req.body.pwd))

    connection.query(query,[req.body.phone, req.body.pwd],function(error,results){
        if (error) { 
            throw(error) 
        }else{
            res.send(JSON.stringify(results));
        }
    })

});

//******************************************************** SPECIALITY SERVICE ************************************************/
// get all specialities 
app.get('/speciality',function(req,res){  
    var query = "select * from specialities";
    connection.query(query,function(error,results){
        if (error) { 
            throw(error) 
        }else{
            res.send(JSON.stringify(results));
        }
    })
});

//******************************************************** disease SERVICE ************************************************/
// get all specialities 
app.get('/disease',function(req,res){  
    var query = "select * from disease";
    connection.query(query,function(error,results){
        if (error) { 
            throw(error) 
        }else{
            res.send(JSON.stringify(results));
        }
    })
});

/***************************************************************************************************************************/
// End add new stock

    var server = app.listen(8000,function(){
    var host = server.address().address
    var port = server.address().port
});