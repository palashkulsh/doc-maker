
function getArrayElement(arr){
    var maxKeys=0,maxKeysObject={};
    if(typeof(arr) !=='object'){
	return arr[0];
    }
    arr.forEach(function(el,index){
	if(el && Object.keys(el).length>maxKeys){
	    maxKeys=Object.keys(el).length;
	    maxKeysObject=el;
	}
    });
    return maxKeysObject;
}

module.exports={
    getArrayElement:getArrayElement
};
