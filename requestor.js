var Request = require('request');
var Async = require('async');

function makeRequest(reqOpts,cb){
    var validCodes = [200];
    console.log(JSON.stringify(reqOpts,null,4))
    Request(reqOpts, function (err, res, body) {
        if (!err && (!res || validCodes.indexOf(res.statusCode) == -1)) {
            console.log('HTTP API  Error');
            err = new Error('HTTP API Error');
            err.status = res && res.statusCode;
        }
        if (err) {
            return cb(err,body);
        }
        return cb(null, body);
    });
}

function iterator(requestOptions, iter,callback){
    requestOptions[requestOptions.dataKey]=iter;
    makeRequest(requestOptions,function (err,result){
	return callback(null,result);
    });
}

/**
   input= {
   method: 'GET/POST'
   url:'someurl',
   success: [],
   failure: []
   
   }
*/
function main(input,cb){
    var commentData=[];
    var requestOptions ={
	method: input.method.toUpperCase(),
	uri: input.uri,
	json:true
    };
    var dataKey;
    if(input.method.toUpperCase()=='GET'){
	dataKey='qs';
    }else if(input.method.toUpperCase()=='POST'){
	dataKey='body';
    }
    requestOptions.dataKey = dataKey;
    Async.series({
	success:function(sCallback){
	    if(input.success){
		Async.mapSeries(input.success,iterator.bind(null,requestOptions),function(err,result){
		    input.success.forEach(function (eachObj,index){
			var temp={};
			temp.input=eachObj;
			temp.output=result[index];
		    });
		    return sCallback(null,result);
		});
	    }else{
		return sCallback(null,[]);
	    }
	},
	failure:function(sCallback){
	    if(input.failure){
		Async.mapSeries(input.failure,iterator.bind(null,requestOptions),function(err,result){
		    input.failure.forEach(function (eachObj,index){
			var temp={};
			temp.input=eachObj;
			temp.output=result[index];
		    });
		    return sCallback(null,result)
		});
	    }else{
		return sCallback(null,[]);
	    }
	}
    },function (err,result){
	return cb(err,result);
    });
}

module.exports={
    main:main
};

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
			"id": 4034,
			"description": "PaytmWallet",
			"return_value": 0,
			"return_value_type": "PERCENTAGE",
			"return_value_cap": null,
			"return_value_min": null
		    },
		    "constraints": [
			{
			    "action_id": 4034,
			    "rule_key": "PAYMENTMETHOD",
			    "rule_value": "PAYTM_CASH",
			    "rule_operator": "=="
			}
		    ]
		},
		{
		    "action": {
			"id": 4036,
			"description": "DebitCard",
			"return_value": "0",
			"return_value_type": "PERCENTAGE",
			"return_value_cap": null,
			"return_value_min": null
		    },
		    "constraints": [
			{
			    "action_id": 4036,
			    "rule_key": "PAYMENTMETHOD",
			    "rule_value": "DC",
			    "rule_operator": "=="
			},
			{
			    "action_id": 4036,
			    "rule_key": "PAYMENTVALUE",
			    "rule_value": 5000,
			    "rule_operator": "<="
			}
		    ]
		},
		{
		    "action": {
			"id": 4038,
			"description": "Netbanking",
			"return_value": 0.75,
			"return_value_type": "PERCENTAGE",
			"return_value_cap": null,
			"return_value_min": null
		    },
		    "constraints": [
			{
			    "action_id": 4038,
			    "rule_key": "PAYMENTMETHOD",
			    "rule_value": "NB",
			    "rule_operator": "=="
			},
			{
			    "action_id": 4038,
			    "rule_key": "PAYMENTVALUE",
			    "rule_value": 5000,
			    "rule_operator": "<="
			}
		    ]
		},
		{
		    "action": {
			"id": 4039,
			"description": "Netbanking",
			"return_value": 0,
			"return_value_type": "PERCENTAGE",
			"return_value_cap": null,
			"return_value_min": null
		    },
		    "constraints": [
			{
			    "action_id": 4039,
			    "rule_key": "PAYMENTMETHOD",
			    "rule_value": "NB",
			    "rule_operator": "=="
			},
			{
			    "action_id": 4039,
			    "rule_key": "PAYMENTVALUE",
			    "rule_value": 5000,
			    "rule_operator": ">"
			}
		    ]
		},
		{
		    "action": {
			"id": 4040,
			"description": "creditcard",
			"return_value": 0,
			"return_value_type": "PERCENTAGE",
			"return_value_cap": null,
			"return_value_min": null
		    },
		    "constraints": [
			{
			    "action_id": 4040,
			    "rule_key": "PAYMENTMETHOD",
			    "rule_value": "CC",
			    "rule_operator": "=="
			}
		    ]
		},
		{
		    "action": {
			"id": 4041,
			"description": "IMPS",
			"return_value": 0.75,
			"return_value_type": "PERCENTAGE",
			"return_value_cap": null,
			"return_value_min": null
		    },
		    "constraints": [
			{
			    "action_id": 4041,
			    "rule_key": "PAYMENTMETHOD",
			    "rule_value": "IMPS",
			    "rule_operator": "=="
			},
			{
			    "action_id": 4041,
			    "rule_key": "PAYMENTVALUE",
			    "rule_value": 5000,
			    "rule_operator": "<="
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
	var input = {
	    uri:'http://localhost:2191/v2/payouts/admin/rule/set',
	    method:'post',
	    success: [rule,rule,rule]
	};
	// console.log(processObject({commentType: '@apiSuccess'},rule,'input'))
	main(input,function (err,result){
	    console.log(err,result);
	})

    }
})();
