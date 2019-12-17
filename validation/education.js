const isEmpty=require('./is_empty')
const validator=require('validator')

module.exports= function validateExperienceInput(data){
    let errors={}
    
    data.school=!isEmpty(data.school)?data.school:''
    data.degree=!isEmpty(data.degree)?data.degree:''
    data.fieldofstudy=!isEmpty(data.fieldofstudy)?data.fieldofstudy:''
    data.from=!isEmpty(data.from)?data.from:''



    
    
  


   
    
    if(validator.isEmpty(data.school)){
        errors.school='Name of school is required'
    }
    if(validator.isEmpty(data.degree)){
        errors.degree='Degree is required'
    }
    if(validator.isEmpty(data.from)){
        errors.from='Start Date is required'
    }
    if(validator.isEmpty(data.fieldofstudy)){
        errors.fieldofstudy='Field of study is required'
    }
    
 
   


    return {
        errors,
        isValid:isEmpty(errors)
    }
}
