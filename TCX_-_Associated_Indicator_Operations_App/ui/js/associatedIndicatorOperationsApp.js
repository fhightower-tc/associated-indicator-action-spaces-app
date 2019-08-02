/* global window, document, console, $,  */
'use-strict';

var ASSOCIATEDINDICATOROPERATIONSAPP = new Vue({
    el: '#app-content',
    data: {
        visible: false,
        indicators: []
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
            return groupHelper(getParameterByName('tcType'));
        },
        tcSimpleType: function() {
            if (this.tcSelectedType !== undefined) {
                return this.tcSelectedType.type;
            } else {
                return undefined;
            }
        },
        tcSelectedItem: function() {
            return getParameterByName('tcSelectedItem');
        },
        tcSelectedOwner: function() {
            return getParameterByName('tcSelectedItemOwner');
        },
        indicatorDelimiter: function() {
            return getParameterByName("indicatorDelimiter");
        },
    },
    methods: {
        getAssociatedIndicators: function() {
            var _this = this;

            groups = this.tc.groups()
            groups.owner(this.tcSelectedOwner)
                .type(TYPE[this.tcSimpleType.toUpperCase()])
                .id(this.tcSelectedItem)
                .resultLimit(500)
                .done(function(response) {
                    var associatedIndicators = response['data'];
                    _this.indicators = associatedIndicators
                })
                .error(function(response) {
                    // TODO: make this a growl
                    console.error('Error retrieving indicators associated with the group', response);
                    $.jGrowl('Error retrieving indicators associated with the group', { group: 'failure-growl' });
                })
                .retrieveAssociations({
                    type: TYPE.INDICATOR
                });
        },
        copyIndicators: function() {
            var copyText = document.getElementById("indicatorsHidden");
            copyText.select();
            var copied = document.execCommand("copy");
            if (copied) {
                $.jGrowl('Associated indicators have been copied.', {group: 'success-growl'});
            } else {
                $.jGrowl('Unable to copy associated indicators, sorry. Try upgrading your browser or using a different browser', {group: 'failure-growl'});
            }
        },
        startApp: function() {
            // get the associated indicators
            this.getAssociatedIndicators();
            // make the main app div visible (this prevents a flash of unstyled content)
            this.visible = true;
            // start the zurb foundation scripts
            window.setTimeout(function() {
                $(document).foundation();
            }, 1);
        }
    }
});
