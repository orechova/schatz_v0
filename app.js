$(document).ready(function(){

	var model = {
		init: function(){
			if (!localStorage.schatz01Words){
				localStorage.schatz01Words= JSON.stringify([]);
			}
		},
		add: function(textSK, textIT){
			var data = JSON.parse( localStorage.schatz01Words );
			var word = {'textSK': textSK, 'textIT': textIT, 'lastTouched': new Date() }
			data.push(word);
			localStorage.schatz01Words = JSON.stringify(data);
		},
		getAll: function(){
			return JSON.parse( localStorage.schatz01Words );
		}
	}
})