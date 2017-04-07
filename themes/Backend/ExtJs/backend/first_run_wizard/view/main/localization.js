/**
 * Shopware 5
 * Copyright (c) shopware AG
 *
 * According to our dual licensing model, this program can be used either
 * under the terms of the GNU Affero General Public License, version 3,
 * or under a proprietary license.
 *
 * The texts of the GNU Affero General Public License with an additional
 * permission and of our proprietary license can be found at and
 * in the LICENSE file you have received along with this program.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * "Shopware" is a registered trademark of shopware AG.
 * The licensing of the program under the AGPLv3 does not imply a
 * trademark license. Therefore any rights, title and interest in
 * our trademarks remain entirely with us.
 */

/**
 * Shopware First Run Wizard - Localization tab
 *
 * @category  Shopware
 * @package   Shopware
 * @copyright Copyright (c) shopware AG (http://www.shopware.de)
 */

// {namespace name=backend/first_run_wizard/main}
// {block name="backend/first_run_wizard/view/main/localization"}

Ext.define('Shopware.apps.FirstRunWizard.view.main.Localization', {
    extend: 'Ext.container.Container',

    /**
     * List of short aliases for class names. Most useful for defining xtypes for widgets.
     * @string
     */
    alias: 'widget.first-run-wizard-localization',

    /**
     * Name attribute used to generate event names
     */
    name: 'localization',

    overflowY: 'auto',

    snippets: {
        content: {
            welcomeTitle: '{s name=home/content/title}Welcome to Shopware{/s}',
            welcomeMessage: '{s name=home/content/message}Welcome to your Shopware shop. The First Run Wizard will accompany you in your first steps with Shopware and give you valuable tips about the configuration options.{/s}',
            title: '{s name=localization/content/title}Localization{/s}',
            message: '{s name=localization/content/message}Take your business abroad using localizations plugins. Start by selecting the language you want to add to your shop. You will receive a list of recommended plugins for your shop, that will add translations and other useful features to your Shopware installation.{/s}',
            noPlugins: '{s name=localization/content/noPlugins}No plugins found{/s}'
        },
        languagePicker: '{s name=localization/languagePicker}Select a language to filter{/s}',
        buttons: {
            retry: '{s name=home/buttons/retry}Retry{/s}'
        },
        isNotConnected: {
            text: '{s name=home/is_not_connected/text}Could not connect to the Shopware Community Store{/s}',
            icon: 'cross-circle'
        }
    },

    initComponent: function() {
        var me = this;

        // A list of available localizations. Can be moved to a store after SBP has a call to load those.
        me.technicalLocalizationPluginNames = [
            'SwagBulgaria', 'SwagCzech', 'SwagFrance', 'SwagItaly', 'SwagNetherlands', 'SwagPoland', 'SwagPortuguese', 'SwagSpain'
        ];

        me.localizationStore = Ext.create('Shopware.apps.FirstRunWizard.store.Localization').load(
            function(records) {
                me.setDefaultLocalization(records);
            }
        );

        me.welcomeTitleContainer = Ext.create('Ext.container.Container', {
            border: false,
            bodyPadding: 20,
            style: 'font-weight: 700; line-height: 20px;',
            html: '<h1>' + me.snippets.content.welcomeTitle + '</h1>'
        });

        me.welcomeMessageContainer = Ext.create('Ext.container.Container', {
            border: false,
            bodyPadding: 20,
            style: 'margin-bottom: 40px;',
            html: '<p>' + me.snippets.content.welcomeMessage + '</p>',
            width: '100%'
        });

        me.localizationTitleContainer = Ext.create('Ext.container.Container', {
            border: false,
            hidden: true,
            bodyPadding: 20,
            style: 'font-weight: 700; line-height: 20px;',
            html: '<h1>' + me.snippets.content.title + '</h1>'
        });

        me.localizationMessageContainer = Ext.create('Ext.container.Container', {
            border: false,
            hidden: true,
            bodyPadding: 20,
            style: 'margin-bottom: 10px;',
            html: '<p>' + me.snippets.content.message + '</p>'
        });

        me.loadingIndicatorContainer = me.createLoadingIndicator();
        me.loadingResultContainer = me.createLoadingResultContainer();
        me.languagePicker = me.createLanguagePicker();
        me.storeListingContainer = me.createStoreListing();
        me.noResultMessage = me.createNoResultMessage();

        me.refreshLoadingResultContainer();

        me.items = [
            me.welcomeTitleContainer,
            me.welcomeMessageContainer,
            me.localizationTitleContainer,
            me.localizationMessageContainer,
            me.loadingIndicatorContainer,
            me.loadingResultContainer,
            me.languagePicker,
            me.storeListingContainer,
            me.noResultMessage
        ];

        me.callParent(arguments);
    },

    /**
     * Creates the existing account form
     *
     * @return Ext.form.FieldSet Contains the form for existing account login
     */
    createLanguagePicker: function () {
        var me = this;

        me.languageFilter = Ext.create('Ext.form.field.ComboBox', {
            store: me.localizationStore,
            queryMode: 'local',
            valueField: 'locale',
            displayField: 'text',
            hidden: true,
            emptyText: me.snippets.languagePicker,
            editable: false,
            listeners: {
                change: {
                    fn: function(view, newValue) {
                        me.fireEvent('changeLanguageFilter', newValue);
                    }
                }
            }
        });

        return Ext.create('Ext.form.FieldSet', {
            cls: Ext.baseCSSPrefix + 'base-field-set',
            width: 632,
            hidden: true,
            defaults: {
                anchor: '100%'
            },
            items: [
                me.languageFilter
            ]
        });
    },

    createStoreListing: function() {
        var me = this;

        me.communityStore = Ext.create('Shopware.apps.FirstRunWizard.store.LocalizationPlugin');
        me.storeListing = Ext.create('Shopware.apps.PluginManager.view.components.Listing', {
            store: me.communityStore,
            scrollContainer: me,
            width: 632,
            hidden: true
        });

        me.communityStore.on('load', function(store, records) {
            if (!records || records.length <= 0) {
                me.content.setVisible(false);
                me.noResultMessage.setVisible(true);
            } else {
                Ext.each(records, function (record) {
                    if (Ext.Array.contains(me.technicalLocalizationPluginNames, record.data.technicalName)) {
                        me.fireEvent('promptInstallLocalization', record.data.technicalName);
                    }
                });
            }
            me.storeListing.setLoading(false);
        });

        me.content = Ext.create('Ext.container.Container', {
            items: [
                me.storeListing
            ]
        });

        return me.content;
    },

    createNoResultMessage: function() {
        var me = this;

        return Ext.create('Ext.Component', {
            style: 'margin-top: 30px; font-size: 20px; text-align: center;',
            html: '<h2>' + me.snippets.content.noPlugins + '</h2>',
            hidden: true
        });
    },

    refreshData: function() {
        var me = this;

        me.fireEvent('localizationResetData');
        me.content.setVisible(true);
        me.noResultMessage.setVisible(false);

        if (me.languageFilter.getValue()) {
            me.storeListing.setLoading(true);
            me.storeListing.resetListing();
            me.communityStore.load();
        }
    },

    getButtons: function() {
        var me = this,
            buttons = {
                previous: {
                    visible: false
                },
                next: {
                }
            };

        if (me.firstRunWizardIsConnected === null && me.connectionResult !== true) {
            buttons.next.text = me.snippets.buttons.skip;
        }

        if (me.firstRunWizardIsConnected === false) {
            buttons.extraButtonSettings = {
                text: me.snippets.buttons.retry,
                cls: 'primary',
                name: 'retry-button',
                width: 180,
                handler: function() {
                    me.fireEvent('retryConnectivityTest');
                }
            };
        }

        return buttons;
    },

    displayLocalizationElements: function () {
        var me = this;
        me.localizationTitleContainer.show();
        me.localizationMessageContainer.show();
        me.languageFilter.show();
        me.storeListing.show();
        me.languagePicker.show();
    },

    createLoadingIndicator: function() {
        var me = this;
        me.loadingIndicator = Ext.create('Ext.ProgressBar', {
            animate: true,
            hidden: me.firstRunWizardIsConnected !== null,
            style: {
                marginLeft: '135px',
                width: '365px'
            }
        });

        me.loadingIndicator.wait({
            text: '{s name=home/content/checking_connection}Checking Shopware server connection{/s}',
            scope: this
        });

        return me.loadingIndicator;
    },

    createLoadingResultContainer: function() {
        return Ext.create('Ext.container.Container', {
            html: ''
        });
    },

    setDefaultLocalization: function(records) {
        var me = this,
            installedLocale = Ext.util.Cookies.get('installed-locale');

        Ext.each(records, function(record) {
            if (record.get('locale') === '{s namespace="backend/base/index" name=script/ext/locale}{/s}' ||
                record.get('locale') === installedLocale) {
                me.languageFilter.setValue(record.get('locale'));
            }
        });
    },

    refreshLoadingResultContainer: function() {
        var me = this;

        if (me.firstRunWizardIsConnected === true) {
            me.loadingResultContainer.hide();
            me.languageFilter.getStore().load(function(records) {
                me.setDefaultLocalization(records);
            });
            me.displayLocalizationElements();
        } else if (me.firstRunWizardIsConnected === false) {
            me.loadingResultContainer.update(
                Ext.String.format(
                    '<div style="display: flex; justify-content: center; margin-top: -10px; border: 1px solid red; border-radius: 5px; padding: 6px;">' +
                    '   <div style="width: 16px; height: 16px; float: none; display: inline-block;' +
                    '        align-self: center; margin-right: 8px;" class="sprite-[0]"></div>' +
                    '   <div style="display: inline-block; width: calc(100% - 21px);">[1]</div>' +
                    '</div>',
                    me.snippets.isNotConnected.icon, me.snippets.isNotConnected.text
                )
            );
            me.loadingResultContainer.show();
        } else {
            me.loadingResultContainer.hide();
        }

        return me.loadingResultContainer;
    }
});

// {/block}
