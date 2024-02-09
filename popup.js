document.addEventListener('DOMContentLoaded', function () {
    var submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', function () {
        var token = document.getElementById('tokenInput').value;
        saveToken(token);
        toggleExtension(true); // Включаем расширение после сохранения токена
    });

    var toggleButton = document.getElementById('toggleButton'); //кнопка переключения
    toggleButton.addEventListener('click', function () {
        chrome.storage.local.get('extensionEnabled', function (data) {
            var extensionEnabled = data.extensionEnabled || false;
            extensionEnabled = !extensionEnabled;
            chrome.storage.local.set({ extensionEnabled: extensionEnabled });
            updateIndicator(extensionEnabled);
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
