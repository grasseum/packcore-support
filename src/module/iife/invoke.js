const {has,isEmpty,where,map,arrayConcat,clone,each,count,remove,varExtend,asyncReplace} = require("structkit");
//const scrape = require("../../support/scrape")
const {script} = require("pack-extract");
const { cwd } =require('process');
const {jsrequire} = require('path-assist');
const fs = require("fs");
const {removeNewLine,cleanCodePerLine,cleanExportImportVariable} = require("../../support/cleanup")
const {convertToVar} = require("./cleanup");
const { resolve } = require("path");
const { delimiter} = require("structkit");

const keyImportFile = "import_file";
const cleanImportData = function(content,path,session,importData){

    if( count(importData) ===0){
        return content;
    }
    const isImportReference = session.getByKey(keyImportFile)
    const importReference   = importData[0]
    const rawPath = jsrequire.joinPath( path, importReference.source)
   
   // if ( isImportReference.indexOf(rawPath) >-1){
       
    content = content.replace(importReference.raw,function(whole){
        return ""
    })
//}
    importData.shift()
    return cleanImportData(content,importData)
    
}

const getImportData = async function(referenceData,pluginConfig ,session,content,path ,importValue,isParent){

    const isImportReference = session.getByKey(keyImportFile)
    
    if( count(importValue) >0 ){
        
        const importReference = clone(importValue[0])
        const rawPath = jsrequire.joinPath( path, importReference.source)
        importValue.shift()
        if ( jsrequire.isLocalPath(importReference.source)){

           
            if (isImportReference.indexOf(rawPath) === -1){
             
                session.setValue(keyImportFile,rawPath) 

               content = await asyncReplace(content, importReference.raw, async (match, name) => {

                let contentFile=   await fs.readFileSync(rawPath,"utf8")
                const finalContentFile =  await getScrapeDataPrep(referenceData,pluginConfig,session,contentFile,rawPath ,false,importReference);
                    return finalContentFile;
              });
           
                
               if(isParent ){
                const data = script(content)
                let dataReference = {
                    "import":  arrayConcat(clone(data['cjs'].import),clone(data['esm'].import)),
                    "export" : arrayConcat(clone(data['cjs'].export),clone(data['esm'].export))
               };
              //?  content = cleanImportData(content,path,session,dataReference['import']); 
               }
               
              return await getImportData(referenceData,pluginConfig ,session, content ,path ,importValue,isParent)
            }else{
                
                const data = script(content)
               let dataReference = {
                    "import":  arrayConcat(clone(data['cjs'].import),clone(data['esm'].import)),
                    "export" : arrayConcat(clone(data['cjs'].export),clone(data['esm'].export))
               };
                content = content.replace(importReference.raw,function(whole){
                      return ""
                   })
                //   content = cleanImportData(content,path,session,dataReference['import']); 
                return await getImportData(referenceData,pluginConfig ,session, content,path ,importValue,isParent)
            }
        }else{
            
            if(/(^\{)/g.test(importReference.arguments)){
                let referenceSource = importReference.source;
                if(has(pluginConfig.input.modules.replaces , importReference.source) ){
                    referenceSource = pluginConfig.input.modules.replaces[importReference.source];
                }
                const cleanArguments= importReference.arguments.replace(/^\{/g,"(").replace(/}$/g,")").replace(/,/g,"|").replace(/\s/g,"")
                const regexpArguments = new RegExp("([\\.]{0,})"+cleanArguments+"[\\s]{0,}\\(","g")
                content = content.replace(regexpArguments,function(whole,s1,s2,s3){
                    
                    if(/[\.]/g.test(s1)) {
                        return whole
                    }
                   if(isEmpty(referenceSource)){
                        return whole
                   }
                   
                    return referenceSource.trim()+"."+whole.trim()
              });
            }   
            content = content.replace(importReference.raw,function(whole){

                 return ""
             });

            return await getImportData(referenceData,pluginConfig ,session,content,path ,importValue,isParent)
        }
        
    }else{

        return content;
    }
    
}

const getExportData = async function(referenceData,pluginConfig ,session,content,path ,isParent,exportValue,importReference){

    if( count(exportValue) >0 ){
        const exportReference = clone(exportValue[0])
        exportValue.shift();
        
        if (isParent){
            content = content.replace(exportReference.raw ,function(whole,s1){

                if(exportReference.isDefault ){
               
                    if(/(function)/g.test(exportReference.source)){
                        console.log("ss1")

                    }
                   return (pluginConfig.output.globalName ==="default"?"global.":pluginConfig.output.globalName+".")+cleanExportImportVariable(exportReference.source).trim() +"="+ cleanExportImportVariable(exportReference.source).trim();
                }
                 else{
                    if(/(function)/g.test(exportReference.source)){
                        const functionName = exportReference.arguments.split(".");
                        return (pluginConfig.output.globalName ==="default"?"":pluginConfig.output.globalName+".")+cleanExportImportVariable( functionName.length > 1?functionName[1]:"default" ).trim() +"="+ cleanExportImportVariable(exportReference.source).trim()

                    }
                    return (pluginConfig.output.globalName ==="default"?"":pluginConfig.output.globalName+".")+cleanExportImportVariable(exportReference.source).trim() +"="+ cleanExportImportVariable(exportReference.source).trim()
                 }
            });
            return await getExportData(referenceData,pluginConfig ,session,content,path ,isParent,exportValue,importReference);
        } else {

            content = content.replace(exportReference.raw ,function(whole,s1){
              
                
            if(exportReference.isDefault ){
                
                if( !/(function)/g.test(exportReference.source) && !/(function)/g.test(importReference.arguments) ){
                    //console.log(exportReference,importReference,"::export")
                    const trimSource =cleanExportImportVariable(exportReference.source).trim()
                   const trimArguments =cleanExportImportVariable(importReference.arguments).trim()
                    if ( trimSource !==trimArguments){
                       // console.log("ss_default",trimSource," !==",trimArguments)
                       return   trimArguments+"="+trimSource;
                    }

                }
                return ""
            }

            if(/(^\{|^function\n{0,})/g.test(exportReference.source.trim())){ 
                const splitRaw = exportReference.raw.split(".")
                
                if(splitRaw.length > 0){
                    return delimiter(splitRaw,1).join(".")
                }
                return ""

            }

            if(/(^\{)/g.test(importReference.arguments.trim())){ 

                return ""

            }
            
             
            else {
                if(importReference.arguments != exportReference.arguments){
                    return cleanExportImportVariable(importReference.arguments).trim() +"="+ cleanExportImportVariable(exportReference.arguments).trim();
                }

                return ""
            }
                    
            });
        }
            return await getExportData(referenceData,pluginConfig ,session,content,path ,isParent,exportValue,importReference);
        

    } else {

        return content;

    }

}

const getScrapeDataPrep = async function(referenceData,pluginConfig ,session,content,path ,isParent,importReference){
   
    const data = script(content)
    let dataReference = {
        "import":  arrayConcat(clone(data['cjs'].import),clone(data['esm'].import)),
        "export" : arrayConcat(clone(data['cjs'].export),clone(data['esm'].export))
   };
   
 let referenceContent = await getImportData( referenceData,pluginConfig ,session,content,path ,dataReference['import'] ,isParent)

 referenceContent = await getExportData(referenceData,pluginConfig ,session,referenceContent,path ,isParent,dataReference['export'],importReference)
 referenceContent = convertToVar(referenceContent);
 referenceContent = cleanCodePerLine(referenceContent);
 
   return referenceContent;
}

exports.getScrapeDataPrep = getScrapeDataPrep;
