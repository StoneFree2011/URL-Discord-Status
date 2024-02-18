browser.tabs.onActivated.addListener(function (activeInfo) {
    browser.tabs.get(activeInfo.tabId, function (tab) {
        handleTabChange(tab);
    });
});

browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.active && changeInfo.url) {
        handleTabChange(tab);
    }
});

async function doRequest(text, emoji, token) {
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
                custom_status: {
                    text: text,
                    emoji_name: emoji
                }
            })
        });
        if (response.ok) {
            return true;
        } else {
            console.log("Request failed with status: ", response.status);
        }
    } catch (error) {
        console.error("Network error occurred: ", error);
    }
}

function handleTabChange(tab) {
    if (!tab.url) {
        return;
    } else {
        browser.storage.local.get(['extensionEnabled', 'token'], function (data) {
            var extensionEnabled = data.extensionEnabled || false;
            var token = data.token || '';
            var currentUrl = tab.url
            currentUrl = currentUrl.replace(/^https?:\/\//i, "");
            if (extensionEnabled) {
                switch (true) {
                    case currentUrl.includes('rezka'):
                        setTimeout(() => {
                            content_name(tab, token, "HDrezka", "h1[itemprop='name']", "");
                        }, 1000);
                        break;
                    case currentUrl.includes('youtube'):
                        setTimeout(() => {
                            content_name(tab, token, "YouTube", "#title > h1 > yt-formatted-string", "");
                        }, 3000);
                        break;
                    case currentUrl.includes('kinopoisk'):
                        setTimeout(() => {
                            special_content_name(tab, token, "КиноПоиск", ".OverviewTitle_image__kUB0t", "Смотреть ", "alt");
                        }, 1000);
                        break;
                    case currentUrl.includes('zeflix'):
                        setTimeout(() => {
                            content_name(tab, token, "Зетфликс", "#ftitle", " смотреть онлайн бесплатно");
                        }, 1000);
                        break;
                    // ... (остальные кейсы)
                    default:
                        doRequest("Смотрит " + currentUrl, '👁‍🗨', token);
                }
            } else {
                doRequest(" ", "none", token);
            }
        });
    }
}

function content_name(tab, token, host, content, remove) {
    browser.scripting.executeScript({
        target: { tabId: tab.id },
        function: (content) => {
            var element = document.querySelector(content);
            if (element) {
                console.log("Element found:", element.textContent);
                return element.textContent;
            } else {
                console.log("Element not found: ", content);
                return null;
            }
        }, args: [content]
    }).then(result => {
        var fieldValue = result[0].result;
        if (fieldValue) {
            fieldValue = fieldValue.replace(remove, "");
            doRequest("Смотрит '" + fieldValue + "' на " + host, '🎞', token);
        } else {
            doRequest("Смотрит " + host, '🎞', token);
        }
    }).catch(error => {
        console.error("Error executing script:", error);
    });
}

function special_content_name(tab, token, host, content, remove, special) {
    browser.scripting.executeScript({
        target: { tabId: tab.id },
        function: (content, special) => {
            var element = document.querySelector(content);
            if (element) {
                console.log("Element found:", element.getAttribute(special));
                return element.getAttribute(special);
            } else {
                console.log("Element not found: ", content);
                return null;
            }
        }, args: [content, special]
    }).then(result => {
        var fieldValue = result[0].result;
        if (fieldValue) {
            fieldValue = fieldValue.replace(remove, "");
            doRequest("Смотрит '" + fieldValue + "' на " + host, '🎞', token);
        } else {
            doRequest("Смотрит " + host, '🎞', token);
        }
    }).catch(error => {
        console.error("Error executing script:", error);
    });
}
