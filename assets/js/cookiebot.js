(function loadCookiebot() {
    if (document.getElementById('Cookiebot')) {
        return;
    }

    var script = document.createElement('script');
    script.id = 'Cookiebot';
    script.src = 'https://consent.cookiebot.com/uc.js';
    script.type = 'text/javascript';
    script.setAttribute('data-cbid', '1aaaafb2-1ba3-470b-80dd-d7cc641f15c3');
    script.setAttribute('data-blockingmode', 'auto');
    script.async = false;

    var head = document.head || document.getElementsByTagName('head')[0];
    if (head) {
        head.appendChild(script);
    } else {
        document.documentElement.appendChild(script);
    }
})();
