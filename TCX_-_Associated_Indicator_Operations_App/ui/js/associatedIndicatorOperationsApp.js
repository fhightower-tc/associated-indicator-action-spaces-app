/* global window, document, console, $,  */
'use-strict';


// for the "slashUnescape" function below, credits to https://stackoverflow.com/questions/46252753/how-do-i-properly-escape-and-unescape-a-multiline-string-that-contains-newline-l
var replacements = {'\\\\': '\\', '\\n': '\n', '\\"': '"'};

function slashUnescape(contents) {
    return contents.replace(/\\(\\|n|")/g, function(replace) {
        return replacements[replace];
    });
}


var ASSOCIATEDINDICATOROPERATIONSAPP = new Vue({
    el: '#app-content',
    data: {
        visible: false,
        indicatorDataComplete: [],
        indicatorsForCopy: ''
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
            var delimiter = getParameterByName("indicatorDelimiter");
            delimiter = slashUnescape(delimiter);
            return delimiter;
        },
    },
    methods: {
        getAssociatedIndicators: function() {
            var _this = this;
            
            /*
            filter on active + inactive indicators
            https://docs.threatconnect.com/en/latest/javascript/javascript_sdk.html#filters
            */
            indicatorStatusFilter = new Filter(FILTER.OR);
            indicatorStatusFilter.on('active', FILTER.EQ, 'true');
            indicatorStatusFilter.on('active', FILTER.EQ, 'false');
            
            groups = this.tc.groups()
            groups.owner(this.tcSelectedOwner)
                .type(TYPE[this.tcSimpleType.toUpperCase()])
                .id(this.tcSelectedItem)
                .resultLimit(500)
                .filter(indicatorStatusFilter)
                .done(function(response) {
                    var associatedIndicators = response['data'];
                    _this.indicatorDataComplete = associatedIndicators;
                    _this.indicatorsForCopy = _this.indicatorDataComplete.map(x => x['indicator']).join(_this.indicatorDelimiter);
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
