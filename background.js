chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) { //Прослушивание на переключение вкладки
        handleTabChange(tab);
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.active && changeInfo.url) { //Прослушивание на обновление url вкладки
        handleTabChange(tab);
    }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "handleTabChange") { //Прослушивание на выключение расширения
        var tab = message.data.tab;
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
            currentUrl = currentUrl.replace(/^https?:\/\//i, ""); // Удаляем приставку "http://" или "https://"
            if (currentUrl.length > 120) { //Чтобы влезло в стутус дс
                currentUrl = currentUrl.substring(0, 120);
            }
            if (extensionEnabled) {
                switch (true) {
                    case currentUrl.includes('kinopoisk'): //Работает через пень-колоду, иногда надо перезагружать страницу, чтоб фильм сменился
                        special_content_name(tab, token, "КиноПоиск", ".OverviewTitle_image__kUB0t", "Смотреть ", "alt");
                        break;
                    case currentUrl.includes('youtube'):
                        content_name(tab, token, "YouTube", "#title > h1 > yt-formatted-string", "", "#text > a"); //ищем название видео и канала
                        break;
                    case currentUrl.includes('rezka'):
                        content_name(tab, token, "HDrezka", "h1[itemprop='name']");
                        break;
                    case currentUrl.includes('zeflix'): //Работает через пень-колоду, иногда надо перезагружать страницу, чтоб фильм сменился
                        content_name(tab, token, "Зетфликс", "#ftitle", " смотреть онлайн бесплатно");
                        break;
                    case currentUrl.includes('rutube'): //Работает через пень-колоду, иногда надо перезагружать страницу, чтоб фильм сменился
                        content_name(tab, token, "Рутуб", "#root > div > div:nth-child(3) > div > main > div.application-module__content > div.video-page-container-module__container > section > div > div.video-page-layout-module__left > section:nth-child(2) > div > div > div > section > h1");
                        break;
                    case currentUrl.includes('vk.com/video'):
                        content_name(tab, token, "VK видео", "#mv_title");
                        break;
                    case currentUrl.includes('kadikama'):
                        content_name(tab, token, "КАДИКАМА", "#dle-content > article > header > h2");
                        break;
                    case currentUrl.includes('lordserial'):
                        content_name(tab, token, "lordserial", "#in-full > article > div.fmain > div.fcols.fx-row > div > div.fleft-desc.fx-1 > div.flists.fx-row > ul:nth-child(1) > li:nth-child(1) > span:nth-child(2)");
                        break;
                    case currentUrl.includes('premier'):
                        content_name(tab, token, "premier", "#__nuxt > div.l-main > main > div > div > article > div.w-show-promo > div > div > div.w-show-promo__detail-content > h1");
                        break;
                    case currentUrl.includes('jut.su'):
                        content_name(tab, token, "jut.su", "#dle-content > div > h1 > span");
                        break;
                    case currentUrl.includes('animego'):
                        content_name(tab, token, "AnimeGO", "#content > div > div.media.mb-3.d-none.d-block.d-md-flex > div.media-body > div.anime-title > div > h1");
                        break;
                    case currentUrl.includes('xvideos'):
                        content_name(tab, token, "xvideos", "#title-auto-tr");
                        break;
                    case currentUrl.includes('pornhub.com'):
                        content_name(tab, token, "Желтый ютуб", "#hd-leftColVideoPage > div:nth-child(1) > div.title-container.translate > h1 > span");
                        break;
                    case currentUrl.includes('tiktok.com'):
                        content_name(tab, token, "TikTok", "#tabs-0-panel-search_top > div:nth-child(3) > div > div.css-1qjw4dg-DivContentContainer.e1mecfx00 > div.css-13if7zh-DivCommentContainer.ekjxngi0 > div > div.css-1xlna7p-DivProfileWrapper.ekjxngi4 > div.css-pcqxr7-DivDescriptionContentWrapper.e1mecfx011 > div.css-1nst91u-DivMainContent.e1mecfx01 > div.css-bs495z-DivWrapper.e1mzilcj0 > div > div.css-1d7krfw-DivOverflowContainer.e1mzilcj5 > div > span:nth-child(1)", "", "#tabs-0-panel-search_top > div:nth-child(3) > div > div.css-1qjw4dg-DivContentContainer.e1mecfx00 > div.css-13if7zh-DivCommentContainer.ekjxngi0 > div > div.css-1xlna7p-DivProfileWrapper.ekjxngi4 > div.css-pcqxr7-DivDescriptionContentWrapper.e1mecfx011 > div.css-85dfh6-DivInfoContainer.evv7pft0 > a.evv7pft4.css-n2qh4e-StyledLink-StyledLink.er1vbsz0 > span.css-1c7urt-SpanUniqueId.evv7pft1 > span");
                        break;
                    case currentUrl.includes('timehd'):
                        content_name(tab, token, "TIMEHD", "#dle-content > div > div.eMessage > div:nth-child(9) > font > h2", " онлайн в хорошем качестве все серии подряд бесплатно");
                        break;
                    default:
                        doRequest("Смотрит " + currentUrl, '👁‍🗨', token);
                }
            } else {
                doRequest(" ", "none", token);
            }
        });
    }
}

function content_name(tab, token, host, content1, remove = "", content2 = "") {
    setTimeout(() => {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: (content1, content2) => {
                var element1 = document.querySelector(content1);
                if (content2) {
                    var element2 = document.querySelector(content2);
                }
                if (element1 && element2) {
                    console.log("Element found:", element1.textContent);
                    console.log("Element found:", element2.textContent);
                    textContent = element1.textContent + " - " + element2.textContent
                    return textContent;
                } else if (element1 && !element2) {
                    console.log("Element found:", element1.textContent);
                    console.log("Element not found: ", content2);
                    return element1.textContent; // Если передан или найден только один элемент
                }
                else if (!element1 && element2) {
                    console.log("Element not found: ", content1);
                    console.log("Element found:", element2.textContent);
                    return element2.textContent;
                } else {
                    console.log("Element not found: ", content1);
                    return null;
                }
            }, args: [content1, content2]
        }).then(result => {
            var fieldValue = result[0].result;
            if (fieldValue) {
                fieldValue = fieldValue.replace("Смотреть ", "");
                fieldValue = fieldValue.replace(remove, "");
                doRequest("Смотрит '" + fieldValue + "' на " + host, '🎞', token);
            } else {
                doRequest("Смотрит " + host, '🎞', token);
            }
        }).catch(error => {
            console.error("Error executing script:", error);
            reject(error);
        });
    }, 1000); // Задержка 1 секунда
}

function special_content_name(tab, token, host, content, remove, special) { //где нужно найти определенный элемент
    setTimeout(() => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: (content, special) => {
            var element = document.querySelector(content); //надо понять, почему content сюда не передается
            if (element) {
                console.log("Element found:", element.getAttribute(special));
                return element.getAttribute(special);;
            } else {
                console.log("Element not found: ", content);
                return null;
            }
        }, args: [content, special] // Передаем значение content в функцию
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
    }, 1000); // Задержка 1 секунда
}