(function(){
    var x = {}, y = function(){};

    try {
	// dammit, IE8
	Object.defineProperty(x,"x",x);
	// dammit, Android
	Object.defineProperty(y,"prototype",{ value: x });
	if (y.prototype !== x) throw x;
    }
    catch(e) {
	(Object.defineProperty || x).NPO_AVOID = true;
    }
}());
