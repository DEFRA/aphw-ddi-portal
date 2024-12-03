/**
 * @typedef FormgroupBeforeInputs
 * @property {string} [text] - Text to add before all checkbox items. If html is provided, the text option will be ignored.
 * @property {string} [html] - HTML to add before all checkbox items. If html is provided, the text option will be ignored.
 **/
/**
 * @typedef FormgroupAfterInputs
 * @property {string} [text] - Text to add after all checkbox items. If html is provided, the text option will be ignored.
 * @property {string} [html] - HTML to add after all checkbox items. If html is provided, the text option will be ignored.
 **/
/**
 * @typedef StandardComponent
 * @property {string} [classes]
 * @property {HTMLAttributes} [attributes]
 */
/**
 * @typedef FormGroupObject
 * @property {string} classes - Classes to add to the form group (for example to show error state for the whole group).
 * @property {HTMLAttributes} attributes - HTML attributes (for example data attributes) to add to the form group.
 * @property {FormgroupBeforeInputs} beforeInputs - Content to add before all checkbox items within the checkboxes component. See formGroup beforeInputs.
 * @property {FormgroupAfterInputs} afterInputs - Content to add after all checkbox items within the checkboxes component. See formGroup afterInputs.
 */

/**
 * @typedef GovukHintComponent
 * @property {string} [text] - Required. If html is set, this is not required. Text to use within the hint. If html is provided, the text option will be ignored.
 * @property {string} [html] - Required. If text is set, this is not required. HTML to use within the hint. If html is provided, the text option will be ignored.
 * @property {string} [id] - Optional ID attribute to add to the hint span tag.
 * @property {string} [classes] - Classes to add to the hint span tag.
 * @property {HTMLAttributes} [attributes] - HTML attributes (for example data attributes) to add to the hint span tag.
 */

/**
 * @typedef LabelComponent
 * @property {string} [text] - Required. If html is set, this is not required. Text to use within the hint. If html is provided, the text option will be ignored.
 * @property {string} [html] - Required. If text is set, this is not required. HTML to use within the hint. If html is provided, the text option will be ignored.
 * @property {string} [for]
 * @property {boolean} [isPageHeading]
 * @property {string} [classes] - Classes to add to the label tag.
 * @property {HTMLAttributes} [attributes] - HTML attributes (for example data attributes) to add to the label tag.
 **/

/**
 * @typedef Conditional
 * @property {string} html - The HTML to reveal when the checkbox is checked.
 **/

/**
 * @typedef ErrorMessageComponent
 * @property {string} text - Required. If html is set, this is not required. Text to use within the error message. If html is provided, the text option will be ignored.
 * @property {string} html - Required. If text is set, this is not required. HTML to use within the error message. If html is provided, the text option will be ignored.
 * @property {string} id - ID attribute to add to the error message <p> tag.
 * @property {string} classes - Classes to add to the error message <p> tag.
 * @property {HTMLAttributes} attributes - HTML attributes (for example data attributes) to add to the error message <p> tag.
 * @property {string} visuallyHiddenText - A visually hidden prefix used before the error message. Defaults to "Error".
 */

/**
 * @typedef ItemsArrayObject
 * @property {string} [text] - If html is set, this is not required. Text to use within each checkbox item label. If html is provided, the text option will be ignored.
 * @property {string} [html] - If text is set, this is not required. HTML to use within each checkbox item label. If html is provided, the text option will be ignored.
 * @property {string} value - Value for the checkbox input.
 * @property {string} [id] - Specific ID attribute for the checkbox item. If omitted, then component global idPrefix option will be applied.
 * @property {string} [name] - Specific name for the checkbox item. If omitted, then component global name string will be applied.
 * @property {LabelComponent} [label] - Subset of options for the label used by each checkbox item within the checkboxes component. See items label.
 * @property {GovukHintComponent} [hint] - Can be used to add a hint to each checkbox item within the checkboxes component. See hint.
 * @property {string} [divider] - Divider text to separate checkbox items, for example the text "or".
 * @property {boolean} [checked] - Whether the checkbox should be checked when the page loads. Takes precedence over the top-level values option.
 * @property {Conditional} [conditional] - Provide additional content to reveal when the checkbox is checked. See items conditional.
 * @property {string} [behaviour] - If set to "exclusive", implements a ‘None of these’ type behaviour via JavaScript when checkboxes are clicked.
 * @property {boolean} [disabled] - If true, checkbox will be disabled.
 * @property {HTMLAttributes} [attributes] - HTML attributes (for example data attributes) to add to the checkbox input tag.
 */

/**
 * @typedef {string} Formgroup
 * @property {string} classes - Classes to add to the form group (for example to show error state for the whole group).
 * @property {HTMLAttributes} attributes - HTML attributes (for example data attributes) to add to the form group.
 * @property {FormgroupBeforeInputs} [beforeInputs] - Content to add before all checkbox items within the checkboxes component. See formGroup beforeInputs.
 * @property {FormgroupAfterInputs} [afterInputs] - Content to add after all checkbox items within the checkboxes component. See formGroup afterInputs.
 **/

/**
 * @typedef FieldsetLegend
 * @property {string} [text] - If html is set, this is not required. Text to use within the legend. If html is provided, the text option will be ignored.
 * @property {string} [html] - If text is set, this is not required. HTML to use within the legend. If html is provided, the text option will be ignored.
 * @property {string} [classes] - Classes to add to the legend.
 * @property {boolean} [isPageHeading] - Whether the legend also acts as the heading for the page.
 */

/**
 * @typedef GovukFieldset
 * @property {FieldsetLegend} legend - The legend for the fieldset component. See legend.
 * @property {string} [describedBy] - One or more element IDs to add to the aria-describedby attribute, used to provide additional descriptive information for screenreader users.
 * @property {string} [classes] - Classes to add to the fieldset container.
 * @property {string} [role] - ARIA role attribute.
 * @property {HTMLAttributes} [attributes] - HTML attributes (for example data attributes) to add to the fieldset container.
 * @property {string} [html] - HTML to use/render within the fieldset element.
 * @property {Object} [caller] - Not strictly a parameter but Nunjucks code convention. Using a call block enables you to call a macro with all the text inside the tag. This is helpful if you want to pass a lot of content into a macro. To use it, you will need to wrap the entire fieldset component in a call block.
 */

/**
 * @typedef GovukCheckBox
 * @property {string} name - Name attribute for all checkbox items.
 * @property {ItemsArrayObject[]} items - The checkbox items within the checkboxes component. See items.
 * @property {GovukFieldset} [fieldset] - Can be used to add a fieldset to the checkboxes component. See fieldset.
 * @property {GovukHintComponent} [hint] - Can be used to add a hint to the checkboxes component. See hint.
 * @property {string} [describedBy] - One or more element IDs to add to the input aria-describedby attribute without a fieldset, used to provide additional descriptive information for screenreader users.
 * @property {ErrorMessageComponent} [errorMessage] - Can be used to add an error message to the checkboxes component. The error message component will not display if you use a falsy value for errorMessage, for example false or null. See errorMessage.
 * @property {Formgroup} [formGroup] - Additional options for the form group containing the checkboxes component. See formGroup.
 * @property {string} [idPrefix] -This is used to prefix the id attribute for each checkbox item input, hint and error message, separated by -. Defaults to the name option value.
 * @property {string[]} [values] -  Array of values for checkboxes which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 * @property {string} [classes] - Classes to add to the checkboxes container.
 * @property {HTMLAttributes} [attributes] - HTML attributes (for example data attributes) to add to the anchor tag.
 **/

/**
 * @typedef GovukDetailsComponent
 * @property {string} summaryText - Required. If summmaryHtml is set, this is not required. Text to use within the summary element (the visible part of the details element). If summaryHtml is provided, the summaryText option will be ignored.
 * @property {string} [summaryHtml] - Required. If summmaryText is set, this is not required. HTML to use within the summary element (the visible part of the details element). If summaryHtml is provided, the summaryText option will be ignored.
 * @property {string} [text] - Required. If html is set, this is not required. Text to use within the disclosed part of the details element. If html is provided, the text option will be ignored.
 * @property {string} html - Required. If text is set, this is not required. HTML to use within the disclosed part of the details element. If html is provided, the text option will be ignored.
 * @property {string} [caller] - nunjucks-block - Not strictly a parameter but Nunjucks code convention. Using a call block enables you to call a macro with all the text inside the tag. This is helpful if you want to pass a lot of content into a macro. To use it, you will need to wrap the entire details component in a call block.
 * @property {string} [id] - ID to add to the details element.
 * @property {boolean} [open] - If true, details element will be expanded.
 * @property {string} [classes] - Classes to add to the <details> element.
 * @property {HTMLAttributes} [attributes] - HTML attributes (for example data attributes) to add to the <details> element.
 */

/**
 * @typedef GovukCardTitle
 * @property {string} text
 * @property {string} html
 * @property {number} headingLevel
 * @property {string} classes
 */
/**
 * @typedef GovukCardActionsItem
 * @property {string} href
 * @property {string} text
 * @property {string} html
 * @property {string} visuallyHiddenText
 * @property {string} classes
 * @property {HTMLAttributes} attributes
 */
/**
 * @typedef GovukCardActions
 * @property {GovukCardActionsItem[]} items
 * @property {string} classes
 */
/**
 * @typedef GovukCard
 * @property {GovukCardTitle} [title]
 * @property {GovukCardActions} [actions]
 * @property {string} [classes]
 * @property {HTMLAttributes} attributes
 */
/**
 * @typedef GovukSummaryListRowHtmlKey
 * @property {string} html
 * @property {string} [classes]
 * /
 /**
 * @typedef GovukSummaryListRowTextKey
 * @property {string} text
 * @property {string} [classes]
 * /

 /**
 * @typedef {GovukSummaryListRowTextKey|GovukSummaryListRowHtmlKey} GovukSummaryListRowKey
 * /

/**
 * @typedef GovukSummaryListRowHtmlValue
 * @property {string} html
 * @property {string} [classes]
 */

/**
 * @typedef GovukSummaryListRowTextValue
 * @property {string} text
 * @property {string} [classes]
 *
 */
/**
 * @typedef {GovukSummaryListRowHtmlValue|GovukSummaryListRowTextValue} GovukSummaryListRowValue
 *
 */
/**
 * @typedef GovukSummaryListRowActionItem
 * @property {string} [classes]
 * @property {string} href - Required. The value of the link’s href attribute for an action item.
 * @property {string} text - Required. If html is set, this is not required. Text to use within each action item. If html is provided, the text option will be ignored.
 * @property {string} html - Required. If text is set, this is not required. HTML to use within each action item. If html is provided, the text option will be ignored.
 * @property {string} visuallyHiddenText - Actions rely on context from the surrounding content so may require additional accessible text. Text supplied to this option is appended to the end. Use html for more complicated scenarios.
 * @property {string} classes - Classes to add to the action item.
 * @property {HTMLAttributes} attributes - HTML attributes (for example data attributes) to add to the action item.
 *
 */
/**
 * @typedef GovukSummaryListRowAction
 * @property {GovukSummaryListRowActionItem[]} [items]
 * @property {string} [classes]
 */

/**
 * @typedef GovukSummaryListRow
 * @property {string} [classes]
 * @property {GovukSummaryListRowKey} key
 * @property {GovukSummaryListRowValue} value
 * @property {GovukSummaryListRowAction} actions
 */

/**
 * @typedef GovukSummaryList
 * @property {GovukSummaryListRow[]} rows
 * @property {GovukCard} [card]
 * @property {string} classes
 * @property {HTMLAttributes} attributes
 */

/**
 * @typedef GovukRadios
 * @property {string} name - Required. Name attribute for the radio items.
 * @property {ItemsArrayObject[]} items - Required. The radio items within the radios component. See items.
 * @property {GovukFieldset} [fieldset]
 * @property {GovukHintComponent} [hint]
 * @property {ErrorMessageComponent} [errorMessage]
 * @property {FormGroupObject} [formGroup]
 * @property {string} [idPrefix] - Optional prefix. This is used to prefix the id attribute for each radio input, hint and error message, separated by -. Defaults to the name option value.
 * @property {string} [value] - The value for the radio which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 * @property {string} [classes] - Classes to add to the radio container.
 * @property {HTMLAttributes} [attributes] - HTML attributes (for example data attributes) to add to the radio input tag.
 */

/**
 * @typedef GovukButton
 * @property {string} element - HTML element for the button component – input, button or a. In most cases you will not need to set this as it will be configured automatically if href is provided. This parameter will be removed in the next major version.
 * @property {string} text - Required. If html is set, this is not required. Text for the input, button or a element. If html is provided, the text option will be ignored and element will be automatically set to "button" unless href is also set, or it has already been defined.
 * @property {string} html - Required. If text is set, this is not required. HTML for the button or a element only. If html is provided, the text option will be ignored and element will be automatically set to "button" unless href is also set, or it has already been defined. This option has no effect if element is set to "input".
 * @property {string} name - Name for the input or button. This has no effect on a elements.
 * @property {string} type - Type for the input or button element – "button", "submit" or "reset". Defaults to "submit". This has no effect on a elements.
 * @property {string} value - Value for the button element only. This has no effect on a or input elements.
 * @property {boolean} disabled - Whether the button component should be disabled. For input and button elements, disabled and aria-disabled attributes will be set automatically. This has no effect on a elements.
 * @property {string} href - The URL that the button component should link to. If this is set, element will be automatically set to "a" if it has not already been defined.
 * @property {string} classes - Classes to add to the button component.
 * @property {HTMLAttributes} attributes - HTML attributes (for example data attributes) to add to the button component.
 * @property {boolean} preventDoubleClick - Prevent accidental double clicks on submit buttons from submitting forms multiple times.
 * @property {boolean} isStartButton - Use for the main call to action on your service’s start page.
 * @property {string} id- */

/**
 * @typedef PrefixComponent
 * @property {string} [text]
 * @property {string} [html]
 * @property {string} [classes]
 * @property {string} [attributes]
 */

/**
 * @typedef GovukInput
 * @property {string} id
 * @property {string} name
 * @property {LabelComponent} label
 * @property {GovukHintComponent} [hint]
 * @property {ErrorMessageComponent} [errorMessage]
 * @property {string} [value]
 * @property {string} [type] - default "text"
 * @property {string} [inputmode]
 * @property {boolean} [disabled]
 * @property {string} [describedBy] - aria-describedby
 * @property {PrefixComponent} [prefix]
 * @property {PrefixComponent} [suffix]
 * @property {FormGroupObject} [formGroup]
 * @property {string} [classes]
 * @property {string} [autocomplete]
 * @property {string} [pattern] - Regex
 * @property {boolean} [spellcheck]
 * @property {string} [autocapitalize]
 * @property {StandardComponent} [inputWrapper]
 * @property {string} [attributes]
 */
/**
 * @typedef AccessibleAutocompleteItem
 * @property {string} text
 * @property {string} value
 */
/**
 * @typedef AccessibleAutocomplete
 * @property {string} id
 * @property {string} name
 * @property {LabelComponent} label
 * @property {AccessibleAutocompleteItem[]} items
 * @property {GovukHintComponent} [hint]
 * @property {ErrorMessageComponent} [errorMessage]
 * @property {string} [value]
 * @property {string} [type] - default "text"
 * @property {string} [inputmode]
 * @property {boolean} [disabled]
 * @property {string} [describedBy] - aria-describedby
 * @property {PrefixComponent} [prefix]
 * @property {PrefixComponent} [suffix]
 * @property {FormGroupObject} [formGroup]
 * @property {string} [classes]
 * @property {string} [autocomplete]
 * @property {string} [pattern] - Regex
 * @property {boolean} [spellcheck]
 * @property {string} [autocapitalize]
 * @property {StandardComponent} [inputWrapper]
 * @property {string} [attributes]
 */
