/** 
 * Unit Tests for ProtoAPI's javascript client library 
 *
 * Copyright 2012, Oscar Blasco Maestro
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 

/** NOTE: Change this according to your appid and appkey */
var config = { appid: '4f20ef0800ac0fa0a20000a2', appkey: 'f0e4bd6cb4452f953d400d488e6663ec' };

/** Test browser supports ISO8601 dates */
test('Check browser datetime support', 3, function () {
    strictEqual(Date.parse('2001-02-03T04:05Z'),        Date.UTC(2001, 1, 3, 4, 5, 0, 0), '2001-02-03T04:05Z');
    strictEqual(Date.parse('2001-02-03T04:05:06Z'),     Date.UTC(2001, 1, 3, 4, 5, 6, 0), '2001-02-03T04:05:06Z');
    strictEqual(Date.parse('2001-02-03T04:05:06.007Z'), Date.UTC(2001, 1, 3, 4, 5, 6, 7), '2001-02-03T04:05:06.007Z');
});

/** Simple test to check POST and GET of a single object */
test('Add blog post', function(){
	expect(7);

	var config = { appid: '4f20ef0800ac0fa0a20000a2', appkey: 'f0e4bd6cb4452f953d400d488e6663ec' };
	var post = { name: 'test2', user: 'pepito', date: (new Date()).toISOString() };

	stop();

	// Add to protoapi under 'posts' collection
	setTimeout(function (){
		ok(true, 'code runs');

		$("posts").protoapi(config).post(post, function( response ){ 
			ok(true, 'ajax success');
			notEqual(response.data, undefined, 'Response data must not be undefined');
			start();
		});
	}, 1000);

	stop();

	// Find the post back by its datetime
	setTimeout(function (){
		ok(true, 'code runs');

		
		$("posts").protoapi(config).get({ date: post.date }, function( response ){ 
			ok(true, 'ajax success');
			equal(response.data.length, 1, 'Response data must not be undefined');
			equal(response.data[0].date, post.date, 'Response data must not be undefined');
			start();
		});
	}, 1000);
});


// This one takes its time
test('Simple Queries', function(){
	expect(29);

	var post = { name: 'test2', user: 'pepito', date: (new Date()).toISOString() };

	stop();

	// Add 1000 objects to protoapi under 'posts' collection
	setTimeout(function (){
		ok(true, 'code runs');

		for(i=0; i < 10; i++){
			post.num = i;
			$("posts").protoapi(config).post(post, function( num ){
				return function( response ){ 
					ok(true, 'ajax success');
					equal(typeof(response.data), 'string', 'Response data must not be undefined');
					if( num === 9 ){
						start();
					}
				}
			}( i ));
		}
	}, 1000);

	stop();

	// Find them back
	setTimeout(function (){
		ok(true, 'code runs');

		
		$("posts").protoapi(config).get({ date: post.date }, function( response ){ 
			ok(true, 'ajax success');
			equal(response.count, 10, 'We expect 1000 objects');
			equal(response.data[0].date, post.date, 'First one has the same date');
			start();
		});
	}, 3000);

	stop();

	// Range query
	setTimeout(function (){
		ok(true, 'code runs');

		
		$("posts").protoapi(config).get({ num: { $lt: 2 }, date: post.date }, function( response ){ 
			ok(true, 'ajax success');
			equal(response.count, 2, 'We expect 2 objects');
			equal(response.data[0].date, post.date, 'First one has the same date');
			start();
		});
	}, 3000);
});