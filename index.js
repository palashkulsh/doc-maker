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

function make_comments(input,cb){    
    var validInput,validSuccess,commentData,successCommentData,successExampleData,failureCommentData,failureExampleData;    
    var finalCommentData=[];
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
	Fs.writeFile('/tmp/comment.js',finalCommentData.join('\n'),cb);
    });
}

(function(){
    if(require.main==module){
	var rule={

	    "rule": {
		"id": 3986,
		"description": "TATA Power Distribution p. ltd.",
		"type": "PAYMENT",
		"value_cap": null
	    },
	    "actionConstraints": [
		{
		    "action": {
			"id": 4030,
			"description": "DebitCard",
			"return_value": "10.0",
			"return_value_type": "PERCENTAGE",
			"return_value_cap": "11.4",
			"return_value_min": "5.4"
		    },
		    "constraints": [
			{
			    "action_id": 4030,
			    "rule_key": "PAYMENTMETHOD",
			    "rule_value": "DC",
			    "rule_operator": "=="
			},
			{
			    "action_id": 4030,
			    "rule_key": "PAYMENTVALUE",
			    "rule_value": 5000,
			    "rule_operator": ">"
			}
		    ]
		},
		{
		    "action": {
			"id": 4042,
			"description": "IMPS",
			"return_value": 0,
			"return_value_type": "PERCENTAGE",
			"return_value_cap": null,
			"return_value_min": null
		    },
		    "constraints": [
			{
			    "action_id": 4042,
			    "rule_key": "PAYMENTMETHOD",
			    "rule_value": "IMPS",
			    "rule_operator": "=="
			},
			{
			    "action_id": 4042,
			    "rule_key": "PAYMENTVALUE",
			    "rule_value": 5000,
			    "rule_operator": ">"
			}
		    ]
		}
	    ]
	};
	var updateOpts = {
	    rule_id: 3999,
	    actionConstraints: [{
		"action": {
		    "description": "Paytm gollet",
		    "id": 2,
		    "return_value": 15,
		    "return_value_cap": null,
		    "return_value_min": 1,
		    "return_value_type": "percentage"
		},
		"constraints": [{
		    "rule_key": "paymentmethod",
		    "rule_operator": "==",
		    "rule_value": "NB"
		}]
	    }]
	};
	var priceOpts={
	    "data": {
		"price": 50,
		"id":24424,
		"qty":3,
		"shipping_charge": 400000
	    },
	    "existing_data": {
		"price": 123,
		"id":24424,
		"qty":0,
		"shipping_charge": 40
	    },
	    "type":4
	};
	var successpriceOpts={
	    "data": {
		"price": 50,
		"id":24424,
		"qty":3,
		"shipping_charge": 40
	    },
	    "existing_data": {
		"price": 50,
		"id":24424,
		"qty":3,
		"shipping_charge": 40
	    },
	    "type":4
	};

	var input = {
	    uri:'http://localhost:2191/v2/commissions/admin/product/check',
	    method:'post',
	    success: [successpriceOpts],
	    failure: [priceOpts]
	};
	// console.log(processObject({commentType: '@apiSuccess'},rule,'input'))
	make_comments(input,function (err,result){
	    console.log(err,result);
	})
    }
})();
