var DocMaker = require('../index');


(function(){
    if(require.main==module){
	var input = {
	    uri: 'localhost:2191/some/api/check',
	    method: 'post',
	    success: [{a:1,b:2},{a:3,b:4}],
	    failure: [{a:1},{b:2},{}],
	    outputFilePath:'/tmp/comment.js'
	};
	DocMaker.make_comments(input,function (err){
	    if(err){
		console.log(err);	
	    }
	    console.log('all  done');
	});
    }
})();
