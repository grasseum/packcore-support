
const {jsrequire} = require('path-assist');
const {has,isEmpty,each,arrayConcat,map ,count} = require("structkit");
const { cwd } =require('process');
const keyImportFile = "import_file";

const {getScrapeDataPrep} = require("./invoke")

const preInlineConvert = async function(content,currentPath){

  //return getScrapeDataPrep(content,currentPath);
}

const getInlineScriptFromFile = async function(config,pluginConfig,sessionData){


 let data  = [];
 const isImportReference = sessionData.getByKey(keyImportFile)
if( count(isImportReference) ===0 ){
  sessionData.setInitialKey(keyImportFile,[]);
 }
 
 
  const  prep = await getScrapeDataPrep(data,pluginConfig,sessionData,config.contents,jsrequire.joinPath( cwd(), config.path),true ,{})+"\n"

  return prep;
}

exports.preInlineConvert = preInlineConvert;

exports.getInlineScriptFromFile = getInlineScriptFromFile;
