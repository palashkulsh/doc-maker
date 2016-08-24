var LibUtils = require('./lib/utils');

function makeComment(options, curKey,type){
    var commentType = options.commentType || '@apiParam';
    return ' '+commentType+' {'+type+'} '+curKey+' ';
}

function processPrimitive (options, data,curKey,primitiveType){
    return [makeComment(options, curKey,primitiveType)];
}

function processArray(options, data,curKey){
    var commentData = [];
    if(!data && !data.length){
	return [];
    }
    commentData.push(makeComment(options, curKey,'Object[]'));
    var tempKey = curKey
    commentData.push.apply(commentData,processObject(options, LibUtils.getArrayElement(data),curKey));
    return commentData;
}

function processMap(options, data,curKey){
    var commentData=[];
    commentData.push(makeComment(options, curKey,'object'));
    var tempKey,tempArr;
    Object.keys(data).forEach(function(key){
	tempKey=[curKey,key].join('.');
	commentData.push.apply(commentData,processObject(options, data[key],tempKey));
    });
    return commentData;
}

function processObject(options,data,curKey){
    var commentData=[];
    if(!data){
	return commentData;
    }
    else if(Array.isArray(data)){
	commentData = processArray(options, data,curKey);
    }else if(typeof(data)=='object'){
	commentData = processMap(options, data,curKey);
    }else if(typeof(data)=='string'){
	commentData = processPrimitive(options, data,curKey,'string');
    }else if(typeof(data)=='number'){
	commentData = processPrimitive(options, data,curKey,'number');
    }else if(typeof(data)=='boolean'){
	commentData = processPrimitive(options, data,curKey,'boolean');
    }
    return commentData;
}

function process (options,data,curKey){
    return processObject(options,data,curKey);
}

module.exports={
    process: process
};

(function(){
    if(require.main==module){
	var o={
	    a:1,
	    b:2,
	    c:'str'
	};
	console.log(processObject({},o,'data'))
    }
})();
