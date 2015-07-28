var pom;
$(function(){

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
			return true;
		},
		getAll: function(){
			return JSON.parse( localStorage.schatz01Words );
		}
	}

	var view = {
		init: function(){
			$('#addNewWord').click(function(){
				if ( controller.addNewWord($('#textSK').val(), $('#textIT').val()) ){
					$('#textSK').val('');
					$('#textIT').val('');
				}
			});
			$(document).on("pagebeforeshow","#listWords",function(){
  				view.displayAllWords();
			});
		},
		displayAllWords: function(){
			var words = controller.getAllWords();
			var html = '';
			console.log(words);
			pom = words;
			for (var wordID in words){
				if (words.hasOwnProperty(wordID)){
					var word = words[wordID];
					html += '<tr><td>' + word.textSK + '</td><td>' + word.textIT + '</td></tr>';
				}
			}
			$('#listWordsBody').html(html);
		}
	}

	var controller = {
		init: function(){
			model.init();
			view.init();
		},
		addNewWord: function(textSK, textIT){
			return model.add(textSK, textIT);
		},
		getAllWords: function(){
			return model.getAll();
		}
	}

	controller.init();
});