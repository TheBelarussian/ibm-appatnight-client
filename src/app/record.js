/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*global $:false, BUFFERSIZE */

var models = {
   "models": [
      {
         "url": "https://stream.watsonplatform.net/speech-to-text/api/v1/models/en-US_BroadbandModel",
         "rate": 16000,
         "name": "en-US_BroadbandModel",
         "language": "en-US",
         "description": "US English broadband model."
      },
      {
         "url": "https://stream.watsonplatform.net/speech-to-text/api/v1/models/en-US_NarrowbandModel",
         "rate": 8000,
         "name": "en-US_NarrowbandModel",
         "language": "en-US",
         "description": "US English narrowband model."
      },
      {
         "url": "https://stream.watsonplatform.net/speech-to-text/api/v1/models/es-ES_BroadbandModel",
         "rate": 16000,
         "name": "es-ES_BroadbandModel",
         "language": "es-ES",
         "description": "Spanish broadband model."
      },
      {
         "url": "https://stream.watsonplatform.net/speech-to-text/api/v1/models/es-ES_NarrowbandModel",
         "rate": 8000,
         "name": "es-ES_NarrowbandModel",
         "language": "es-ES",
         "description": "Spanish narrowband model."
      },
      {
         "url": "https://stream.watsonplatform.net/speech-to-text/api/v1/models/pt-BR_BroadbandModel",
         "rate": 16000,
         "name": "pt-BR_BroadbandModel",
         "language": "pt-BR",
         "description": "Brazilian Portuguese broadband model."
      },
      {
         "url": "https://stream.watsonplatform.net/speech-to-text/api/v1/models/pt-BR_NarrowbandModel",
         "rate": 8000,
         "name": "pt-BR_NarrowbandModel",
         "language": "pt-BR",
         "description": "Brazilian Portuguese narrowband model."
      },
      {
         "url": "https://stream.watsonplatform.net/speech-to-text/api/v1/models/zh-CN_BroadbandModel",
         "rate": 16000,
         "name": "zh-CN_BroadbandModel",
         "language": "zh-CN",
         "description": "Mandarin broadband model."
      },
      {
         "url": "https://stream.watsonplatform.net/speech-to-text/api/v1/models/zh-CN_NarrowbandModel",
         "rate": 8000,
         "name": "zh-CN_NarrowbandModel",
         "language": "zh-CN",
         "description": "Mandarin narrowband model."
      }
   ]
};

function createTokenGenerator() {
  // Make call to API to try and get token
  var hasBeenRunTimes = 0;
  return {
    getToken: function(callback) {
      ++hasBeenRunTimes;
      if (hasBeenRunTimes > 5) {
        var err = new Error('Cannot reach server');
        callback(null, err);
        return;
      }
      var url = '/api/token';
      url = 'http://localhost:3000';
      var tokenRequest = new XMLHttpRequest();
      tokenRequest.open('POST', url, true);
      tokenRequest.setRequestHeader('csrf-token',$('meta[name="ct"]').attr('content'));
      tokenRequest.onreadystatechange = function() {
        if (tokenRequest.readyState === 4) {
          if (tokenRequest.status === 200) {
            var token = tokenRequest.responseText;
            callback(null, token);
          } else {
            var error = 'Cannot reach server';
            if (tokenRequest.responseText){
              try {
                error = JSON.parse(tokenRequest.responseText);
              } catch (e) {
                error = tokenRequest.responseText;
              }
            }
            callback(error);
          }
        }
      };
      tokenRequest.send();
    },
    getCount: function() { return hasBeenRunTimes; }
  };
}

function initSocket(options, onopen, onlistening, onmessage, onerror, onclose) {
  var listening;
  function withDefault(val, defaultVal) {
    return typeof val === 'undefined' ? defaultVal : val;
  }
  var socket;
  var token = options.token;
  var model = options.model || localStorage.getItem('currentModel');
  var message = options.message || {'action': 'start'};
  var sessionPermissions = withDefault(options.sessionPermissions,
    JSON.parse(localStorage.getItem('sessionPermissions')));
  //var sessionPermissionsQueryParam = sessionPermissions ? '0' : '1';
  // TODO: add '&X-Watson-Learning-Opt-Out=' + sessionPermissionsQueryParam once
  // we find why it's not accepted as query parameter
  var url = options.serviceURI || 'wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize?watson-token=';
    url+= token + '&model=' + model;
  console.log('URL model', model);
  try {
    socket = new WebSocket(url);
  } catch(err) {
    console.error('WS connection error: ', err);
  }
  socket.onopen = function() {
    listening = false;
    $.subscribe('hardsocketstop', function() {
      console.log('MICROPHONE: close.');
      socket.send(JSON.stringify({action:'stop'}));
      socket.close();
    });
    $.subscribe('socketstop', function() {
      console.log('MICROPHONE: close.');
      socket.close();
    });
    socket.send(JSON.stringify(message));
    onopen(socket);
  };
  socket.onmessage = function(evt) {
    var msg = JSON.parse(evt.data);
    if (msg.error) {
      showError(msg.error);
      $.publish('hardsocketstop');
      return;
    }
    if (msg.state === 'listening') {
      // Early cut off, without notification
      if (!listening) {
        onlistening(socket);
        listening = true;
      } else {
        console.log('MICROPHONE: Closing socket.');
        socket.close();
      }
    }
    onmessage(msg, socket);
  };

  socket.onerror = function(evt) {
    console.log('WS onerror: ', evt);
    showError('Application error ' + evt.code + ': please refresh your browser and try again');
    $.publish('clearscreen');
    onerror(evt);
  };

  socket.onclose = function(evt) {
    console.log('WS onclose: ', evt);
    if (evt.code === 1006) {
      // Authentication error, try to reconnect
      console.log('generator count', tokenGenerator.getCount());
      if (tokenGenerator.getCount() > 1) {
        $.publish('hardsocketstop');
        throw new Error('No authorization token is currently available');
      }
      tokenGenerator.getToken(function(err, token) {
        if (err) {
          $.publish('hardsocketstop');
          return false;
        }
        console.log('Fetching additional token...');
        options.token = token;
        initSocket(options, onopen, onlistening, onmessage, onerror, onclose);
      });
      return false;
    }
    if (evt.code === 1011) {
      console.error('Server error ' + evt.code + ': please refresh your browser and try again');
      return false;
    }
    if (evt.code > 1000) {
      console.error('Server error ' + evt.code + ': please refresh your browser and try again');
      return false;
    }
    // Made it through, normal close
    $.unsubscribe('hardsocketstop');
    $.unsubscribe('socketstop');
    onclose(evt);
  };
}

function handleMicrophone(token, model, mic, callback) {

  if (model.indexOf('Narrowband') > -1) {
    var err = new Error('Microphone transcription cannot accomodate narrowband models, '+
      'please select another');
    callback(err, null);
    return false;
  }

  // Test out websocket
  var baseString = '';
  var baseJSON = '';

  var options = {};
  options.token = token;
  options.message = {
    'action': 'start',
    'content-type': 'audio/l16;rate=16000',
    'interim_results': true,
    'continuous': true,
    'word_confidence': true,
    'timestamps': true,
    'max_alternatives': 3,
    'inactivity_timeout': 600
  };
  options.model = model;

  function onOpen(socket) {
    console.log('Mic socket: opened');
    callback(null, socket);
  }

  function onListening(socket) {

    mic.onAudio = function(blob) {
      if (socket.readyState < 2) {
        socket.send(blob);
      }
    };
  }

  function onMessage(msg) {
    if (msg.results) {
      console.log("TODO DISPLAY!");
      //baseString = display.showResult(msg, baseString, model);
      //sbaseJSON = display.showJSON(msg, baseJSON);
    }
  }

  function onError() {
    console.log('Mic socket err: ', err);
  }

  function onClose(evt) {
    console.log('Mic socket close: ', evt);
  }

  initSocket(options, onOpen, onListening, onMessage, onError, onClose);
}

//var Microphone = require('../Microphone');

function initRecordButton(ctx) {

  var recordButton = $('#recordButton');

  recordButton.click((function() {

    var running = false;
    var token = ctx.token;
    var micOptions = {
      bufferSize: ctx.buffersize
    };
    var mic = microphone(micOptions);

    return function(evt) {
      // Prevent default anchor behavior
      evt.preventDefault();

      var currentModel = localStorage.getItem('currentModel');
      var currentlyDisplaying = localStorage.getItem('currentlyDisplaying');

      if (currentlyDisplaying=='sample'||currentlyDisplaying=='fileupload') {
        showError('Currently another file is playing, please stop the file or wait until it finishes');
        return;
      }
      localStorage.setItem('currentlyDisplaying', 'record');
      if (!running) {
        $('#resultsText').val('');   // clear hypotheses from previous runs
        console.log('Not running, handleMicrophone()');
        handleMicrophone(token, currentModel, mic, function(err) {
          if (err) {
            var msg = 'Error: ' + err.message;
            console.log(msg);
            showError(msg);
            running = false;
            localStorage.setItem('currentlyDisplaying', 'false');
          } else {
            recordButton.css('background-color', '#d74108');
            recordButton.find('img').attr('src', 'images/stop.svg');
            console.log('starting mic');
            mic.record();
            running = true;
          }
        });
      } else {
        console.log('Stopping microphone, sending stop action message');
        recordButton.removeAttr('style');
        recordButton.find('img').attr('src', 'images/microphone.svg');
        $.publish('hardsocketstop');
        mic.stop();
        running = false;
        localStorage.setItem('currentlyDisplaying', 'false');
      }
    };
  })());
}

// TODO: test this
//var $ = require('jquery');

(function() {
  var o         = $({});
  $.subscribe   = o.on.bind(o);
  $.unsubscribe = o.off.bind(o);
  $.publish     = o.trigger.bind(o);
})();

var showError = console.log;

window.BUFFERSIZE = 8192;

//$(document).ready(function() {
function activateRecordButton() {
  var tokenGenerator = createTokenGenerator();

  // Make call to API to try and get token
  tokenGenerator.getToken(function(err, token) {
    window.onbeforeunload = function() {
      localStorage.clear();
    };

    if (!token) {
      console.error('No authorization token available');
      console.error('Attempting to reconnect...');

      if (err && err.code)
        showError('Server error ' + err.code + ': '+ err.error);
      else
        showError('Server error ' + err.code + ': please refresh your browser and try again');
    }

    var viewContext = {
      currentModel: 'en-US_BroadbandModel',
      models: models,
      token: token,
      bufferSize: BUFFERSIZE
    };

    initRecordButton(viewContext);

    // Save models to localstorage
    localStorage.setItem('models', JSON.stringify(models));

    // Set default current model
    localStorage.setItem('currentModel', 'en-US_BroadbandModel');
    localStorage.setItem('sessionPermissions', 'true');
    
    //exports.getModels = 
    (function(token) {
      var viewContext = {
        currentModel: 'en-US_BroadbandModel',
        models: null,
        token: token,
        bufferSize: BUFFERSIZE
      };
      var modelUrl = 'https://stream.watsonplatform.net/speech-to-text/api/v1/models';
      var sttRequest = new XMLHttpRequest();
      sttRequest.open('GET', modelUrl, true);
      sttRequest.withCredentials = true;
      sttRequest.setRequestHeader('Accept', 'application/json');
      sttRequest.setRequestHeader('X-Watson-Authorization-Token', token);
      sttRequest.onload = function() {
        var response = JSON.parse(sttRequest.responseText);
        var sorted = response.models.sort(function(a,b) {
        if(a.name > b.name) {
          return 1;
        }
        if( a.name < b.name) {
          return -1;
        }
        return 0;
        });
        response.models=sorted;
        localStorage.setItem('models', JSON.stringify(response.models));
        viewContext.models = response.models;
      };
      sttRequest.onerror = function() {
        viewContext.models = models;
      };
      sttRequest.send();
    })(token);
    
    $.subscribe('clearscreen', function() {
      console.log("clearscreen");
    });

  });

}
