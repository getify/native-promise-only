if(!Array.isArray) {
	Array.isArray = function $isArray$(arg) {
		return Object.prototype.toString.call(arg) == "[object Array]";
	};
}
