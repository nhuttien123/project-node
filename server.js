const { name } = require('ejs');
const exp= require('express');
const formidable = require('formidable');
const fs =require('fs');
const bcrypt = require('bcrypt');
const multer = require('multer');
let alert = require('alert')

var session = require('express-session');
const bodyparser = require('body-parser');
let app=exp();
const port=3000;


app.use(session({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views','./views');
app.use(exp.static('public'));

const mysql= require('mysql');
const { diffieHellman } = require('crypto');
const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'node-asm'
});

var data = [];
app.get('/',(req,res)=>{ 
    let sql = "select * from products WHERE thutu=1";
      let sql2 = "select * from products WHERE thutu=2";
       let sql3 = "select * from products order by proId limit 0,3";
       let sql4 = "select * from products order by proId limit 3,3";
       let sql5 = "select * from products order by proId limit 6,3";
        let sql6 = "select * from products order by proId limit 9,3";
     db.query(sql,function(err,listPro){
          db.query(sql2,function(err,listPro2){
               db.query(sql3,function(err,listPro3){
                      db.query(sql4,function(err,listPro4){
                           db.query(sql5,function(err,listPro5){
                                db.query(sql6,function(err,listPro6){
         if (err)throw err;
        res.render('asm',{products:listPro , products2:listPro2 ,
             products3:listPro3,products4:listPro4 , products5:listPro5 , products6:listPro6});
             
     });
    });
});});
});
});
});

app.get('/cart',(req,res)=>{
    
     res.render('cart' );
})



app.get("/product",(req,res)=>{
     let sql=`select * from catalogs`;
        let sql2="select * from products ORDER BY proId desc";
             db.query(sql2,function(err,listPro){
                 db.query(sql,function(err,listCat){
                   if (err)throw err;
        res.render('product',{products:listPro , catalogs:listCat})

             })
})
})

app.get('/ckeditor/basic', function (req, res) {
data.mhor = menu.fn.get_hor();
data.mver = menu.fn.get_ver('ckeditor');
res.render('ckeditor/basic', { data: data });
})



app.get('/signup',(req,res)=>{
     res.render('signup');
})

app.get('/doipass', (req,res)=>{
     res.render('doipass')
})

app.get('/sendmail',(req,res)=>{
      res.render('admin/sendmail')
})

app.post('/testsendmail_', function(req, res, next) {
  var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'nhuttien22102001@gmail.com',pass: 'fuckuman22102001' },
    tls: { rejectUnauthorized: false  }
  });
  const fs = require('fs');
 
  var form = new formidable.IncomingForm();   
  form.parse(req, function (err, fields, files) {
       let em = fields.mail;
       let td = fields.tieude;
       let nd = fields.noidung;
  let mailOptions = {
    from: 'nhuttien22102001@gmail.com',
    to: em,
    subject:td,
    //text: 'Nội dung thư, không có code html'
    html:nd,
};
  transporter.sendMail(mailOptions, function(error, info){
    if (error) console.log(error); 
    else console.log('Đã gửi mail: ' + info.response);
    alert('Gửi mail thành công');
    res.redirect('/sendmail');
  });
});//
})

app.post('/pass',(req, res) => {
          var form = new formidable.IncomingForm();   
     form.parse(req, function (err, fields, files) {
          let em =fields.email;
         let p = fields.password;   
            var salt = bcrypt.genSaltSync(10);
    var mahoa = bcrypt.hashSync(p , salt);
    let sql=`UPDATE users SET password = '${mahoa}' where email = '${em}' `;
          db.query(sql,function(err){
          if(err) throw err;
          alert('Đổi mật khẩu thành công')
          res.redirect('/');
});
});
});


app.post('/signup_', function(req, res) {
      var form = new formidable.IncomingForm();   
     form.parse(req, function (err, fields, files) {
    let u=fields.username;
    let p = fields.password;
    let e = fields.email;
    let da= fields.date;
          
     var salt = bcrypt.genSaltSync(10);
    var mahoa = bcrypt.hashSync(p , salt);
    users={
         username:u,
         password: mahoa,
         email:e,
         ngaysinh:da,
    }
    db.query('insert into users SET ?',users, function(err, data) {
        if (err) throw err;
        res.redirect('/');
        });
    });
})



app.post('/dangnhap_', async function(req, res) {
    let u = req.body.username;
    let p = req.body.password;
    let sql = `SELECT * FROM users WHERE username =? `;
    db.query(sql, [u] , (err, rows) => { 
        if (rows.length<=0) { res.redirect("/");alert('Tài khoản không tồn tại !'); console.log('Sai tài khoản'); return;}
        let user = rows[0];        
        let pass_fromdb = user.password;        
        const bcrypt = require("bcrypt");        
        
        if (kq ){ 
            console.log("Đăng nhập thàng công");   
            var sess = req.session;  //initialize session variable
            sess.username = user.username;
            res.redirect('/');
            alert(`User ${u} đăng nhập thành công `);
        }
        else {
            console.log("Sai pass");
            res.redirect("/");
            alert('Mật khẩu sai !');
        }
    });   
});

app.get('/thoat', function(req, res, next) {
    req.session.destroy();
    res.redirect("/");
});

app.get("/data", (req,res , next)=>{
     res.set("Access-Control-Allow-Origin","*");
      let sql2="select * from products ORDER BY proId desc " ;
             db.query(sql2,function(err,listPro){ 
                    {data = listPro};
                   if (err)throw err;
                   res.json(listPro);
                   
                    return data;
})

})
app.get('/userdata',(req,res)=>{
     sql = `select * from users`
      db.query(sql,function(err,listuser){ 
                    {data = listuser};
                   if (err)throw err;
                   res.json(listuser);
                    return data;
})
})
app.get('/search',(req,res)=>{
       var form = new formidable.IncomingForm();   
     form.parse(req, function (err, fields, files) {
    let n= fields.tensp;
    users={
         proname:n,
    }
    db.query('select * from products where proname = ?',users, function(err, data) {
        if (err) throw err;
        res.render('timkiem', {sp:data});
        });
    });
});

app.get('/maindata',(req,res)=>{ 
    let sql = "select * from products WHERE thutu=1";
     db.query(sql,function(err,listPro){
     {data = listPro };
         if (err)throw err;
        res.json(listPro );
     return data;
});
});

app.get('/maindata2',(req,res)=>{ 
    let sql = "select * from products WHERE thutu=2";
     db.query(sql,function(err,listPro2){
     {data = listPro2 };
         if (err)throw err;
        res.json(listPro2 );
     return data;
});
});

app.get('/maindata3',(req,res)=>{ 
    let sql = "select * from products order by proId limit 0,3";
     db.query(sql,function(err,listPro3){
     {data = listPro3 };
         if (err)throw err;
        res.json(listPro3 );
     return data;
});
});

app.get('/maindata4',(req,res)=>{ 
    let sql = "select * from products order by proId limit 3,3";
     db.query(sql,function(err,listPro4){
     {data = listPro4 };
         if (err)throw err;
        res.json(listPro4 );
     return data;
});
});

app.get('/maindata5',(req,res)=>{ 
    let sql = "select * from products order by proId limit 6,3";
     db.query(sql,function(err,listPro5){
     {data = listPro5 };
         if (err)throw err;
        res.json(listPro5 );
     return data;
});
});

app.get('/maindata6',(req,res)=>{ 
    let sql = "select * from products order by proId limit 9,3";
     db.query(sql,function(err,listPro6){
     {data = listPro6 };
         if (err)throw err;
        res.json(listPro6 );
     return data;
});
});


app.get('/product/:cateId',(req,res)=>{
   let cateId=req.params.cateId;
//     let sql=`select * from catalogs`;
//     let sql2=`select * from products WHERE cataId=${cateId}`;
//     db.query(sql2,function(err,listPro){
//         db.query(sql,function(err,listCat){
//         if (err)throw err;
        res.render('productBycata',{cateId:cateId});
        });

app.get('/ctdata',(req,res)=>{
    let sql=`select * from catalogs`;
        db.query(sql,function(err,listCat){
     (data=listCat);
      if (err)throw err;
        res.json( listCat );
     return data;
})
})

app.get('/detailctdata/:cateId',(req,res)=>{
      let cateId=req.params.cateId;
    let sql=`select * from products WHERE cataId=${cateId}`;
        db.query(sql,function(err,listPro){
     (data=listPro);
      if (err)throw err;
        res.json(listPro);
     return data;
})
})


app.get('/dt/:proId',(req,res)=>{
     let proId=req.params.proId;
     // let sql = `select * from products WHERE proId=${proId}`;
     //  let sql2 = "select * from products WHERE thutu=2";
     //  let sql3 = "select * from products order by proId limit 0,3";
     // db.query(sql ,function(err,pro){
     //      db.query(sql3,function(err,listPro3){
     //            db.query(sql2,function(err,listPro2){
     //      if(err)throw err;
     res.render('pro-dt',{proId:proId});
     });

 
 
app.get("/detaildata/:proId",(req,res)=>{
       let proId=req.params.proId;
     let sql = `select * from products WHERE proId=${proId}`;
      db.query(sql ,function(err,pro){
            {data = pro };
            if(err)throw err;
             res.json(pro)
             
            return data;
})
})

app.get('/cata',(req,res)=>{
     // let sql=`select * from catalogs`;
     // db.query(sql,function(err , cat){
     //       if(err) throw err;
          res.render('admin/cata');  
     });

app.get('/addcata',(req,res)=>{    
     res.render('admin/addcat');
});

app.post('/addcata',(req, res) => {
    var form = new formidable.IncomingForm();   
     form.parse(req, function (err, fields, files) {
    let name=fields.tencata;
    let showhide=fields.anhien;
   
    cata={
         loai:name,
         anhien:showhide,
    }
    db.query('insert into catalogs SET ?',cata, function(err, data) {
        if (err) throw err;
        res.redirect('/cata');
        });
    });
});

app.get('/delcat/:delcat',(req,res)=>{
     let delcat=req.params.delcat;
     let sql = `delete from catalogs where cataId=${delcat}`;
     db.query(sql,function(err,pro){
          if(err) throw err;
          res.redirect('/cata');
     })
})

app.get('/edit/:cat',(req,res)=>{
     let cat=req.params.cat
     let sql = `select * from catalogs where cataId=${cat}`;
       db.query(sql,function(err,editcat){
          if(err) throw err;
          res.render('admin/edit-cata',{ed : editcat});
})
})

app.post('/editcat', (req,res)=>{
     var form = new formidable.IncomingForm();   
     form.parse(req, function (err, fields, files) {
     let id = fields.id;
     let name = fields.tencata;
     let showhide = fields.anhien;
     let sql =`update catalogs set loai='${name}',anhien='${showhide}' where cataId='${id}'`;
          db.query(sql,function(err){
          if(err) throw err;
          res.redirect('/cata');
});
});
});

app.get('/admin',(req,res)=>{
     // let sql=`select * from products order by proId desc`;
     //  let sql2=`select * from catalogs `;
     // db.query(sql,function(err,listpro){
     //       db.query(sql2,function(err,listcat){
     //       if(err)throw err;
          res.render('admin/home');
     })


app.get('/addpro',(req,res)=>{
     let sql=`select * from products `;
      let sql2=`select * from catalogs `;
     db.query(sql,function(err,listpro){
           db.query(sql2,function(err,listcat){
           if(err)throw err;
          res.render('admin/addpro',{pro:listpro, cat:listcat});
         
     })
}) 
});
app.post('/addnew',(req, res) => {
    var form = new formidable.IncomingForm();   
     form.parse(req, function (err, fields, files) {
         let pathFile = files.img.path;   
      let nameImage = files.img.name;
    let title=fields.tensp;
    let cat=fields.loaisp;
    let price=fields.gia;
     let sale=fields.sale;
    let description=fields.desc;
     let dt_description=fields.motact;
    let destPath='../public/'+ nameImage;
    product={
          proname:title,
          price:price,
          saleprice:sale,
          mota:description,
          images: nameImage,
          cataId:cat,
    }
    db.query('insert into products SET ?',product, function(err, data) {
        if (err) throw err;
        res.redirect('/admin');
        });
    });
});

app.get('/del/:del',(req,res)=>{
     let del=req.params.del;
     sql = `delete from products where proId=${del}`;
     db.query(sql,function(err,pro){
          if(err) throw err;
          res.redirect('/admin');
     })
})



app.get('/editpro/:edit',(req,res)=>{
     let edit = req.params.edit
     let sql=`select * from products where proId=${edit}`;
      let sql2=`select * from catalogs`;
     db.query(sql,function(err,listpro){
           db.query(sql2,function(err,listcat){
           if(err)throw err;
          res.render('admin/edit-pro',{pro:listpro, cat:listcat});
     })
}) 
})

app.post('/editpro',(req, res) => {
          var form = new formidable.IncomingForm();   
     form.parse(req, function (err, fields, files) {
          let idsp =fields.idsp;
         let pathFile = files.img.path;   
      let nameImage = files.img.name;
    let title=fields.tensp;
    let cat=fields.loaisp;
    let price=fields.gia;
     let sale=fields.sale;
    let description=fields.desc;
    let destPath='../public/'+ nameImage;
    if(!nameImage){
     sql=`UPDATE products SET proname='${title}',price='${price}',saleprice='${sale}',mota='${description}',cataId='${cat}'  WHERE proId='${idsp}' `;
    }else{
          sql=`UPDATE products SET proname='${title}',price='${price}',saleprice='${sale}',mota='${description}',images='${nameImage}',cataId='${cat}'  WHERE proId='${idsp}' `;
    }
          db.query(sql,function(err){
          if(err) throw err;
          res.redirect('/admin');
});
});
});

app.listen(port,()=>{console.log(`dang chay voi port ${port}`);});