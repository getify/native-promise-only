// Native Promise Only - (c) 2014 Kyle Simpson - MIT License

(function UMD(name,context,definition){
	if (typeof module !== "undefined" && module.exports) { module.exports = definition(); }
	else if (typeof define === "function" && define.amd) { define(definition); }
	else { context[name] = context[name] || definition(name,context); }
})("Promise",this,function DEF(name,context){
	"use strict";
	
	// TODO
	
	var publicAPI = {};
	
	return publicAPI;
});
