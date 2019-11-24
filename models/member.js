let base = require('../configuration/database');
class Member
{
    
    //export :mongoexport --db=gourmet --port=27017 --collection=register -o register.json 
    //export dans le fichier register.json

    static register(request,response,hash,callback)
    {

        //mettre les 4 1ere ligne dans un fichier bdd dans un dossier config!
      
         base.basededonnee(function(MongoClient,assert,url,dbName,db){
            
            //  console.log(url);
            const register = db.collection('register');
            //requete!
            register.insertOne({prenom:request.body.prenom,nom:request.body.nom,adresse:request.body.adresse,date_de_naissance:request.body.date,email:request.body.email,mot_de_passe:hash,statut:'member'})
            register.find({}).toArray((error,result)=>{
                if(error) throw error;
               //console.log(result);
               callback(result);
            });
          
             
          });
    }

    static login(request,response,bcrypt,callback)
    {
       
         base.basededonnee(function(MongoClient,assert,url,dbName,db){
            
            const register = db.collection('register');
         
        
      // register.drop();
       
     register.findOne({email:request.body.email},(error,result)=>{
                if(error) throw error;
               
          
            
             if(result!=null)
             {
               let ggg =bcrypt.compareSync(request.body.password, result.mot_de_passe);
                    if(ggg){
                        console.log('ok');
                        result.logged = 'ok';
                        callback(result);
                }
                    else
                    {
                        console.log('not');
                      
                        
                        result.logged = 'not';
                        callback(result);
                    }
        }else
        {
        
            callback(result);
            
        }
            });
           
          
        });
    }
}

module.exports = Member;