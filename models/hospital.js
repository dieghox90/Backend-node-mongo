const {Schema,model, SchemaTypes} = require('mongoose');

const HospitalSchema = Schema({
    nombre:{
        type:String,
        required:true
    },
    img:{
        type:String,
    },
    usuario:{
        required:true,
        type:SchemaTypes.ObjectId,
        ref:'Usuario'
    }
},{collection:'hospitales'});

// Para cambiar la presentacion de las variables al consultar desde MONGO
HospitalSchema.method('toJSON',function(){
    const {__v,...object} = this.toObject();
    return object;
});


module.exports=model('Hospital',HospitalSchema);