var pom;
$(function(){

	var model = {
		init: function(){
			if (!localStorage.schatz01Words){
				localStorage.schatz01Words = JSON.stringify([]);
			}
			if (!localStorage.schatz01LastID){
				localStorage.schatz01LastID = -1;
			}
		},
		add: function(textSK, textIT){
			var data = JSON.parse( localStorage.schatz01Words );
			var word = { 'textSK': textSK, 'textIT': textIT, 'lastTouched': new Date(), 'lastTest': 0 }
			data[model.nextLastID()] = word;
			model.updateAll(data);
			return true;
		},
		updateTest: function(wordID, testResult){
			data = model.getAll();
			data[wordID].lastTest = testResult;
			model.updateAll(data);
		},
		getAll: function(){
			return JSON.parse( localStorage.schatz01Words );
		},
		updateAll: function(data){
			localStorage.schatz01Words = JSON.stringify(data);
		},
		getRandomWord: function(){
			var words = JSON.parse( localStorage.schatz01Words );
			var wordID = Math.floor( Math.random()*words.length);
			return [ wordID, words[wordID] ];
		},
		getLastID: function(){
			return localStorage.schatz01LastID;
		},
		nextLastID: function(){
			localStorage.schatz01LastID = parseInt( localStorage.schatz01LastID ) + 1;
			return localStorage.schatz01LastID;
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
			$(document).on("pagebeforeshow","#testWords",function(){
  				controller.initTestSK();
			});
		},
		displayAllWords: function(){
			var words = controller.getAllWords();
			var html = '';
			for (var wordID in words){
				if (words.hasOwnProperty(wordID)){
					var word = words[wordID];
					html += '<tr><td>' + word.textSK + '</td><td>' + word.textIT + '</td></tr>';
				}
			}
			$('#listWordsBody').html(html);
		},
		displayTestWord: function(wordID, text, translation){
			$('#translate').html(text);
			$('#testWord').show();
			$('#testSolution').hide();
			$('#translation').html(translation);
			$('#translation').attr('data-word-id',wordID);
		},
		initTest: function(){
			$('#testWord').unbind('click');
			$('#testWord').click(function(){
				$('#testSolution').show();
				$('#testWord').hide();
			});
			$('.testResult').unbind('click'); 
			$('.testResult').each(function(){ 
				$(this).click(function(){
					controller.testWordResults( $('#translation').attr('data-word-id'), $(this).attr('data-result') );
				})
			});
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
		},
		initTestSK: function(){
			view.initTest();
			var word = model.getRandomWord();
			view.displayTestWord(word[0], word[1].textSK, word[1].textIT);
		},
		nextTestWord: function(){
			var word = model.getRandomWord();
			view.displayTestWord(word[0], word[1].textSK, word[1].textIT);
		},
		testWordResults: function(wordID, testResult){
			model.updateTest(wordID, testResult);
			controller.nextTestWord();
		}
	}

	controller.init();
});