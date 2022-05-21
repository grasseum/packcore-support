const reviewImportName = function(content){

    if(/\'/.test(content) )
    {
        return '"'+content+'"'
    }
    return "'"+content+"'"
}

const removeNewLine = function(content){

    if(content){
        return content.replace(/\n/g,"")
    }
    
    return content
}

function cleanCodePerLine(str){
     
    str=str.replace(/([\;]{2,})/g,"\n")
    str=str.replace(/[\n]{2,}/g,"\n\n");

    return str
}
function cleanExportImportVariable(str){
    return str.replace(/[\;]/g,"");
}

exports.reviewImportName =reviewImportName;

exports.removeNewLine =removeNewLine;

exports.cleanCodePerLine =cleanCodePerLine;
exports.cleanExportImportVariable =cleanExportImportVariable;