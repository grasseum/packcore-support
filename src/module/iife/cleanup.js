

function convertToVar(str){
    return str.replace(/([\s\n\r\t]{0,})(const|let)\s{1,}/g,"$1var ");
}


exports.convertToVar =convertToVar;
