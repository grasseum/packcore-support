
const {getInlineScriptFromFile,postCodeConvert} = require("../module/iife/extract")

const {removeNewLine,cleanCodePerLine,cleanExportImportVariable} = require("../support/cleanup")

module.exports = (config)=>{
    
    return {
        transform : async (config,pluginConfig)=>{
        
        },
        transformFirstFile : async (config,pluginConfig)=>{

           if(pluginConfig.output.globalName ==="default"){
            const data=  '(function(global){\n'+config.content
            return data
           } else {
            let  data=  '(function(global){\n'
            data+="global."+pluginConfig.output.globalName+"={}\n"+config.content
            return data
           }
           
           
        },
        transformLastFile : async (config,pluginConfig)=>{ 
        
           const data=  config.content+'\n})(typeof window !== "undefined" ? window : this);'
           return  cleanCodePerLine(data);
        },
        write :async (config)=>{
            return null;
        },
        read :async (config,pluginConfig,sessionData)=>{ 
            const data = await getInlineScriptFromFile(config,pluginConfig,sessionData)
            return data;
        }
    }

}
