'use strict';
import { BotModel } from "./botModel.js";
import { Nationality, Gender, ZipCode, ChatGPT } from "./requestAPI.js";

let bot1 = new BotModel('Ichi', 'I love movies', 'https://cdn.pixabay.com/photo/2018/09/12/12/14/man-3672010__340.jpg', [{ command: 'Help', description: '' }, { command: 'Nationality', description: 'Nationality + Nom/Prénom' }, { command: 'ChatGPT', description: 'ChatGPT + NomBot + Texte' }]);
let bot2 = new BotModel('Ni', 'I love mangas', 'https://cdn.pixabay.com/photo/2016/06/15/15/25/loudspeaker-1459128__340.png', [{ command: 'Help', description: '' }, { command: 'Gender', description: 'Gender + Nom/Prénom' }, { command: 'ChatGPT', description: 'ChatGPT + NomBot + Texte' }]);
let bot3 = new BotModel('San', 'I love anime', 'https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083383__340.jpg', [{ command: 'Help', description: '' }, { command: 'ZipCode', description: 'ZipCode + codePostal' }, { command: 'ChatGPT', description: 'ChatGPT + NomBot + Texte' }]);

let allBots = [bot1, bot2, bot3];

function displayBots() {
    let html$ = '';
    allBots.forEach((bot) => {
        html$ += `<a class="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none">`;
        html$ += `  <img class="object-cover w-10 h-10 rounded-full" src="${bot.Picture}" alt="username" />`;
        html$ += `  <div class="w-full pb-2">`;
        html$ += `      <div class="flex justify-between">`;
        html$ += `          <span class="block ml-2 font-semibold text-gray-600">${bot.Name}</span>`;
        html$ += `      </div>`;
        html$ += `      <span class="block ml-2 text-sm text-gray-600">${bot.Presentation}</span>`;
        html$ += `  </div>`;
        html$ += `</a>`;
    });
    document.getElementById('bots').innerHTML = html$;
}

function sendMessage() {
    let text = getMessage();
    let messages = [];
    clearInput();
    if (text != '') {
        sendUserMessage(text, messages);
        checkCommandToUse(text, messages);
    }
}

function clearInput() {
    document.getElementById('message').value = '';
}

function checkCommandToUse(text) {
    let textSplitted = splitMessage(text);
    allBots.forEach((bot) => {
        bot.Commands.forEach((command) => {
            if (command['command'].toUpperCase() == textSplitted.command.toUpperCase()) {
                let response;
                switch (command['command']) {
                    case 'Help': sendHelpMessage(bot);
                        break;
                    case 'Nationality': response = Nationality(textSplitted.param);
                        if (typeof (response) == 'object') {
                            response.then(txt => {
                                sendBotMessage(txt, bot);
                            });
                        }
                        break;
                    case 'Gender': response = Gender(textSplitted.param);
                        if (typeof (response) == 'object') {
                            response.then(txt => {
                                sendBotMessage(txt, bot);
                            });
                        }
                        break;
                    case 'ZipCode': response = ZipCode(textSplitted.param);
                        if (typeof (response) == 'object') {
                            response.then(txt => {
                                sendBotMessage(txt, bot);
                            });
                        }
                        break;
                    case 'ChatGPT':
                        if (botParams == bot.Name) {
                            response = ChatGPT(textSplitted.param);
                            if (typeof (response) == 'object') {
                                response.then(txt => {
                                    sendBotMessage(txt, bot);
                                });
                            }
                        }
                        break;
                    default: '';
                        break;
                }
            }
        });
    });
}

function splitMessage(message) {
    let splitText = message.split(' ');
    let bot = '';
    let param = '';
    if (splitText.length > 2) {
        bot = splitText[1]
        param = splitText.splice(2).join(' ');
    } else if (splitText.length < 3) {
        param = splitText[1];
    }
    return { command: splitText[0], bot: bot, param: param };
}

function sendUserMessage(text) {
    let date = new Date();
    let html$ = '';
    html$ += '<ul class="space-y-2">';
    html$ += `<li class="flex justify-end">`;
    html$ += `<div class="relative max-w-xl px-4 py-2 text-white rounded shadow bg-blue-400">`;
    html$ += `<span class="flex items-center text-xs"><span class="pr-2">Vous</span><span class="w-full text-right">${date.toLocaleString()}</span></span>`;
    html$ += `<span class="block text-md text-right">${text}</span>`;
    html$ += `</div>`;
    html$ += `</li>`;
    html$ += `</ul>`;
    let list = document.getElementById('chat');
    list.innerHTML += html$;
    updateLocalStorage(html$);
    scroll(list);
}

function sendBotMessage(text, bot) {
    let date = new Date();
    let html$ = '';
    html$ += '<ul class="space-y-2">';
    html$ += `<li class="flex justify-start mb-2">`;
    html$ += `<div class="relative max-w-xl px-4 py-2 text-white rounded shadow bg-green-600">`;
    html$ += `<span class="flex items-center text-xs"><img class="object-cover w-6 h-6 rounded-full" src="${bot.Picture}"><span class="pl-2">${bot.Name}</span><span class="w-full text-right">${date.toLocaleString()}</span></span>`;
    html$ += `<span class="block">${text}</span>`;
    html$ += `</div>`;
    html$ += `</li>`;
    html$ += `</ul>`;
    let list = document.getElementById('chat');
    list.innerHTML += html$;
    updateLocalStorage(html$);
    scroll(list);
}

function sendHelpMessage(bot) {
    let date = new Date();
    let html$ = '';
    html$ += '<ul class="space-y-2">';
    html$ += `<li class="flex justify-start mb-2">`;
    html$ += `<div class="relative max-w-xl px-4 py-2 text-white rounded shadow bg-green-600">`;
    html$ += `<span class="flex items-center text-xs"><img class="object-cover w-6 h-6 rounded-full" src="${bot.Picture}"><span class="pl-2">${bot.Name}</span><span class="w-full text-right">${date.toLocaleString()}</span></span>`;
    html$ += `<span class="block">Voici mes commandes :</span>`;
    bot.Commands.forEach(command => {
        html$ += `<span class="block">~ ${command['command']} ${command['description'] != '' ? `(${command['description']})` : ''}</span>`;
    });
    html$ += `</div>`;
    html$ += `</li>`;
    html$ += `</ul>`;
    let list = document.getElementById('chat');
    list.innerHTML += html$;
    updateLocalStorage(html$);
    scroll(list);
}

function getMessage() {
    return document.getElementById('message').value;
}

function scroll(div) {
    div = document.getElementById('chat');
    div.scrollTo(0, div.scrollHeight);
}

function updateLocalStorage(data) {
    var stored = JSON.parse(localStorage.getItem('messages'));
    stored.push(data);
    localStorage.setItem('messages', JSON.stringify(stored));
}

function initializeChat() {
    if (localStorage.getItem('messages') == null)
        localStorage.setItem('messages', JSON.stringify([]));
    else {
        let list = document.getElementById('chat');
        let previousMessages = JSON.parse(localStorage.getItem('messages'));
        previousMessages.forEach(message => {
            list.innerHTML += message;
        });
        scroll(list);
    }
}

initializeChat();
displayBots();
document.getElementById('send').addEventListener('click', sendMessage, true);
document.addEventListener('keydown', function (e) {
    if (e.key == 'Enter')
        document.getElementById('send').click();
});