// ==UserScript==
// @name        V2Board iOS #/login Autofill Fix (Clean)
// @namespace    https://staybrowser.com/
// @version      0.1
// @author       jo059
// @description 修复 v2b 框架登录页用户名/密码属性，保持 Safari 自动填充效果
// @match       https://www.anyway.best/*
// @match       https://www.ctc.run/*
// @match       *://*/#/login*
// @run-at      document-end
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        emailSelector: 'input[placeholder="邮箱"], input[name=email], input[type=email], input[type=text]',
        passwordSelector: 'input[placeholder="密码"], input[type=password]',
        maxAttempts: 50,
        interval: 300
    };

    function modifyInputFields() {
        const emailInput = document.querySelector(config.emailSelector);
        const passwordInput = document.querySelector(config.passwordSelector);

        if (emailInput && passwordInput) {

            // 修改邮箱输入框
            if (emailInput.type === 'text' || emailInput.type === 'email') {
                emailInput.type = 'email';
                emailInput.setAttribute('autocomplete', 'username');
                if (!emailInput.name) emailInput.name = 'username';
                if (!emailInput.id) emailInput.id = 'email';
            }

            // 修改密码输入框
            if (passwordInput.type === 'password') {
                passwordInput.setAttribute('autocomplete', 'current-password');
                if (!passwordInput.name) passwordInput.name = 'password';
                if (!passwordInput.id) passwordInput.id = 'password';
            }

            // 表单 autocomplete
            const form = emailInput.closest('form') || passwordInput.closest('form');
            if (form) form.setAttribute('autocomplete', 'on');

            return true;
        }
        return false;
    }

    function setupMutationObserver() {
        const observer = new MutationObserver(() => modifyInputFields());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function pollForElements() {
        let attempts = 0;
        const intervalId = setInterval(() => {
            attempts++;
            if (modifyInputFields() || attempts >= config.maxAttempts) {
                clearInterval(intervalId);
            }
        }, config.interval);
    }

    function init() {
        if (!modifyInputFields()) {
            setupMutationObserver();
            pollForElements();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // SPA 路由变化监听
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(modifyInputFields, 500);
        }
    }).observe(document, { subtree: true, childList: true });

})();
