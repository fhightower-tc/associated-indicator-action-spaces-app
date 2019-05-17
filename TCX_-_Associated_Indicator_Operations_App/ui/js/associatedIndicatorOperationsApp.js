/* global window, document, console, $,  */
"use-strict";

var ASSOCIATEDINDICATOROPERATIONSAPP = new Vue({
    el: "#app-content",
    data: {
        visible: false
    },
    computed: {
        tc: function () {
            /* Start an instance of the TC SDK. */
            var tcSpaceElementId = getParameterByName('tcSpaceElementId'); // spaces mode if spaceElementId defined
            var apiSettings;

            if (tcSpaceElementId) {
                apiSettings = {
                    apiToken: getParameterByName('tcToken'),
                    apiUrl: getParameterByName('tcApiPath')
                };
            }
            var tc = new ThreatConnect(apiSettings);

            return tc;
        },
        tcSelectedType: function() {
            return groupHelper(getParameterByName("tcType"));
        },
        tcSimpleType: function() {
            if (this.tcSelectedType !== undefined) {
                return this.tcSelectedType.type;
            } else {
                return undefined;
            }
        },
        tcSelectedItem: function() {
            return getParameterByName("tcSelectedItem");
        },
        tcSelectedOwner: function() {
            return getParameterByName("tcSelectedItemOwner");
        }
    },
    methods: {
        startApp: function() {
            // make the main app div visible (this prevents a flash of unstyled content)
            this.visible = true;
            // start the zurb foundation scripts
            window.setTimeout(function() {
                $(document).foundation();
            }, 1);
            $.jGrowl("This is the start of something great!", { group: 'success-growl' });
        }
    }
});
