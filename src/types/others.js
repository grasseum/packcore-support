
const {has,varExtend} = require("structkit");

module.exports = (config)=>{
    
    return {
        transform : async (config,pluginConfig)=>{
            return null;
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
            return null;
        }
    }

}
