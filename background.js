async function doRequest(text, token) {
    const STATUS_URL = "https://discord.com/api/v9/users/@me/settings";
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
    };
    try {
        const response = await fetch(STATUS_URL, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify({
                custom_status: { text: text }
            })
        });
        if (response.ok) {
            return true;
        } else {
            throw new Error("Request failed with status: " + response.status);
        }
    } catch (error) {
        throw new Error("Network error occurred: " + error.message);
    }
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        handleTabChange(tab);
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.active && changeInfo.url) {
        handleTabChange(tab);
    }
});

function handleTabChange(tab) {
    if (!tab.url) {
        return; // Не делаем ничего, если URL отсутствует
    }

    if (!tab.url.includes("rezka")) {
        try {
            var currentUrl = tab.url.replace(/^https?:\/\//i, ""); // Удаляем приставку "http://" или "https://"
        } catch (error) {
            throw new Error("Network error occurred: " + error.message);
            var currentUrl = tab.url
        }
        chrome.storage.local.get(['extensionEnabled', 'token'], function (data) {
            var extensionEnabled = data.extensionEnabled || false;
            var token = data.token || '';
            if (extensionEnabled) {
                doRequest("Смотрит " + currentUrl, token);
            } else {
                doRequest(" ", token);
            }
        });
    } else {
        chrome.storage.local.get(['extensionEnabled', 'token'], function (data) {
            var extensionEnabled = data.extensionEnabled || false;
            var token = data.token || '';
            if (extensionEnabled) {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    function: () => document.querySelector("h1[itemprop='name']").textContent
                }).then(result => {
                    var fieldValue = result[0].result;
                    if (fieldValue) {
                        doRequest("Смотрит '" + fieldValue + "' на HDrezka", token);
                    } else {
                        doRequest("Смотрит HDrezka", token);
                    }
                }).catch(error => {
                    doRequest("Смотрит HDrezka", token);
                });
            } else {
                doRequest(" ", token);
            }
        });
    }
}


