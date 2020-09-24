const mongoose = require('mongoose');

const dbConecction = async() => {

    try {
    
        await mongoose.connect(process.env.DB_CONECT, 
            {useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex:true
        });

        console.log('DB ONLINE CONECTADO');
        
    } catch (error) {
        
        throw new Error('Error al levantar la Base de Datos');
    }


}

module.exports={
    dbConecction
}
