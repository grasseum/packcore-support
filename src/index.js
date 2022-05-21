const cjs = require("./types/cjs");
const esm = require("./types/esm");
const iife = require("./types/iife");

const others = require("./types/others");

module.exports = (output)=>{
    const type = output.type;
    const config = output.config;

    if (type ==="cjs"){
        return cjs(config);
    } else if (type ==="esm"){
        return esm(config);
    }else if (type ==="iife"){
        return iife(config);
    }
    else{
        return others();
    }

}