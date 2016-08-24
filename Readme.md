# doc-maker
It helps to make documentation using [apidoc](https://www.npmjs.com/package/apidoc) npm extension. what it basically does is that it makes basic skeleton to be used before you actually complete the documentation. To see apidoc documentation visit [here](http://apidocjs.com/)

Currently it saves the documentation in /tmp/comment.js  file.

### Installation
To install type - ```npm install  doc-maker ```

### Usage
Basic usage: To test the basic usage
``` js
var DocMaker = require('doc-maker');
(function(){
    if(require.main==module){
	var input = {
	    uri: 'localhost:2191/some/api/check', //uri to your api which will be called,
	    method: 'POST', //type of http api call GET/POST supported
	    success: [{a:1,b:2},{a:3,b:4}], //input to the uri which will give successful result 
	    failure: [{a:1},{b:2},{}], //input to the uri which will give unsuccessful result
	    outputFilePath:'/tmp/comment.js' //location where the output data will be finally written
	};
	//now just call the make_comments function with your input
	DocMaker.make_comments(input,function (err){
	    if(err){
		    console.log(err);	
	    }
	    console.log('all  done');
	});
    }
})();

```

 #### Input: detailed information of the input 
 accepted by ```make_comments``` function

##### uri
Uri which is to be hit to get the response. Eg. localhost:2191/some/api/check

##### method
HTTP method which has to be made like GET/POST (these 2 supported till now)

##### success[]
Array  of multiple input to the uri which will give successful results. Each element of the array must be valid input to the uri. Eg if some API 
```
POST localhost:2191/some/api/check 
```

accepts input of the form ```{a:1,b:2}``` then the success array  will have something like ```[{a:1,b:2},{a:3,b:4}]```

##### failure[]
Array of multiple input which will give error response for the api request. The result of the api must be provided in the body. for eg.

```
POST localhost:2191/some/api/check
```
with data {a:1} gives HTTP error status ```409``` and also gives response ```{missing:['b']}``` in the response body

So multiple failure case input must be given like ```[{a:1},{a:2},{a:3}]```

##### outputFilePath
Location where the final comment file will be finally written. Eg. ```/tmp/comment.js``` in our above example.

### Format of the Output
Finally when the program is run then /tmp/comment.js file will look like shown below. You can now skip the tedious task of writing the data , rather you can just concentrate on writing the information. like param description etc.

```
 @api {post} localhost:2191/some/api/check
 @apiVersion 0.0.1
 @apiName 
 @apiGroup 
 @apiDescription 
 @apiParam {object} input 
 @apiParam {number} input.a 
 @apiParam {number} input.b 
 @apiParamExample {JSON} Request-Example:
{
    "a": 1,
    "b": 2
}
 @apiParamExample {JSON} Request-Example:
{
    "a": 3,
    "b": 4
}
 @apiSuccess {object} success 
 @apiSuccessExample {JSON} Success-Response

 @apiSuccessExample {JSON} Success-Response

 @apiError {object} failure 
 @apiErrorExample {JSON} Error-Response

 @apiErrorExample {JSON} Error-Response

 @apiErrorExample {JSON} Error-Response
/tmp/comment.js (END)

```

