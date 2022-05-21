var regexp_export = /([\/\*]{0,})(export\s{1,}default)\s{1,}([\.\,\\\/\;\w]{1,})/g;
var regexp_import = /([\/\*]{0,})import\s{1,}([\{]{0,}[\w\s,]{0,}[\}]{0,})\s{1,}from\s{1,}[\'\"]{0,}([\.\,\\\/\w]{1,})[\'\"\;]{0,}/g;

var requireImport = /([\/\*]{0,})([\{]{0,}[\w\s,]{0,}[\}]{0,})\s{0,}=\s{0,}require\s{0,}\(\s{0,}[\'\"]{0,}([\.\,\\\/\w]{1,})[\'\"\;]{0,}\s{0,}\)/g;
var requireExport = /([\/\*]{0,})(module.exports|exports\.[\w\s,]{0,})\s{0,}=\s{0,}/g;

exports.regexpExport = regexp_export;
exports.regexpImport = regexp_import;
exports.requireImport = requireImport;
exports.requireExport = requireExport;

