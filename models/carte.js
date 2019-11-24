let base = require('../configuration/database');
class Carte
{
    //export :mongoexport --db=gourmet --port=27017 --collection=carte -o carte.json 

    static produit_all(request,response,callback)
    {
        
         base.basededonnee(function(MongoClient,assert,url,dbName,db){
            
           //  console.log(url);
            
            const carte = db.collection('carte');


            carte.find({}).toArray((error,result)=>{
                if(error) throw error;
               
               callback(result);
            });
            
         });
    }

    static produit_post(request,response,callback)
    {
       
    }

    static produit_list(request,response,callback)
    {
       
         base.basededonnee(function(MongoClient,assert,url,dbName,db){
            
            
             
             const carte = db.collection('carte');
 
 
             carte.find({categorie:request.param('produit')}).toArray((error,result)=>{
                if(error) throw error;
               
               callback(result);
            });
           
          });

    }

    static produit_single(request,id,response,callback)
    {
       
         base.basededonnee(function(MongoClient,assert,url,dbName,db){
            
            
             
            const carte = db.collection('carte');
            
            var MongoObjectID = require("mongodb").ObjectID;          
            var idToFind      = id;          
            var objToFind     = { _id: new MongoObjectID(idToFind) }; 
    
    
                carte.findOne(objToFind,(err,result)=>{
                   callback(result);
                });

        
            
         });
    }

    static add(request,response,date){
       
       
         base.basededonnee(function(MongoClient,assert,url,dbName,db){
             
            const carte = db.collection('carte');
            
            carte.insertOne({titre:request.body.titre,categorie:request.body.categorie,description:request.body.description,date:date,prix:request.body.prix})
         });

    }

    
    static update(request,response,id,date){//la valeur id est récupéré !
        
        base.basededonnee(function(MongoClient,assert,url,dbName,db){
            const carte = db.collection('carte');
            //it works just fine the way it is...
            var MongoObjectID = require("mongodb").ObjectID;          // Il nous faut ObjectID
            var idToFind      = id.toString();           // Identifiant, sous forme de texte
            var objToFind     = { _id: new MongoObjectID(idToFind) };

           
            carte.updateOne(objToFind,{$set:{titre:request.body.titre,categorie:request.body.categorie,description:request.body.description,date:date,prix:request.body.prix}},
            function(err){
                if(err) throw err;
            
            });  
            
         });
    }

    static delete(request,response,id){//la valeur id est récupéré !
     
       base.basededonnee(function(MongoClient,assert,url,dbName,db){
             
        
        const carte = db.collection('carte');
        //it works just fine the way it is...
        var MongoObjectID = require("mongodb").ObjectID;          // Il nous faut ObjectID
        var idToFind      = id.toString();           // Identifiant, sous forme de texte
        var objToFind     = { _id: new MongoObjectID(idToFind) };

        carte.deleteOne(objToFind,function(err){
            if(err) throw err;
            //console.log("VOILA:"+objToFind.toString())
        });
       
     });
    }
}

module.exports = Carte;