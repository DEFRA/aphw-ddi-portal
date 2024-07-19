/**
 * @typedef FormgroupBeforeInputs
 * @properties {string} [text] - Text to add before all checkbox items. If html is provided, the text option will be ignored.
 * @properties {string} [html] - HTML to add before all checkbox items. If html is provided, the text option will be ignored.
 **/
/**
 * @typedef FormgroupAfterInputs
 * @properties {string} [text] - Text to add after all checkbox items. If html is provided, the text option will be ignored.
 * @properties {string} [html] - HTML to add after all checkbox items. If html is provided, the text option will be ignored.
 **/

/**
 * @typedef FormGroupObject
 * @property {string} classes - Classes to add to the form group (for example to show error state for the whole group).
 * @property {HTMLAttributes} attributes - HTML attributes (for example data attributes) to add to the form group.
 * @property {FormgroupBeforeInputs} beforeInputs - Content to add before all checkbox items within the checkboxes component. See formGroup beforeInputs.
 * @property {FormgroupAfterInputs} afterInputs - Content to add after all checkbox items within the checkboxes component. See formGroup afterInputs.
 */

/**
 * @typedef HintComponent
 * @properties {string} [text] - Required. If html is set, this is not required. Text to use within the hint. If html is provided, the text option will be ignored.
 * @properties {string} [html] - Required. If text is set, this is not required. HTML to use within the hint. If html is provided, the text option will be ignored.
 * @properties {string} [id] - Optional ID attribute to add to the hint span tag.
 * @properties {string} [classes] - Classes to add to the hint span tag.
 * @properties {HTMLAttributes} [attributes] - HTML attributes (for example data attributes) to add to the hint span tag.
 */

/**
 * @typedef LabelComponent
 * @properties {string} classes - Classes to add to the label tag.
 * @properties {HTMLAttributes} attributes - HTML attributes (for example data attributes) to add to the label tag.
 **/

/**
 * @typedef Conditional
 * @properties {string} html - The HTML to reveal when the checkbox is checked.
 **/

/**
 * @typedef ItemsArrayObject
 * @property {string} [text] - If html is set, this is not required. Text to use within each checkbox item label. If html is provided, the text option will be ignored.
 * @property {string} [html] - If text is set, this is not required. HTML to use within each checkbox item label. If html is provided, the text option will be ignored.
 * @property {string} value - Value for the checkbox input.
 * @property {string} [id] - Specific ID attribute for the checkbox item. If omitted, then component global idPrefix option will be applied.
 * @property {string} [name] - Specific name for the checkbox item. If omitted, then component global name string will be applied.
 * @property {LabelComponent} [label] - Subset of options for the label used by each checkbox item within the checkboxes component. See items label.
 * @property {HintComponent} [hint] - Can be used to add a hint to each checkbox item within the checkboxes component. See hint.
 * @property {string} [divider] - Divider text to separate checkbox items, for example the text "or".
 * @property {boolean} [checked] - Whether the checkbox should be checked when the page loads. Takes precedence over the top-level values option.
 * @property {Conditional} [conditional] - Provide additional content to reveal when the checkbox is checked. See items conditional.
 * @property {string} [behaviour] - If set to "exclusive", implements a ‘None of these’ type behaviour via JavaScript when checkboxes are clicked.
 * @property {boolean} [disabled] - If true, checkbox will be disabled.
 * @property {HTMLAttributes} [attributes] - HTML attributes (for example data attributes) to add to the checkbox input tag.
 */

/**
 * @typedef {string} Formgroup
 * @properties {string} classes - Classes to add to the form group (for example to show error state for the whole group).
 * @properties {HTMLAttributes} attributes - HTML attributes (for example data attributes) to add to the form group.
 * @properties {FormgroupBeforeInputs} [beforeInputs] - Content to add before all checkbox items within the checkboxes component. See formGroup beforeInputs.
 * @properties {FormgroupAfterInputs} [afterInputs] - Content to add after all checkbox items within the checkboxes component. See formGroup afterInputs.
 **/

/**
 * @typedef FieldsetLegend
 * @property {string} [text] - If html is set, this is not required. Text to use within the legend. If html is provided, the text option will be ignored.
 * @property {string} [html] - If text is set, this is not required. HTML to use within the legend. If html is provided, the text option will be ignored.
 * @property {string} [classes] - Classes to add to the legend.
 * @property {boolean} [isPageHeading] - Whether the legend also acts as the heading for the page.
 */

/**
 * @typedef Fieldset
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
 * @property {Fieldset} [fieldset] - Can be used to add a fieldset to the checkboxes component. See fieldset.
 * @property {HintComponent} [hint] - Can be used to add a hint to the checkboxes component. See hint.
 * @property {string} [describedBy] - One or more element IDs to add to the input aria-describedby attribute without a fieldset, used to provide additional descriptive information for screenreader users.
 * @property {string} [errorMessage] - Can be used to add an error message to the checkboxes component. The error message component will not display if you use a falsy value for errorMessage, for example false or null. See errorMessage.
 * @property {Formgroup} [formGroup] - Additional options for the form group containing the checkboxes component. See formGroup.
 * @property {string} [idPrefix] -This is used to prefix the id attribute for each checkbox item input, hint and error message, separated by -. Defaults to the name option value.
 * @property {string[]} [values] -  Array of values for checkboxes which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 * @property {string} [classes] - Classes to add to the checkboxes container.
 * @property {HTMLAttributes} [attributes] - HTML attributes (for example data attributes) to add to the anchor tag.
 **/
