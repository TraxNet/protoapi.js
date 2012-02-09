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
var config = { appid: '4f2b8c5d3dcd200e6900005e', appkey: '25b0aa7b3cde834b90ca30a15ed03b9c' };

/** Test browser supports ISO8601 dates */
test('Check browser datetime support', 3, function () {
    strictEqual(Date.parse('2001-02-03T04:05Z'),        Date.UTC(2001, 1, 3, 4, 5, 0, 0), '2001-02-03T04:05Z');
    strictEqual(Date.parse('2001-02-03T04:05:06Z'),     Date.UTC(2001, 1, 3, 4, 5, 6, 0), '2001-02-03T04:05:06Z');
    strictEqual(Date.parse('2001-02-03T04:05:06.007Z'), Date.UTC(2001, 1, 3, 4, 5, 6, 7), '2001-02-03T04:05:06.007Z');
});

/** Simple test to check POST and GET of a single object */
test('Add blog post', function(){
	expect(7);

	var config = { appid: '4f2b8c5d3dcd200e6900005e', appkey: '25b0aa7b3cde834b90ca30a15ed03b9c', classname: 'posts' };
	var post = { name: 'test2', user: 'pepito', date: (new Date()).toISOString() };

	stop();

	// Add to protoapi under 'posts' collection
	setTimeout(function (){
		ok(true, 'code runs');

		protoapi(config).post(post, function( response ){ 
			ok(true, 'ajax success');
			notEqual(response.data, undefined, 'Response data must not be undefined');
			start();
		});
	}, 1000);

	stop();

	// Find the post back by its datetime
	setTimeout(function (){
		ok(true, 'code runs');

		
		protoapi(config).get({ date: post.date }, function( response ){ 
			ok(true, 'ajax success');
			equal(response.data.length, 1, 'Response data must not be undefined');
			equal(response.data[0].date, post.date, 'Response data must not be undefined');
			start();
		});
	}, 1000);
});

function simpleRandString(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    
    if (! length) {
        length = Math.floor(Math.random() * chars.length);
    }
    
    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

/*
// This one takes its time
test('Simple Queries', function(){
	expect(29);

	var post = { name: 'test2', user: 'pepito', date: (new Date()).toISOString() };

	stop();

	protoapi(config);

	// Add 1000 objects to protoapi under 'posts' collection
	setTimeout(function (){
		ok(true, 'code runs');
		
		for(i=0; i < 10; i++){
			post.num = i;
			protoapi( 'posts' ).post(post, function( num ){
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

		
		protoapi( 'posts' ).get({ date: post.date }, function( response ){ 
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

		
		protoapi( 'posts' ).get({ num: { $lt: 2 }, date: post.date }, function( response ){ 
			ok(true, 'ajax success');
			equal(response.count, 2, 'We expect 2 objects');
			equal(response.data[0].date, post.date, 'First one has the same date');
			start();
		});
	}, 3000);
});



	
var config_op = { appid: '4f2b8c5d3dcd200e6900005e', appkey: '25b0aa7b3cde834b90ca30a15ed03b9c', classname: 'op_posts' };
	

// Operand queries
test('Operand Queries', function(){
	expect(36);
	
	var test_id = simpleRandString(40);
	
	function genenerateFakePost(t_id){
		var post = { 
			name: simpleRandString(), 
			user: simpleRandString(), 
			date: (new Date()).toISOString(), 
			type: 'op',
			test_id: t_id
		};
		return post;
	}

	stop();

	protoapi(config_op);

	// Add 1000 objects to protoapi under 'posts' collection
	setTimeout(function (){
		ok(true, 'code runs');
		var array = [];

		for(i=0; i < 10; i++){
			var post = genenerateFakePost( test_id );
			array.push(i);
			post.array = array;
			post.num = i;

			protoapi( 'op_posts' ).post(post, function( num ){
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

		
		protoapi( 'op_posts' ).get({ type: 'op', test_id: test_id }, function( response ){ 
			ok(true, 'ajax success');
			equal(response.count, 10, 'We expect 10 objects');
			start();
		});
	}, 3000);

	stop();

	// $in operator
	setTimeout(function (){
		ok(true, 'code runs');

		
		protoapi( 'op_posts' ).get({ array: { $in: [ 7, 8, 9 ] }, test_id: test_id }, function( response ){ 
			ok(true, 'ajax success');
			equal(response.count, 3, 'We expect 3 objects');
			start();
		});
	}, 3000);

	stop();

	// $nin operator
	setTimeout(function (){
		ok(true, 'code runs');

		
		protoapi( 'op_posts' ).get({ array: { $nin: [ 7, 8, 9 ] }, test_id: test_id }, function( response ){ 
			ok(true, 'ajax success');
			equal(response.count, 7, 'We expect 7 objects');
			start();
		});
	}, 3000);

	stop();

	// $all operator
	setTimeout(function (){
		ok(true, 'code runs');

		
		protoapi( 'op_posts' ).get({ array: { $all: [ 3, 7, 8, 9 ] }, test_id: test_id }, function( response ){ 
			ok(true, 'ajax success');
			equal(response.count, 1, 'We expect 1 object');
			start();
		});
	}, 3000);

	stop();

	// $size operator
	setTimeout(function (){
		ok(true, 'code runs');

		
		protoapi( 'op_posts' ).get({ array: { $size: 2 }, test_id: test_id }, function( response ){ 
			ok(true, 'ajax success');
			equal(response.count, 1, 'We expect 1 object');
			start();
		});
	}, 3000);
});
*/
/** Some queries with dates */
test('Date queries', function(){
	expect(17);

	var test_id = simpleRandString(40);

	var config = { appid: '4f2b8c5d3dcd200e6900005e', appkey: '25b0aa7b3cde834b90ca30a15ed03b9c', classname: 'dates' };
	var date0 = new Date(Date.UTC(2001, 1, 3, 4, 5, 6, 0));
	var date1 = new Date(Date.UTC(2001, 1, 3, 4, 6, 6, 0));
	var post0 = { name: 'test_dates', user: 'ralph', date: date0.toISOString(), test_id: test_id };
	var post1 = { name: 'test_dates', user: 'ralph', date: date1.toISOString(), test_id: test_id };

	protoapi(config);

	stop();

	setTimeout(function (){
		ok(true, 'code runs');

		protoapi( 'dates' ).post( post0, function( response ){ 
			ok(true, 'ajax success');
			notEqual(response.data, undefined, 'Response data must not be undefined');
		});

		protoapi( 'dates' ).post( post1, function( response ){ 
			ok(true, 'ajax success');
			notEqual(response.data, undefined, 'Response data must not be undefined');
			start();
		});
	}, 1000);

	stop();

	setTimeout(function (){
		ok(true, 'code runs');

		
		protoapi( 'dates' ).get({ name: 'test_dates', test_id: test_id }, function( response ){ 
			ok(true, 'ajax success');
			equal(response.data.length, 2, 'Response data contains 2 objects');
			start();
		});
	}, 1000);

	stop();

	setTimeout(function (){
		ok(true, 'code runs');

		
		protoapi( 'dates' ).get({ date: date0.toISOString(), test_id: test_id }, function( response ){ 
			ok(true, 'iso date query success');
			equal(response.data.length, 1, 'Response data contains 1 object');
			start();
		});
	}, 1000);

	stop();

	setTimeout(function (){
		ok(true, 'code runs');
		
		protoapi( 'dates' ).get({ date: { $gt: date0.toISOString() }, test_id: test_id }, function( response ){ 
			ok(true, 'iso date get $gt success');
			equal(response.data.length, 1, 'Response data contains 1 object');
			start();
		});
	}, 1000);

	stop();

	setTimeout(function (){
		ok(true, 'code runs');
		
		protoapi( 'dates' ).get({ date: { $lt: date1.toISOString() }, test_id: test_id }, function( response ){ 
			ok(true, 'iso date get $lt success');
			equal(response.data.length, 1, 'Response data contains 1 object');
			start();
		});
	}, 1000);
});