(function() {
    'use strict';

    angular.module('app', [
        // Common (everybody has access to these)
        'app.core',

        // Features (listed alphabetically)
        'app.approot',
        'app.home',
        'app.scan',
        'app.transactions',
        // 'app.login',
        'app.toolbar',
        'ja.qr',
        'qrScanner',
        'md.data.table'
    ]);
})();
