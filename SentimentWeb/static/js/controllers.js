var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http ) {

    $scope.loading = false;
    //	$scope.sampleText = "Today is such a lovely day. Bright and sunny, light breeze blowing and warm. On top of it, it's a Sunday. I am planning to take my car out for a spin to soak up the lovely sunshine and breeze through traffic free Sunday roads. Well, relatively traffic free. It has been a hectic week and I need to unwind with some awesome music on my car theater. Also need to buy me a new pair of jeans and maybe catch the horror flick at the mall. I so love horror movies. I am thinking I might also grab some caramel popcorn at the theater, oh they are do delicious!!";
    $scope.sampleText = "Google"
    //var url = "https://apikey:KQSNCqMJYiVum7WRpibjSHgVd1MV0PisDx7MuO4PLAb9@gateway-syd.watsonplatform.net/tone-analyzer/api/v3/tone?version=2017-09-21&text=Team%2C%20I%20know%20that%20times%20are%20tough%21%20Product%20sales%20have%20been%20disappointing%20for%20the%20past%20three%20quarters.%20We%20have%20a%20competitive%20product%2C%20but%20we%20need%20to%20do%20a%20better%20job%20of%20selling%20it%21";

    $scope.tone = false;
    $scope.chattone = false;
    $scope.rectwidth = 0;

    $scope.PickRandom = function(){
        $scope.text  = "";
        var stocksArray = ['BBC', 'Apple', 'Google', 'IBM', 'ITC', 'Larsen Toubro', 'HDFC Bank', 'Jet Airways']
        $scope.text = stocksArray[Math.floor(Math.random()*stocksArray.length)];
        return $scope.text;
    }
    $scope.AnalyseStock = function(content) {
        //  alert($scope.address);
        if (!content || content.length < 3) {
            alert("Not Enough Words!")
            return;
        }
        $scope.showResult = false;
        $scope.loading = true;
        $scope.errorMsg = '';
        $scope.response = ';'
        $scope.res = '';
        var avgScore = 0.0;
        var count = 0;
        var url = "https://news-headline-sentiment.el.r.appspot.com/getsentiments?text=" + content + " stock";
        var url = "https://news-sentiment-api-yr6ldemxra-as.a.run.app/getsentiments?text=" + content + " stock";
        $http({
            method: "GET", url: url }).then(function mySucces(response) { 
            $scope.response = response.data;
            console.log("Response.data = " + JSON.stringify(response.data));
            if (!response.data|| response.data.length == 0) {
                $scope.res = "No emotion detected";
                showResult = false;
            }
            if (response.data["status"] && response.data.status == "error" ){
                $scope.showResult = false;
                $scope.error = true;
                $scope.loading = false;
                $scope.errorMsg = "Oops! Exceeded limit of 100 calls per 24 hour for News API. Please try later.";
                return;
              }
            var s = response.data;
            for (let i = 0; i < s.length; i++) {
            //    console.log(s[i].id + "," + s[i].score + "," + s[i].magnitude);
                avgScore += s[i].score * s[i].magnitude;
                count++;
            }
            $scope.avg = avgScore / 20;
            console.log("Avg Score and Count: " + avgScore + ", " + count);
            $scope.resultsReady = true;
            $scope.loading = false;
            $scope.showResult = true;
            $scope.error = false;
            if (response.data.hasOwnProperty('error')) {
                $scope.errorMsg = response.data.error;
                $scope.LOL = true;
                console.log($scope.errorMsg);
            }
        }, function myError(response) {
            $scope.response = response;
            $scope.loading = false;
            console.log("Error Calling API: " + JSON.stringify(response));
            $scope.errorMsg = "Oops! Exceeded Rate Limit of 100 calls per hour for News API. Please try later.";
            $scope.showResult = false;
            $scope.error = true;
        });
    };
    $scope.GetAvgScore = function(){
        if($scope.avg > 0){
            $scope.showRed = false;
            $scope.showGreen = true;
        } else {
            $scope.showRed = true;
            $scope.showGreen = false;
        }
    }
    $scope.GetAbsolute = function(d){
        var a = (Math.abs(d) * 100);
        if(a > 100)
            a = 100;
        return a;
    }
    $scope.GetClass = function(score){
        var c = parseFloat(score); 
        $scope.pc = Math.abs(c) * 100;
        $scope.bigsmile=false;
        $scope.smile=false;
        $scope.neutral=false;
        $scope.frown=false;
        $scope.cry=false;
        if(c > 0){
            if(c > 0.5){
                $scope.bigsmile=true;
            }
            else{
                $scope.smile=true;
            }
            return "innerG";
        }
        else{
            if(c < -0.5){
                $scope.cry=true;
            }
            else if (c == 0){
                $scope.neutral=true;
            }
            else{
                $scope.frown=true;
            }
            return "innerR"
        }
    }

    $scope.GetEmoji = function(score){
        var c = parseFloat(score); 
        $scope.bigsmile=false;
        $scope.smile=false;
        $scope.neutral=false;
        $scope.frown=false;
        $scope.cry=false;
        if(c > 0){
            if(c > 0.5){
                $scope.bigsmile=true;
                return "far fa-laugh-beam fa-2x"
            }
            else{
                $scope.smile=true;
                return "far fa-grin fa-2x"
            }
        }
        else{
            if(c < -0.5){
                $scope.cry=true;
                return "far fa-sad-cry fa-2x"
            }
            else if (c == 0){
                $scope.neutral=true;
                return "far fa-meh fa-2x"
            }
            else{
                $scope.frown=true;
                return "far fa-frown fa-2x"
            }
        }
    }
    $scope.GetColor = function(score){
        var c = parseFloat(score); 
        if(c > 0){
            if(c > 0.5){
                return "color:darkgreen"
            }
            else{
                return "color:green"
            }
        }
        else{
            if(c < -0.5){
                return "color:darkred"
            }
            else if (c == 0){
                return "color:blue"
            }
            else{
                return "color:red"
            }
        }
    }

});
app.filter('makePositive', function() {
    return function(num) { return Math.abs(num); }
});
