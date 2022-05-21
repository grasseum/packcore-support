
const {remove,clone,count} = require("structkit");
const {reviewImportName} = require("../support/cleanup")
const cleanup = require("../support/cleanup")
const {script} = require("pack-extract");

module.exports = (config)=>{
    const externalExportList = [];
    const templateConvert= function(content,reference){
        const importReference = reference['import']
        const exportReference = reference['export']
        if(count(importReference)>0){
            const valueCopy = clone(reference['import'])[0]
            reference['import'] = remove(reference['import'],0 );

            const content1 = content.replace( valueCopy.raw ,function(s){return "import "+valueCopy.arguments+" from "+cleanup.cleanExportImportVariable(reviewImportName(valueCopy.source))+";\n"});
            return templateConvert(content1,reference)
        } else {
            if(count(exportReference)>0){
                const valueCopy = clone(reference['export'])[0]
                reference['export'] = remove(reference['export'],0 );
                
                content = content.replace( valueCopy.raw ,function(whole){
                
                    if(valueCopy.isDefault){

                       return "export default "+cleanup.cleanExportImportVariable(valueCopy.source)+";\n";

                 } else {
                    
                    if(/(\{|function)/g.test(valueCopy.source.trim())){

                        const exportArg = valueCopy.arguments.split(".");
                        const exportRaw = valueCopy.raw.split(".");

                        if (count(exportArg)>1){

                            let returnContent = "const "+exportRaw[1];
                           // returnContent+="export {"+cleanup.cleanExportImportVariable(exportArg[1])+"};\n"
                           externalExportList.push(cleanup.cleanExportImportVariable(exportArg[1]));
                            return returnContent;
                        }
                        return whole;
                    }else{
                        externalExportList.push( cleanup.cleanExportImportVariable(valueCopy.source) );
                        return ""//"export {"+cleanup.cleanExportImportVariable(valueCopy.source)+"};\n";

                    }
                    
                   }

                });
                
                return templateConvert(content,reference)
            }
            else{
                if (count(externalExportList)>0){
                    content+="\nexport {"+externalExportList.join(",").trim()+"};\n"
                }
                return content;
            }
        }
    }
    return {
        transform : async (config,pluginConfig)=>{
            const data = script(config.content)
           
            let dataReference = {"import":clone(data['cjs'].import),"export" : clone(data['cjs'].export)};
            let strReplace = config.content;
         
            return cleanup.cleanCodePerLine(templateConvert(strReplace,dataReference))
            
        },
        transformFirstFile : async (config,pluginConfig)=>{
            return null;
        },
        transformLastFile : async (config,pluginConfig)=>{
            return null;
        },
        write :async (config,pluginConfig)=>{
            return null;
        },
        read :async (config,pluginConfig,sessionData)=>{
          //  const data = scrape(config.content)
           
          //  let dataReference = {"import":clone(data['cjs'].import),"export" : clone(data['cjs'].export)};
          //  console.log(dataReference,"::dataReference")
            return null;
        }
    }

}
