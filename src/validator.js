function Validator(formSelector){

    function getParent(element,selector){
        
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement
        }
    }

    var formRules ={};
    var validatorRules ={
        required : function(value){
            return value ? undefined :'vui lòng nhập trường này'
        },
        email: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return value.match(regex) ? undefined :'vui lòng nhập email'
        },
        min : function(min){
            return function(value){
                return value.length >= min ? undefined :`vui lòng nhập tối thiêu ${min} ký thự`
            } 
        }
    }
    // lấy form element tròn dom theo formselector
    var formElement = document.querySelector(formSelector);
    
    // ?xử lý khi có form
    if(formElement){
            var inputs = formElement.querySelectorAll('[name][rules]')

            for(var input of inputs){

                    var rules = input.getAttribute('rules').split('|');
                    for(var rule of rules)
                    {
                        var ruleInfo;
                        var isRuleHasValue =rule.includes(':');
                        if(isRuleHasValue){
                             ruleInfo = rule.split(':');

                            rule =ruleInfo[0];
                            
                        }
                        var ruleFunc = validatorRules[rule]
                        // console.log(rule)
                        if(isRuleHasValue){
                            ruleFunc = ruleFunc(ruleInfo[1]);
                        }
                        if(Array.isArray(formRules[input.name])){
                            formRules[input.name].push(ruleFunc);
                        }
                        else{
                            // console.log(validatorRules[rule])
                            formRules[input.name] =[ruleFunc];
                        }
                    }
                    // lang nghe su kien de validate
                    input.onblur = handleValidate;
                    input.oninput = handleClearError;

                    function handleValidate(e){
                        var  rules = formRules[e.target.name];
                        
                        var errorMessage ;

                        for(var rule of rules){
                            errorMessage = rule(e.target.value);
                            if(errorMessage) break;
                        }
                        

                        // console.log(errorMessage)
                        // neu co loi thi hien thi message loi 

                        if(errorMessage){
                               var formGroup =  getParent(e.target ,'.form-group');

                              
                               if(formGroup){
                                   var formMessage = formGroup.querySelector('.form-message');
                                   if(formMessage){
                                       formMessage.innerText= errorMessage;
                                       formGroup.classList.add('invalid');
                                   }
                               }
                        }

                        return !errorMessage
                    }
                    function handleClearError(e){
                        var formGroup =  getParent(e.target ,'.form-group');

                        if(formGroup.classList.contains('invalid')){

                            formGroup.classList.remove('invalid');
                            var formMessage = formGroup.querySelector('.form-message');
                            if(formMessage){
                                formMessage.innerText= '';
                               
                            }


                        }
                    }
            
                }
               
   }
    // xu ly hanh vi submit form

    formElement.onsubmit =function(e){
        e.preventDefault();

        var inputs = formElement.querySelectorAll('[name][rules]')
        var isValid = true;
        for(var input of inputs){
           if(!handleValidate({ target: input})) {
               isValid =false;
           }
            
        }
        // console.log(isValid)

            // khi khong co loi thi submit form
         if(isValid){
             formElement.submit();
 
            }   
}
}