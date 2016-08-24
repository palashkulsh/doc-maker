var Requestor = require('./requestor');
var CommentMaker = require('./comment_maker');
var LibUtils = require('./lib/utils');
var Fs = require('fs');

function getApi(input){
    return [' @api {'+input.method+'} '+input.uri];
}

function getVersion(input){
    return [' @apiVersion '+(input.version||'0.0.1')];
}

function getApiName(input){
    return [' @apiName '];
}

function getApiDescription(input){
    return [' @apiDescription '];
}

function getApiGroup(input){
    return [' @apiGroup '];
}

function getSuccessExampleData(input){
    var commentData=[];
    input.success && input.success.forEach(function (eachSuccess){
	commentData.push(' @apiSuccessExample {JSON} Success-Response')
	commentData.push(JSON.stringify(eachSuccess,null,4));
    });
    return commentData;
}

function getFailureExampleData(input){
    var commentData=[];
    input.failure && input.failure.forEach(function (eachFailure){
	commentData.push(' @apiErrorExample {JSON} Error-Response')
	commentData.push(JSON.stringify(eachFailure,null,4));
    });
    return commentData;
}

function getParamExampleData(input){
    var commentData=[];
    input.success && input.success.forEach(function (eachSuccess){
	commentData.push(' @apiParamExample {JSON} Request-Example:')
	commentData.push(JSON.stringify(eachSuccess,null,4));
    });
    return commentData;
}

//this function need refactoring
function make_comments(input,cb){    
    var validInput,validSuccess,commentData,successCommentData,successExampleData,failureCommentData,failureExampleData;    
    var finalCommentData=['\**'];
    //making comments for general things like name,group,description etc
    if(input.success && input.success.length){
	validInput=LibUtils.getArrayElement(input.success);
	if(validInput)
	    commentData = CommentMaker.process({},validInput,'input');	
    }    
    Requestor.main(input,function (err, result){
	if(err){
	    return cb(err);
	}
	if(result && result.success){
	    validSuccess = LibUtils.getArrayElement(result.success);
	    if(validSuccess){
		successCommentData = CommentMaker.process({commentType: '@apiSuccess'},validSuccess,'success');
	    }
	    successExampleData = getSuccessExampleData(result);	
	}
	if(result && result.failure){
	    validFailure = LibUtils.getArrayElement(result.failure);
	    if(validFailure){
		failureCommentData = CommentMaker.process({commentType: '@apiError'},validFailure,'failure');
	    }
	    failureExampleData = getFailureExampleData(result);	
	}

	[getApi(input),getVersion(input),getApiName(input),getApiGroup(input),getApiDescription(input),commentData,getParamExampleData(input),successCommentData,successExampleData,failureCommentData,failureExampleData].forEach(function (eachComm){
	    finalCommentData.push.apply(finalCommentData,eachComm);
	});
	finalCommentData.push('*/');
	Fs.writeFile(input.outputFilePath,finalCommentData.join('\n'),cb);
    });
}

module.exports={
    make_comments:make_comments
};

(function(){
    if(require.main==module){
	var input = {
	    uri:'http://localhost:2191/some/api/check',
	    method:'post',
	    success: [{}],
	    failure: [{}],
	    outputFilePath:'/tmp/comment.js'
	};
	make_comments(input,function (err,result){
	    console.log(err,result);
	})
    }
})();
