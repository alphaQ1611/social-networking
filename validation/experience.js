const isEmpty=require('./is_empty')
const validator=require('validator')

module.exports= function validateExperienceInput(data){
    let errors={}
    
    data.title=!isEmpty(data.title)?data.title:''
    data.company=!isEmpty(data.company)?data.company:''
    data.from=!isEmpty(data.from)?data.from:''


    
    
  


   
    
    if(validator.isEmpty(data.title)){
        errors.title='Job Title is required'
    }
    if(validator.isEmpty(data.company)){
        errors.company='Company name is required'
    }
    if(validator.isEmpty(data.from)){
        errors.from='Start Date is required'
    }
 
   


    return {
        errors,
        isValid:isEmpty(errors)
    }
}
