// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
const express = require('express')
const NewsAPI = require('newsapi');
var request = require('request');
const cors = require('cors');
// To query /v2/top-headlines
// All options passed to topHeadlines are optional, but you need to include at least one of them

const app = express()
const port = 8080
//const newsApiKey = "05db1a6d780647adaab3b046537c6180"
const newsApiKey = "7b078c1bec2e4b01b7dd92909f253a5a"
const apiEndPointHdr = 'https://newsapi.org/v2/everything?q=';
const newsapi = new NewsAPI(newsApiKey);

var resp = [];
;
let articleMax = 20;
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
'use strict';
})
app.get('/getsentiments', (req, res) => {
  // Get headlines array
  var topic = req.query.text;
  console.log("Topic=" + topic);
  headlines = getHeadlinesArray(topic, res);
  'use strict';
})

/**
* Fetch current headlines from the Free News API
*/
function scrub(text) {
  return text.replace(/[\‘\,\“\”\"\'\’\-\n\â\]/g, ' ');
}

async function getHeadlinesArray(topic, res) {
// Fetch headlines for a given topic

let encodedtopic = encodeURIComponent(topic);
let hdlnsResp = []
resp = [];
console.log("Getting headlines for: " + topic);
var options = {
  'method': 'GET',
  'url': apiEndPointHdr + encodedtopic + '&apiKey=' + newsApiKey,
  'headers': {
  }
};
request(options, function (error, response) {
  if (error){
    console.log("Error calling newsapi..." + error);
    throw new Error(error);
  } 
  console.log("News APi Response received: " + response.body);
  
  let results = JSON.parse(response.body);
  if (results["status"] && results.status == "error" ){
    console.log("Returning due to error " + results["code"] + ": " + results["message"]);
    res.jsonp(results);
    return;
  }
  let articles = results["articles"];
  for (let i = 0; i < articles.length && i < articleMax; i++) {
    let newsStory = articles[i]['title'];
    if (articles[i]['description'] !== null) {
      newsStory += ': ' + articles[i]['description'];
    }
    // Scrub newsStory of invalid characters
    newsStory = scrub(newsStory);
  
    // Construct hdlnsResp as a 2d array. This simplifies syncing to sheet.
    hdlnsResp.push(new Array(newsStory));
  }
  console.log("Number of news items is " +  hdlnsResp.length );
  return new Promise(function (resolve, reject) {
    analyzeSentimentOfText(hdlnsResp, res).then(
        (response) => {
            resp = response.data;
            resolve(resp);
        },
            (error) => {
            reject(error);
        }
      );
    });
  });
  
}

async function analyzeSentimentOfText(doc, res) {
  // [START language_sentiment_text]
  // Imports the Google Cloud client library
  const language = require('@google-cloud/language');
  //console.log("Document Received: " + doc);
  // Creates a client
  const client = new language.LanguageServiceClient();
  const a = [];
  // Prepares a document, representing the provided text
  for (let i = 0; i < doc.length; i++) {
    let headlineCell = doc[i];
    if (headlineCell) {
      const document = {
        content: headlineCell,
        type: 'PLAIN_TEXT',
      };
      try{
        const [result] = await client.analyzeSentiment({document});
        const sentiment = result.documentSentiment;
        
        var c = {
          id: i,
          text: headlineCell,
          score: `${sentiment.score}`,  
          magnitude: `${sentiment.magnitude}`  
        }
        //console.log(JSON.stringify(c));
        a.push(c);
      } catch(error){
        console.log("Caught Exception: " + error);
        continue;
      }
    }
  }
  //console.log(JSON.stringify(a));
  res.jsonp(a);
  return a;
}

  app.listen(port, () => {
    console.log("Sentiment Analyser app istening at http://localhost:" + port);
  })
