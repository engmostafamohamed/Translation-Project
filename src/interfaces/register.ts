export interface registerControllerInterface{
    registerNewUser(userDetails: RegisterModelInterface): Promise<{ message: string }>
    verifyAccount(token:string):Promise<{message:string}>

}
export interface VerifyModelInterface{
    token:string
}
export interface RegisterModelInterface{
    userName:string,
    email:string,
    password:string,
    password_confirmation:string
}
export interface registerServiceInterface{
    validateEmail(email:string):boolean,
    validateUserName(userName:string):boolean
}
export interface UserModelInterface {
    username: string,
    password: string,
    email: string,
    isVerified: string,
    emailToken: string,
    _id: object,
    createdAt: string,
    modifiedAt: string,
    __v: string
}
// {
//     username: 'mostafa',
//     password: '$2b$10$SobeNfyuX1Z0coJgmYzSC.ZU3vGyt9xgUDrEb1yrKczQ/lMGMQDOq',
//     email: 'eng.mostafa15@gmail.com',
//     isVerified: false,
//     emailToken: '456aa5b4aed73db4800433ee296b75ae32470dbcf5909baf0da9206b6b09574e93d0c121d956f93d6d3f4a7fece964aa27d5ee431879904ac3aa80ce1c7a455d',
//     _id: new ObjectId("6575d244b6c1a337609fb9ff"),
//     createdAt: 2023-12-10T14:59:16.209Z,
//     modifiedAt: 2023-12-10T14:59:16.209Z,
//     __v: 0
// }