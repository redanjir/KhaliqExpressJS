import { getUserById, createNewUser } from "../controllers/userController.mjs";
import * as helpers from "../utils/helpers.mjs"
import { User } from "../mongoose/schemas/user.mjs";
import * as validator from 'express-validator';
import { hashPassword } from "../utils/helpers.mjs";

// Create a mock user to be returned by the database call
const mockUser = { _id: '123', name: 'John Doe' };

const mockRequest = {
    params: {
        id: '123'
    }
};

const mockResponse = {
    send: jest.fn(),
    status: jest.fn(()=> mockResponse), //return the mockresponse it self
    sendStatus: jest.fn(),
};

jest.mock('express-validator', () => ({
    matchedData: jest.fn(()=>({ // When returning an object, replace the curly braces with ()
            username: "Joe", 
            password: "hello123",
            displayname: "Joe123",
        })),
    validationResult: jest.fn(()=>({
        isEmpty: jest.fn(()=>false),
        array: jest.fn(()=>[{msg: "Invalid Field"}]) // when returning an array, omit the curly braces
    })),
}));

jest.mock("../utils/helpers.mjs", ()=>({
    hashPassword: jest.fn((password)=>`hashed_${password}`)
}));

jest.mock("../mongoose/schemas/user.mjs");

// describe('get users', () => {
//     beforeEach(() => {
//         jest.clearAllMocks(); // Clear previous mock calls
//     });

//     it('should get user by id', async () => { 
//         matchedData.mockReturnValue({id: '123'});

//         // Mock the User.findOne method to return mockUser when called with specific id
//         const findOneSpy = jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);

//         //Call the function after setting up the mocks
//         await getUserById(mockRequest, mockResponse);

//         // Check that findOne was called with the correct _id
//         expect(findOneSpy).toHaveBeenCalledWith({ _id: mockRequest.params.id });

//         // Verify that the response was called with the mocked user data
//         expect(mockResponse.status).toHaveBeenCalledWith(200);
//         expect(mockResponse.send).toHaveBeenCalledWith(mockUser);
//         expect(mockResponse.send).toHaveBeenCalledTimes(1);
//     });

//     it('should call sendStatus 404 when user is not found', async () =>{
//         const copymockRequest = {...mockRequest, params:{id: 1234}};

//         matchedData.mockReturnValue({id: 1234});
//         const findOneSpy = jest.spyOn(User, 'findOne').mockResolvedValue(null);
//         await getUserById(copymockRequest, mockResponse);

//         expect(findOneSpy).toHaveBeenCalledWith({_id: copymockRequest.params.id});
//         expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
//         expect(mockResponse.sendStatus).toHaveBeenCalledTimes(1);
//         expect(mockResponse.send).not.toHaveBeenCalled();
//     });
// });


describe('create users', ()=>{
    const copymockRequest = {...mockRequest};

    it('should return a status of 400 when there are errors', async ()=>{
        await createNewUser(copymockRequest, mockResponse);
        expect(validator.validationResult).toHaveBeenCalled();
        expect(validator.validationResult).toHaveBeenCalledWith(copymockRequest);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith([{msg: "Invalid Field"}]);
    });

    it('should return a status of 201 and the user created', async ()=>{

        jest.spyOn(validator, 'validationResult').mockImplementationOnce(()=>({
            isEmpty: jest.fn(()=> true),
        }));

        const saveMethod = jest.spyOn(User.prototype, "save").mockResolvedValueOnce({
            id: 1,
            username: "Joe", 
            password: "hashed_hello123",
            displayname: "Joe123",
        });

        await createNewUser(copymockRequest, mockResponse);
        expect(validator.matchedData).toHaveBeenCalledWith(mockRequest);
        expect(helpers.hashPassword).toHaveBeenCalledWith('hello123');
        expect(helpers.hashPassword).toHaveReturnedWith('hashed_hello123');
        expect(User).toHaveBeenCalledWith({
            username: "Joe", 
            password: "hashed_hello123",
            displayname: "Joe123",
        });
        
        expect(saveMethod).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.send).toHaveBeenCalledWith({
            id: 1,
            username: "Joe", 
            password: "hashed_hello123",
            displayname: "Joe123",
        })
    });

    it('should send a status of 400 when db fails to save user ', async ()=>{
        jest.spyOn(validator, 'validationResult').mockImplementationOnce(()=>({
            isEmpty: jest.fn(()=> true),
        }));

        const saveMethod = jest.spyOn(User.prototype, "save").mockImplementationOnce(() => Promise.reject("Failed to save user"))

        await createNewUser(copymockRequest, mockResponse);
        expect(saveMethod).toHaveBeenCalled;
        expect(mockResponse.status).toHaveBeenCalledWith(400);
    })
})