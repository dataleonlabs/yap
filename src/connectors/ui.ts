import IFieldParameter from "./fieldParameter";

/**
 * UI class
 */
// tslint:disable-next-line: max-classes-per-file
export interface UI {
    /**
     * Fields of UI component
     */
    fields?: {
        /**
         * Field connection id
         */
        connectionId: [string]

        /**
         * Field name
         */
        name: string

        /**
         * Field variable
         */
        variable: string

        /**
         * Whether field should be skipped
         */
        skip: boolean

        /**
         * Whether error should be cathced
         */
        catchError: boolean

        /**
         * Field parameters
         */
        parameters: [IFieldParameter],
    };
}
