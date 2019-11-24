let express = require('express');
let app = express();
let session = require('express-session');
let format = require('date-format');
let bcrypt = require('bcryptjs');
            
const salt = 10;


//npm install --save bcryptjs && npm uninstall --save bcrypt



app.set('trust proxy',1);
app.use( session({
    //secret: 'ujGud4',
    secret: 'this_is_a_secret',
    name:'sessionId'
    
})
);


app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));


//parsing JSON
app.use(express.json());
app.use(express.urlencoded({extended:true}))

//message d'alerte
app.use(require('./middlewares/info'));

//routes
//<%- include('header',{session:session})-%>

app.get('/',(request,response)=>{
    response.render('index',{ name:'TOTO' ,session:request.session});
});

app.get('/account',(request,response)=>{
    let user = request.param('user');


    if(request.session.pseudo === user )
    {
        let produit = require('./models/produit');
        let carte = require('./models/carte');
        let pseudo = request.session.pseudo;
         //recup les favoris_id des favoris de l'utilisateur
        produit.listfavoris(request,response,pseudo,function(result){
        
          let tab = result;
                console.log(tab);
                //recup les donnees de chaque articles grâce à favoris_id = id
        produit.getDataFavoris(request,response,tab,function(results){
            console.log(results);
           
           response.render('account',{session:request.session,results:results});
        })

               
               
        
          
          

          // console.log(result[0]._id);
        
           
        });
        
       
  
    }

    else
    {
      response.render('forbidden',{session:request.session});
    }
});





// partie login et register
app.get('/login',(request,response)=>{

    /*
    if(request.session.pseudo)
    {
        response.render('forbidden',{message:response.locals.info,session:request.session});
    }else
    {*/
    if(request.session.info)
    {
        //après un post
        response.locals.info = request.session.info;
        request.session.info  = undefined;
        console.log(response.locals.info);
        //response.render dans la parenthèse , et non après.
        response.render('login',{message:response.locals.info});
    }
     else
     {
         //avant un post
    response.render('login',{message:response.locals.info,session:request.session});
     }
    
    

});

app.post('/login',(request,response)=>{
    let member = require('./models/member');

    let myPlaintextPassword = request.body.password;
    let hash = bcrypt.hashSync(myPlaintextPassword, salt);
    //console.log(request.body.email+" "+request.body.password);
    member.login(request,response,bcrypt,function(result){
        console.log(result);
        //gerer selon result la session! sinon ça marche pour la bdd! puis render ici!
        if(result!=null){
         if(result.logged==='not'){
            request.info("Identifiants incorrects!","error");
            response.redirect('login');
         }
          else if(result.logged==='ok')
         {
            request.info("Vous êtes connecté","succes");
           request.session.pseudo = result.prenom;
           request.session.statut = result.statut;
           
            response.redirect('login');
         }
        }else
        {
            request.info("Identifiants incorrects!","error");
            response.redirect('login');
        }

    });
   // response.render('login',{});

});

app.get('/logout',(request,response)=>{
    request.session.destroy((err)=>{
        if(err) throw err;
            response.redirect('/');
    });
});



app.get('/register',(request,response,next)=>{
  
    //cf middleware/info.
    if(request.session.info)
    {
        response.locals.info = request.session.info;
        request.session.info  = undefined;
    }
      console.log(response.locals.info);
       

        response.render('register',{message:response.locals.info,session:request.session});

 
});



app.post('/register',(request,response)=>{
   
     let member = require('./models/member');
     let myPlaintextPassword = request.body.password;
     let hash = bcrypt.hashSync(myPlaintextPassword, salt);
     if(request.body)
     {
         //middleware
      

        if(request.body.nom!= '' && request.body.prenom!= '' && request.body.adresse!= '' && request.body.date!= '' && request.body.email!= '' && request.body.password!= '')
        {
         //bdd!
        member.register(request,response,hash,function(result){
            console.log(result);
        });
        //utilisation du middleware

        request.info("Vous êtes inscrit","succes");
        //équivaut à request.session.info.succes = "Vous êtes inscrit";
        
        
  
        response.redirect('register');
     }
     else
     {
  
     
   
 
    //utilisation du middleware
    request.info("Remplissez toutes les cases!","error");
        //equivaut à request.session.info.error = "Remplissez toutes les cases!";

    
     
     response.redirect('register');
     }
    }
})

app.get('/aboutme',(request,response)=>{
    response.render('aboutme',{session:request.session});
    
});

//liste de produits à la carte , pour chaque catégorie , entree , plat ,dessert...

app.get('/carte',(request,response)=>{
    let produit = request.param('produit');
    let carte = require('./models/carte');

    
   // carte.produit_post(request,response,function(result){
    carte.produit_list(request,response,function(result){
        console.log(result);
        response.render('carte',{produit:produit,session:request.session,result:result});
        //dirige vers carte?produit=:produit => :produit ,nom de la categorie.
    });
    
   
    
});

 app.get('/produit',(request,response)=>{
     
 
   let id = request.param('id'); //recupe le id dans l'url produit?id= ...
   let carte = require('./models/carte');
   let p = request.param('page');
   //n nombre de commentaires par page.
   const n = 4;
   if(request.session.info)
   {
       response.locals.info = request.session.info;
       request.session.info = undefined;
   }
   

   carte.produit_single(request,id,response,function(result){
    //console.log(result._id);
       let id_comment = result._id; //recup l'id de l'article
    let produit = require('./models/produit');
    
    //cherche la liste des commentaires correspondant à l'id de l'article
    if(p===undefined)
    {
        p=1;
    }
    
    produit.listcommentaire(request,response,id_comment,p,n,function(comments){
       console.log(comments);
     
    
       response.render('produit',{session:request.session,result:result,id:id,comments:comments,message:response.locals.info,p:parseInt(p)});
    });
    
    


  //  response.render('produit',{session:request.session,result:result,id:id});
   });
     
 });
  //poster un commentaire dans produit OU ajouter comme favoris.

  app.post('/produit',(request,response)=>{
  let id = request.param('id');
  let post = request.param('post');
  let date = format('yyyy-MM-dd', new Date());
  let produit = require('./models/produit');

  
  if(post == 'comment')
  {
  if(request.session.pseudo!=null){
      let pseudo = request.session.pseudo;
      request.info("Votre message a été posté.","succes");
  produit.postcommentaire(request,response,id,date,pseudo,function(result){
       console.log(result);
       
      
  });
}else
{
    request.info("Pour poster un commentaire identifiez-vous.","error");
   console.log("Pour poster connectez-vous.");
}

 //poster un comment dans ce id
 response.redirect('produit?id='+id);
}

  if(post == 'favoris'){

    if(request.session.pseudo!=null){
    request.info("Article ajouté comme favoris","succes");
    let produit = require('./models/produit');
    let pseudo1 = request.session.pseudo;
    produit.favoris(request,response,id,pseudo1,function(result){
        console.log(result);
        response.redirect('produit?id='+id);
    });
     
    }else{
        request.info("Pour ajouter cet article en tant que favoris identifiez-vous","error");
        response.redirect('produit?id='+id);
    }

  }
 
  });
 


//partie administrateur 

app.get('/add',(request,response)=>{
    
    if(request.session.statut === 'admin')
    {
      if(request.session.info){
          response.locals.info = request.session.info;
          request.session.info = undefined;
      
    response.render('add',{message:response.locals.info,session:request.session});
      }else{
        response.render('add',{message:response.locals.info,session:request.session});
      }
    }
    else
    {
        response.render('forbidden',{session:request.session});
    }
});

app.post('/add',(request,response)=>{
    let carte = require('./models/carte');
    let date = format('yyyy-MM-dd', new Date());
    //console.log(format('yyyy-MM-dd', new Date()));//pour date!!

    carte.add(request,response,date);//introduire date comme 3e variable! ET le reporter dans carte.add => class carte.
    request.info("Article ajouté à la carte.","succes");
    // request.session.info.succes = "Article ajouté à la carte";
    response.redirect('add');
});

app.get('/update',(request,response)=>{
    let carte = require('./models/carte');
    if(request.session.statut === 'admin')
    { let id = request.param('id');
    //console.log(id);

    if(request.session.info)
    {
        response.locals.info = request.session.info;
        request.session.info = undefined;
    }

        if(id === undefined)
          {
    
        carte.produit_all(request,response,function(result){
            console.log(result);
           response.render('update',{session:request.session,result:result,page:'update',id:id,message:response.locals.info});
        });
          }else
          {
              //autre requete
             carte.produit_single(request,response,function(result){
                response.render('update',{session:request.session,result:result,page:'update',id:id,message:response.locals.info});
             });

              //ajouter egalement le message flash!
              
          }
        
    }
    else
    {
        response.render('forbidden',{session:request.session});
    }
 });

 app.post('/update',(request,response)=>{
    let carte = require('./models/carte');
    let id = request.param('id');
    let date = format('yyyy-MM-dd', new Date());
    
    //console.log("titre:"+title);
    carte.update(request,response,id,date);
    request.info("Article modifié","succes");
    // request.session.info.succes = "Article ajouté à la carte";
    response.redirect('update?id='+id);
 }
 )
 app.get('/delete',(request,response)=>{
    let carte = require('./models/carte');
    
    //console.log(format('yyyy-MM-dd', new Date()));//pour date!!
    if(request.session.statut === 'admin')
    {
        let id = request.param('id');
       // console.log(id);
       if(request.session.info)
       {
           response.locals.info = request.session.info;
           request.session.info = undefined;
       }

        if(id === undefined)
        {
            
        carte.produit_all(request,response,function(result){
            console.log(result);
         response.render('delete',{session:request.session,result:result,page:'delete',id:id,message:response.locals.info});
        });
        }else{
            //
            //ajouter egalement le message flash!
           // result = null;
           let carte = require('./models/carte');
           carte.produit_single(request,response,function(result){
            response.render('delete',{session:request.session,page:'delete',result:result,id:id,message:response.locals.info});
           });
            
        }
    }
    else
    {
        response.render('forbidden',{session:request.session});
    }
 });

 app.post('/delete',(request,response)=>{
     let carte = require('./models/carte');
     let id = request.param('id');
     console.log("ik:"+id);
     carte.delete(request,response,id);
     request.info("Article supprimé","succes");
     // request.session.info.succes = "Article ajouté à la carte";
     response.redirect('delete?id='+id);
 });
app.listen(3000);

