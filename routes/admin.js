let express = require('express');
let router = express.Router();
let path = require("path");
let mysql = require('mysql');

// UPLOAD DE FICHIER 
const multer = require('multer');
const upload = multer({ dest: 'tmp/' });
const fs = require('fs');

let con = mysql.createConnection({
 		host: "sql7.freesqldatabase.com",
 		user: "sql7233133",
 		password: "r3AcfGXI7U",
 		database: "sql7233133"
});

let adminID = `select * from admin;`

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views/blockcontentAdmin', 'adminLogin.html'));
});

router.post('/', (req, res, next) => {
	const ident = req.body.ident;
	const pwd = req.body.password;
	console.log("ident : ", req.body.ident);
	console.log("pwd : ", req.body.password);
	con.query(adminID, function (err, result) {

      if (err) throw err;

			if ((ident === result[0].id)&&(pwd===result[0].password)) {
				console.log('les ID sont bons');
				res.render('blockcontentAdmin/adminHP');
			} else {
				console.log('les ID sont foireux');
				res.redirect('/admin');
			}
  });
});

router.get('/upload', (req, res, next) => {
	res.render('blockcontentAdmin/adminUpload');
	next();
});


// ROUTE pour POST
router.post('/uploaddufichier', upload.single('monfichier'), function (req, res, next) {
	// traitement du formulaire
	console.log(req.file.mimetype);
	console.log(typeof req.file.minetype);

	if (req.file.mimetype === 'image/png' && req.file.size < 3145728) {

		fs.rename(req.file.path, 'public/images/' + req.file.originalname, function (err) {
			if (err) {
				res.send('problème durant le déplacement');
			} else {
				res.render('blockcontentAdmin/adminUpload');
			}

		});
	}

	else if (req.file.mimetype != 'image/png') {
		res.send(`Ce fichier n'est pas un png`);
	}

	else {
		res.send(`Ce fichier est trop gros`);
	}

});

module.exports = router;