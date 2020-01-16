import { Context } from "..";
import IConnection from "./connection";
import { UI } from "./ui";

/**
 * Connector class
 */
export default class Connector {
    /**
     * String identificator for connector.
     */
    public id?: string;

    /**
     * Name of a connector
     */
    public name?: string;

    /**
     * Category of a connector
     */
    public category?: ConnectorCategory;

    /**
     * Descritpion of a connector
     */
    public description?: string;

    /**
     * Connection
     */
    public connection?: IConnection;

    /**
     * Test function
     */
    public test() {
        throw new Error("Method validate is not implemented");
    }

    /**
     * Execute function
     */
    public execute(parent: any, args: any, context: Context, info: any) {
        throw new Error("Method validate is not implemented");
    }

    /**
     * Connector UI
     */
    public ui?: UI;
}

/**
 * Connector category enum
 */
export enum ConnectorCategory {
    'undefined' = 'undefined',
    'dataprocessing' = 'data-processing',
}