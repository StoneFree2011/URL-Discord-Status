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
            toggleExtension(true);
        }
    });

    var toggleButton = document.getElementById('toggleButton');
    toggleButton.addEventListener('click', function () {
        browser.storage.local.get(['extensionEnabled', 'token'], function (data) {
            var extensionEnabled = data.extensionEnabled || false;
            var token = data.token || '';
            if (token) {
                extensionEnabled = !extensionEnabled;
                browser.storage.local.set({ extensionEnabled: extensionEnabled });
                updateIndicator(extensionEnabled);
            }
        });
    });

    browser.storage.local.get('extensionEnabled', function (data) {
        var extensionEnabled = data.extensionEnabled || false;
        updateIndicator(extensionEnabled);
    });
});

function updateIndicator(extensionEnabled) {
    var indicator = document.getElementById('indicator');
    if (extensionEnabled) {
        indicator.innerText = "Extension is ON";
        indicator.style.color = "green";
        browser.action.setBadgeText({ text: "" });
    } else {
        indicator.innerText = "Extension is OFF";
        indicator.style.color = "red";
        browser.action.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
        browser.action.setBadgeText({ text: "OFF" });
    }
}

function saveToken(token) {
    browser.storage.local.set({ token: token }, function () {
        console.log('Token saved:', token);
    });
}

function toggleExtension(enabled) {
    browser.storage.local.set({ extensionEnabled: enabled }, function () {
        console.log('Extension enabled:', enabled);
        updateIndicator(enabled);
    });
}

function getCookie(callback) {
    browser.cookies.get({ url: 'https://discord.com', name: 'discordUserToken' }, function(cookie) {
        if (cookie) {
            callback(cookie.value);
        } else {
            browser.tabs.query({ url: "https://discord.com/*" }, function (tabs) {
                if (tabs.length > 0) {
                    browser.cookies.get({ url: tabs[0].url, name: 'discordUserToken' }, function (cookie) {
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
