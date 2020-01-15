/**
 * Field parameter interface
 */
export default interface IFieldParameter {
    /**
     * Field name
     */
    name: string;

    /**
     * Field type
     */
    type?:
    | 'text'
    | 'email'
    | 'number'
    | 'break'
    | 'textarea'
    | 'password'
    | 'select'
    | 'async-creatable-single-select'
    | 'separator'
    | 'code'
    | 'richText'
    | 'color'
    | 'file'
    | 'switch'
    | 'checkbox';

    /**
     * Field label
     */
    label?: string;

    /**
     * Field help string
     */
    help?: string;

    /**
     * Whether field have snippet
     */
    snippet?: boolean;

    /**
     * Whether field have box
     */
    box?: boolean;

    /**
     * Whether filed creatable
     */
    creatable?: boolean;

    /**
     * Whether field is inline
     */
    inline?: boolean;

    /**
     * Whether label should be hided
     */
    hideLabel?: boolean;

    /**
     * Field validators
     */
    validators?: Array<{
        /**
         * Validator function
         */
        fn: (value: any, values?: any[]) => boolean

        /**
         * Validator message
         */
        msg?: string,
    }>;

    /**
     * Field placeholder
     */
    placeholder?: string;

    /**
     * Field mode
     */
    mode?: any;

    /**
     * Field class name
     */
    className?: string;

    /**
     * Feild class name
     */
    classNames?: {
        /**
         * Contaner
         */
        container?: string

        /**
         * Label
         */
        label?: string

        /**
         * Input
         */
        input?: string

        /**
         * Error
         */
        error?: string,
    };

    /**
     * Class dropdown
     */
    classDropdown?: string;

    /**
     * Whether field is readonly
     */
    readOnly?: boolean;

    /**
     * Field minimum rows
     */
    minRows?: number;

    /**
     * Field rows
     */
    rows?: number;

    /**
     * Field options
     */
    options?: Array<{
        /**
         * Option value
         */
        value: any

        /**
         * Option label
         */
        label: string,
    }>;

    /**
     * Field code
     */
    code?: any;

    /**
     * Whether form should be submited after change
     */
    submitAfterChange?: boolean;

    /**
     * Whether password should have strenght
     */
    strenghPasswordControl?: boolean;

    /**
     * Field tab
     */
    tab?: string;

    /**
     * Field width
     */
    width?: number;

    /**
     * New row
     */
    newRow?: boolean;

    /**
     * Whether field should be hidden
     */
    hide?: boolean;

    /**
     * Whether its a multi row field
     */
    isMulti?: boolean;

    /**
     * Whether field is disabled
     */
    isDisabled?: boolean;

    /**
     * Is the select value clearable
     */
    isClearable?: boolean;
}