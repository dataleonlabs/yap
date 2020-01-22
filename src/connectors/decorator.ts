import ConnectorCategory from "./ConnectorCategory";

import { UI } from "./ui";

/**
 * YapConnector decorator
 * Decorates id, name, category, and ui params of connector
 * @param connectorMetadata argu
 */
export default function YapConnector(connectorMetadata: {

    /**
     * String identificator for connector.
     */
    id: string,

    /**
     * Name of a connector
     */
    name: string,

    /**
     * Category of a connector
     */
    category: ConnectorCategory,

    /**
     * Descritpion of a connector
     */
    description: string,

    /**
     * Connector UI
     */
    ui?: UI,

}) {
    const { id, name, category, description, ui } = connectorMetadata;

    return <T extends new (...args: any[]) => {}>(constructor: T) => {
        // tslint:disable-next-line: max-classes-per-file
        return class extends constructor {

            /**
             * String identificator for connector.
             */
            public id: string = id;

            /**
             * Name of a connector
             */
            public name: string = name;

            /**
             * Category of a connector
             */
            public category: ConnectorCategory = category;

            /**
             * Descritpion of a connector
             */
            public description: string = description;

            /**
             * Connector UI
             */
            public ui?: UI = ui;
        };
    };
}