const isEmpty=require('./is_empty')
const validator=require('validator')

module.exports= function validatePostInput(data){
    let errors={}
    
    data.text=!isEmpty(data.text)?data.text:''
    
  


   
    if(!validator.isLength(data.text,{min:5,max:300})){
        errors.text='Text must be between 5 and 300 characters'
    }
    
    if(validator.isEmpty(data.text)){
        errors.text='Text field is missing'
    }
  
   


    return {
        errors,
        isValid:isEmpty(errors)
    }
}
