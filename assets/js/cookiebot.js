(function () {
    function loadCookiebot() {
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
    }

    function initContactFormConsentHandling() {
        document.addEventListener('DOMContentLoaded', function () {
            var contactIframe = document.getElementById('contact-form-iframe');
            if (!contactIframe) {
                return;
            }

            var formUrl = contactIframe.getAttribute('data-src');
            var placeholder = document.getElementById('contact-form-placeholder');
            var settingsButton = document.getElementById('cookie-settings-button');

            if (settingsButton) {
                settingsButton.addEventListener('click', function () {
                    if (window.Cookiebot && typeof window.Cookiebot.show === 'function') {
                        window.Cookiebot.show();
                    }
                });
            }

            function showForm() {
                if (formUrl && contactIframe.src !== formUrl) {
                    contactIframe.src = formUrl;
                }
                contactIframe.style.display = '';
                contactIframe.removeAttribute('aria-hidden');

                if (placeholder) {
                    placeholder.hidden = true;
                }
            }

            function showPlaceholder() {
                if (formUrl && contactIframe.src !== 'about:blank') {
                    contactIframe.src = 'about:blank';
                }
                contactIframe.style.display = 'none';
                contactIframe.setAttribute('aria-hidden', 'true');

                if (placeholder) {
                    placeholder.hidden = false;
                }
            }

            function updateContactFormVisibility() {
                if (window.Cookiebot && window.Cookiebot.consent) {
                    var consent = window.Cookiebot.consent;
                    var allowForm = Boolean(
                        consent.marketing ||
                        consent.statistics ||
                        consent.preferences
                    );

                    if (allowForm) {
                        showForm();
                    } else {
                        showPlaceholder();
                    }
                } else {
                    showForm();
                }
            }

            updateContactFormVisibility();

            window.addEventListener('CookiebotOnConsentReady', updateContactFormVisibility);
            window.addEventListener('CookiebotOnAccept', updateContactFormVisibility);
            window.addEventListener('CookiebotOnDecline', updateContactFormVisibility);
        });
    }

    loadCookiebot();
    initContactFormConsentHandling();
})();
