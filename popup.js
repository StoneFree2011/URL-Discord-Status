document.addEventListener('DOMContentLoaded', function () {
    var autoButton = document.getElementById('autoButton');
    autoButton.addEventListener('click', function () {
        getCookie(function (token) {
            if (token) {
                saveToken(token);
                toggleExtension(true);
            }
        });
    });

    var submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', function () {
        var token = document.getElementById('tokenInput').value;
        if (token) {
            saveToken(token);
            toggleExtension(true); // Включаем расширение после сохранения токена
        }
    });

    var toggleButton = document.getElementById('toggleButton'); //кнопка переключения
    toggleButton.addEventListener('click', function () {
        chrome.storage.local.get(['extensionEnabled', 'token'], function (data) {
            var extensionEnabled = data.extensionEnabled || false;
            var token = data.token || '';
            if (token) {
                extensionEnabled = !extensionEnabled;
                chrome.storage.local.set({ extensionEnabled: extensionEnabled });
                updateIndicator(extensionEnabled);
            }
        });
    });
    chrome.storage.local.get('extensionEnabled', function (data) {
        var extensionEnabled = data.extensionEnabled || false;
        updateIndicator(extensionEnabled);
    });
});

function updateIndicator(extensionEnabled) { //индикатор включения/выключения отслеживания
    var indicator = document.getElementById('indicator');
    if (extensionEnabled) {
        indicator.innerText = "Extension is ON";
        indicator.style.color = "green";
        chrome.action.setBadgeText({ text: "" }); // Убираем значок Badge
    } else {
        indicator.innerText = "Extension is OFF";
        indicator.style.color = "red";
        chrome.action.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
        chrome.action.setBadgeText({ text: "OFF" }); //расширение не работает
    }
}

function saveToken(token) { //сохранить введенный токен
    chrome.storage.local.set({ token: token }, function () {
        console.log('Token saved:', token);
    });
}

function toggleExtension(enabled) { //включить расширение
    chrome.storage.local.set({ extensionEnabled: enabled }, function () {
        console.log('Extension enabled:', enabled);
        updateIndicator(enabled);
    });
}

function getCookie(callback) {
    chrome.cookies.get({ url: 'https://discord.com', name: 'discordUserToken' }, function(cookie) {
        if (cookie) {
            callback(cookie.value);
        } else { //если найти куки в браузере не удалось
            chrome.tabs.query({ url: "https://discord.com/*" }, function (tabs) {
                if (tabs.length > 0) {
                    chrome.cookies.get({ url: tabs[0].url, name: 'discordUserToken' }, function (cookie) {
                        if (cookie) {
                            callback(cookie.value);
                        } else {
                            alert("Go to discord.com and try again")
                            callback(null);
                        }
                    });
                } else {
                    alert("Go to discord.com and try again")
                    callback(null);
                }
            });
        }
    });
}