let base = require('../configuration/database');

class Produit{

    //export :mongoexport --db=gourmet --port=27017 --collection=produit -o produit.json 
   
    static postcommentaire(request,response,id,date,pseudo,callback){
    base.basededonnee(function(MongoClient,assert,url,dbName,db){
            
        //  console.log(url);
        const produit = db.collection('produit');
        //requete!
        console.log(id+" ".pseudo+" "+date+" "+request.body.commentaire);
        produit.insertOne({comment_id:id,nom:pseudo,date:date,commentaire:request.body.commentaire})
        
       // produit.deleteOne({comment_id:id});


        produit.find({}).toArray((error,result)=>{
            if(error) throw error;
           
          // callback(result);
        });
        
     
      
         
      });
    }
    
    static listcommentaire(request,response,id_comment,p,n,callback)
    {
        base.basededonnee(function(MongoClient,assert,url,dbName,db){
             //  console.log(url);
            const produit = db.collection('produit');
       
            //ATTENTION NE PAS OUBLIER toString à id_comment.  

            //PAGINATION des commentaires.
            //limit(nombre de commentaire par page )
            //pour un nombre de commentaire par page = 4
            // page =1 => skip(0) commence dès le 1 er commentaire pour page = 2 => skip(4) commence dès le 5e.
            produit.find({comment_id:id_comment.toString()}).limit(n).skip(n*(p-1)).toArray((error,result)=>{
                if(error) throw error;
                console.log("num page:"+p);
                callback(result);
            });
            
      
        });
    }

    static favoris(request,response,id,pseudo1,callback){
        base.basededonnee(function(MongoClient,assert,url,dbName,db){
           const favoris = db.collection('favoris');

           console.log(id+" "+pseudo1);

           //requete!
          // produit.insertOne({comment_id:id,nom:request.session.pseudo,date:date,commentaire:request.body.commentaire})
           // produit.deleteOne({comment_id:id});
          // console.log("idee: "+id_comment);
           //ATTENTION NE PAS OUBLIER toString à id_comment.

           favoris.insertOne({favoris_id:id,nom:pseudo1});
          
           
           favoris.find({nom:pseudo1}).toArray((error,result)=>{
               if(error) throw error;
               callback(result);
           });

       });
    }

    static listfavoris(request,response,pseudo,callback){
    base.basededonnee(function(MongoClient,assert,url,dbName,db){
        const favoris = db.collection('favoris');

        favoris.find({nom:pseudo}).toArray((error,result)=>{
            if(error) throw error;
            
            callback(result);
       
         
        });
          
    });
}
     static getDataFavoris(request,response,tab,callback)
     {
        base.basededonnee(function(MongoClient,assert,url,dbName,db){
            const carte = db.collection('carte');
    
            var MongoObjectID = require("mongodb").ObjectID;          
         let tt = [];
           for(let i=0;i<tab.length;i++)
           {
              tt[i] = MongoObjectID(tab[i].favoris_id);
           }
           //console.log(tt);
            //var objToFind     = { _id: { "$in" :[MongoObjectID(tab[0].favoris_id),MongoObjectID(tab[1].favoris_id)] }}; 
            var objToFind     = { _id: { "$in" :tt}}; 
           
            carte.find(objToFind).toArray((error,result)=>{
                if(error) throw error;
                
                callback(result);
           
             
            });
      
        });
     }

}

module.exports = Produit;