import { SchemaDirectiveVisitor } from "apollo-server-lambda";
import { readFileSync } from "fs";
import { defaultFieldResolver } from "graphql";
import { resolve } from "path";

const definition = readFileSync(resolve(__dirname, './trim.graphql')).toString();

/**
 * GraphQL Directive to trim a string
 */
class TrimDirective extends SchemaDirectiveVisitor {

    /**
     * visitFieldDefinition method
     * @param field field
     */
    public visitFieldDefinition(field:any) {
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function(...args:any[]) {
        const result = await resolve.apply(this, args);
        if (typeof result === 'string') {
          return result.trim();
        }
        return result;
      };
    }
  }

export default { definition, directive:TrimDirective };