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
    chrome.storage.local.get(['extensionEnabled', 'token'], function (data) {
        var extensionEnabled = data.extensionEnabled || false;
        var token = data.token || '';
        if (extensionEnabled) {
            chrome.tabs.get(activeInfo.tabId, function (tab) {
                var currentUrl = tab.url;
                currentUrl = currentUrl.replace(/^https?:\/\//i, ""); // Удаляем приставку "http://" или "https://"
                doRequest("Смотрит " + currentUrl, token)
            });
        } else {
            doRequest(" ", token)
        }
    });
});

