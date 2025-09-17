(function () {
    var MANUAL_CONSENT_KEY = 'rocketMealsContactFormConsent';

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

    function hasManualConsent() {
        try {
            return Boolean(window.localStorage && window.localStorage.getItem(MANUAL_CONSENT_KEY) === 'true');
        } catch (error) {
            return false;
        }
    }

    function storeManualConsent() {
        try {
            if (window.localStorage) {
                window.localStorage.setItem(MANUAL_CONSENT_KEY, 'true');
            }
        } catch (error) {
            // Ignore storage errors (e.g. private browsing)
        }
    }

    function clearManualConsent() {
        try {
            if (window.localStorage) {
                window.localStorage.removeItem(MANUAL_CONSENT_KEY);
            }
        } catch (error) {
            // Ignore storage errors (e.g. private browsing)
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
            var loadButton = document.getElementById('load-contact-form-button');

            if (settingsButton) {
                settingsButton.addEventListener('click', function () {
                    if (window.Cookiebot && typeof window.Cookiebot.show === 'function') {
                        window.Cookiebot.show();
                    }
                });
            }

            if (loadButton) {
                loadButton.addEventListener('click', function () {
                    storeManualConsent();
                    showForm();
                });
            }

            function showForm() {
                if (formUrl && contactIframe.src !== formUrl) {
                    contactIframe.src = formUrl;
                }
                contactIframe.style.display = '';
                contactIframe.setAttribute('aria-hidden', 'false');

                if (placeholder) {
                    placeholder.hidden = true;
                    placeholder.setAttribute('aria-hidden', 'true');
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
                    placeholder.removeAttribute('aria-hidden');
                }
            }

            function updateContactFormVisibility() {
                var hasConsent = false;

                if (window.Cookiebot && window.Cookiebot.consent) {
                    var consent = window.Cookiebot.consent;
                    hasConsent = Boolean(
                        consent.marketing ||
                        consent.statistics ||
                        consent.preferences
                    );
                }

                if (hasConsent || hasManualConsent()) {
                    showForm();
                } else {
                    showPlaceholder();
                }
            }

            updateContactFormVisibility();

            window.addEventListener('CookiebotOnConsentReady', updateContactFormVisibility);
            window.addEventListener('CookiebotOnAccept', updateContactFormVisibility);
            window.addEventListener('CookiebotOnDecline', function () {
                clearManualConsent();
                updateContactFormVisibility();
            });
        });
    }

    loadCookiebot();
    initContactFormConsentHandling();
})();
