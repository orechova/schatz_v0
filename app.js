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
		},
		getTotal: function(){
			var words = model.getAll();
			return words.length;
		},
		getDistribution: function(){
			var distribution = [0,0,0,0,0];
			var words = model.getAll();
			for (wordID in words){
				distribution[words[wordID].lastTest]++;
			}
			return distribution;
		},
		getTranslationIT: function(textSK){
			var words = model.getAll();
			for (wordID in words){
				if (words[wordID].textSK == textSK)
					return words[wordID].textIT;
			}
			return 'not found';
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
			$('#searchSKWord').click(function(){
				controller.translateSKWord($('#searchSK').val());
			});
			$(document).on("pagebeforeshow","#listWords",function(){
  				view.displayAllWords();
			});
			$(document).on("pagebeforeshow","#testWords",function(){
  				controller.initTestSK();
			});
			$(document).on("pagebeforeshow","#overview",function(){
  				controller.initOverview();
			});
			$(document).on("pagebeforeshow","#search",function(){
  				view.initSearch();
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
		},
		displayOverviewTable: function(distribution){
			var canvas = $('#overviewTable')[0];
			var context = canvas.getContext("2d");

			var colors = ["black","red","orange","yellow","green"];

			var highest = 0;
			for (val in distribution){
				if (distribution[val] > highest)
					highest = distribution[val];
			}

			var width = canvas.width;
			var height = canvas.height;
			var barWidth = Math.round( (width*0.8) / 5 );
			var barDist = Math.round( (width*0.2) / 6 );
			var barStep = Math.round( (height*0.9) / highest );

			var x = 0; 

			context.font = "19 pt Arial;"
			for (val in distribution){
				x += barDist;
				var barHeight = barStep*distribution[val];
				context.fillStyle = colors[val];
				context.fillRect(x, (height-barHeight), barWidth, barHeight);
				x += barWidth;
			}
		},
		displayOverviewTotal: function(total){
			$('#overviewTotal').html(total);
		},
		displayTranslationIT: function(translationIT){
			$('#translationIT').html(translationIT)
								.show();
		},
		initSearch: function(){
			$('#translationIT').hide();		
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
		},
		initOverview: function(){
			view.displayOverviewTable(model.getDistribution());
			view.displayOverviewTotal(model.getTotal());
		},
		translateSKWord: function(wordSK){
			var translation = model.getTranslationIT(wordSK);
			view.displayTranslationIT(translation);
		}
	}

	controller.init();
});