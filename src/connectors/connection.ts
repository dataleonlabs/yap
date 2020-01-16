export default interface IConnection {
    /**
     * Id of connection
     */
    id?: string;

    /**
     * Connection name
     */
    name?: string;

    /**
     * Connection description
     */
    description?: string;

    /**
     * Connection fields
     */
    fields: {
        /**
         * Field connection name
         */
        name?: string,

        /**
         * Field connection label
         */
        label: string,

        /**
         * Field placeholder
         */
        placeholder?: string,

        /**
         * Field type
         */
        type?: string,

        /**
         * Field help string
         */
        help?: string,

        /**
         * Default values for connection component
         */
        defaultComponent: {
            /**
             * Options for default component
             */
            options: Array<{ [key: string]: boolean }>;
        };
    };
}