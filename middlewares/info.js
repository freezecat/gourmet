module.exports = function(request,response,next){

  

     request.info = function(content,type)
     {
      

      
      /*request.session:{
          info:{
          succes:'Vous êtes inscrit,
          error:'Remplissez toutes les cases!'
          }
      }*/
     
        if(request.session.info === undefined)
        {
            request.session.info = {};
        }
         request.session.info[type] = content;
     }
    
     next();
};