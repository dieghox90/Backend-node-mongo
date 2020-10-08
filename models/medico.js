const {Schema,model, SchemaTypes} = require('mongoose');

const MedicoSchema = Schema({
    nombre:{
        type:String,
        required:true
    },
    img:{
        type:String,
    },
    usuario:{
        type:SchemaTypes.ObjectId,
        ref:'Usuario',
        required:true
    },
    hospital:{
        type:SchemaTypes.ObjectId,
        ref:'Hospital',
        required:true
    }
});

// Para cambiar la presentacion de las variables al consultar desde MONGO
MedicoSchema.method('toJSON',function(){
    const {__v,...object} = this.toObject();
    return object;
});


module.exports=model('Medico',MedicoSchema);