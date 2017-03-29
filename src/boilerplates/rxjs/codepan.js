/*
  timer takes a second argument, how often to emit subsequent values
  in this case we will emit first value after 1 second and subsequent
  values every 2 seconds after
*/
const source = Rx.Observable.timer(1000, 2000);
//output: 0,1,2,3,4,5......
const subscribe = source.subscribe(val => console.log(val));
