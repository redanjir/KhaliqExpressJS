export const createUserValidationSchema ={
    username: {
        isLength: {
            options: {
                min: 5,
                max: 32,
            },
            errorMessage: "Username must be at least 5 characters with a max of 32 characters"
        },
        notEmpty: {
            errorMessage: "Username cannot be empty",
        },
        isString: {
            errorMessage: "Username must be a string",
        },
    },
    password:{
        notEmpty:{
            errorMessage: "Password cannot be empty",
        }
    },
    displayname:{
        notEmpty:{
            errorMessage: "Displayname cannot be empty",
        }
    }
};

export const partialUpdateUserValidationSchema ={
    username: {
        optional:true,
        isLength: {
            options: {
                min: 5,
                max: 32,
            },
            errorMessage: "Username must be at least 5 characters with a max of 32 characters"
        },
        notEmpty: {
            errorMessage: "Username cannot be empty",
        },
        isString: {
            errorMessage: "Username must be a string",
        },
    },
    password:{
        optional:true,
        notEmpty:{
            errorMessage: "Password cannot be empty",
        }
    },
    displayname:{
        optional:true,
        notEmpty:{
            errorMessage: "Displayname cannot be empty",
        }
    }
};

export const getUsersValidationSchema ={
    filter:{
        optional:true,
        isString:true,
        notEmpty:{
            errorMessage: "Filter must not be empty"
        },
        isLength:{
           options:{
            min:3,
            max:15,
           },
           errorMessage: "Filter must be at least 3-15 characters"
        }
    },
    value:{
        optional:true,
        isString:true,
        notEmpty:{
            errorMessage: "Value must not be empty"
        },
        isLength:{
            options:{
                min:3,
                max:15,
            },
            errorMessage: "Value must be at least 3-15 characters"
        }
    }
}