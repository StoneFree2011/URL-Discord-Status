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
        return; // Не делаем ничего, если URL отсутствует
    } else {
        chrome.storage.local.get(['extensionEnabled', 'token'], function (data) {
            var extensionEnabled = data.extensionEnabled || false;
            var token = data.token || '';
            var currentUrl = tab.url
            if (extensionEnabled) {
                if (currentUrl.includes('rezka')) {
                    setTimeout(() => {
                        content_name(tab, token, "HDrezka", "h1[itemprop='name']");
                    }, 1000); // Задержка 1 секунда
                } else if (currentUrl.includes('youtube')){
                    setTimeout(() => {
                        content_name(tab, token, "YouTube", "#title > h1 > yt-formatted-string");
                    }, 3000);
                } else if (currentUrl.includes('hd.kinopoisk')) { //не работает чет
                    setTimeout(() => {
                        content_name(tab, token, "КиноПоиск", "#__next > div.AppPageConstructor_root__tNsyi > div.FullLayout_root__LJhCD.main - view.with - transition > div > div > main > div.FilmContent_wrapper__EicQU > div > div > section > div > div.ContentWrapper_title__uVspG > h1 > span");
                    }, 1000); // Задержка 1 секунда
                } else {
                    currentUrl = currentUrl.replace(/^https?:\/\//i, ""); // Удаляем приставку "http://" или "https://"
                    doRequest("Смотрит " + currentUrl, '👁‍🗨', token);
                }
            } else {
                doRequest(" ", "none", token);
            }
        });
    }
}

function content_name(tab, token, host, content) { //для популярных сайтов
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: (content) => {
            var element = document.querySelector(content); //надо понять, почему content сюда не передается
            if (element) {
                console.log("Element found:", element.textContent);
                return element.textContent;
            } else {
                console.log("Element not found: ", content);
                return null;
            }
        }, args: [content] // Передаем значение content в функцию
    }).then(result => {
        var fieldValue = result[0].result;
        if (fieldValue) {
            doRequest("Смотрит '" + fieldValue + "' на " + host, '🎞', token);
        } else {
            doRequest("Смотрит " + host, '🎞', token);
        }
    }).catch(error => {
        console.error("Error executing script:", error);
    });
}