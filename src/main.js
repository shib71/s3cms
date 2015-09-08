import "aws";
import { getState, subscribe, boundSetPreference } from "app/store";
/*
var unsubscribe = subscribe(function(){
	console.log(getState());
});
*/
boundSetPreference("abc", 123);
boundSetPreference("def", 890);
boundSetPreference("abc", "hello");
boundSetPreference("qwerty", 123);
/*
unsubscribe();
*/