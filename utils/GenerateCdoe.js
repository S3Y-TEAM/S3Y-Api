const generateCode = async(codeSize)=>{
    let codeNumber  = [];
    while(codeSize > 0){
        let randomNumber = Math.floor(Math.random()*10);
        codeNumber.push(randomNumber) ;
        codeSize-- ;
    }
    let stringCodeNumber = codeNumber.join('') ;
    return stringCodeNumber ;
}
export {
    generateCode
}