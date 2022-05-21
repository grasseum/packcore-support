
const {remove,clone,count} = require("structkit");
const {script} = require("pack-extract");
const {reviewImportName,cleanCodePerLine} = require("../support/cleanup")

module.exports = (config)=>{
    
    const templateConvert= function(content,reference){
        const importReference = reference['import']
        const exportReference = reference['export']
        if(count(importReference)>0){
            const valueCopy = clone(reference['import'])[0]
            reference['import'] = remove(reference['import'],0 );
            const content1 = content.replace( valueCopy.raw ,function(s){
                if(/(default\s{1,}as\s{1,})/g.test(valueCopy.arguments)){
                    const defaultArg = valueCopy.arguments.replace(/(default\s{1,}as\s{1,})/g,"").replace(/([\{\}]{1,})/g,"");
                    return "const "+defaultArg+" = require("+reviewImportName(valueCopy.source)+");\n\n"
                }
                return "const "+valueCopy.arguments+" = require("+reviewImportName(valueCopy.source)+");\n\n"
            });
            return templateConvert(content1,reference)
        } else {
            if(count(exportReference)>0){
               
                const valueCopy = clone(reference['export'])[0]
                reference['export'] = remove(reference['export'],0 );
              
                content = content.replace( valueCopy.raw ,function(s){
                
                    if(valueCopy.isDefault){
                    return "module.exports="+valueCopy.arguments+"\n";
                    }else{
                        if (/\b(export\s{1,}const)\b/g.test(valueCopy.raw)){
                            return "exports."+valueCopy.arguments;
                        }
                        if (/([\{\}]{1,})/g.test(valueCopy.arguments) && /([\{\}]{1,})/g.test(valueCopy.source)){
                             const defaultArg = valueCopy.arguments.replace(/([\{\}]{1,})/g,"");
                             return "exports."+defaultArg+"="+defaultArg+"\n";
                        }
                        return "exports."+valueCopy.arguments+"="+valueCopy.source+"\n";
                    }
                
                });
                return templateConvert(content,reference)
            }
            else{
                return content;
            }
        }
    }
    return {
        transform : async (config,pluginConfig)=>{
            const data = script(config.content)
           
            let dataReference = {"import":clone(data['esm'].import),"export" : clone(data['esm'].export)};
            let strReplace = config.content;
         
            return cleanCodePerLine(templateConvert(strReplace,dataReference))
            
        },
        transformFirstFile : async (config,pluginConfig)=>{
            return null;
        },
        transformLastFile : async (config,pluginConfig)=>{
            return null;
        },
        write :async (config)=>{
            return null;
        },
        read :async (config,pluginConfig,sessionData)=>{
            const data = script(config.contents)
           
            let dataReference = {"import":clone(data['esm'].import),"export" : clone(data['esm'].export)};
          //  console.log(dataReference,config.path,"::dataReference")
            
            return null;
        }
    }

}
