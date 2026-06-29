import { HttpError } from "wasp/server";
export function ensureArgsSchemaOrThrowHttpError(schema, rawArgs) {
    const parseResult = schema.safeParse(rawArgs);
    if (!parseResult.success) {
        console.warn("Validation failed:", parseResult.error.issues.map(i => i.path.join('.')).join(', '));
        throw new HttpError(400, "Operation arguments validation failed", {
            errors: parseResult.error.errors,
        });
    }
    else {
        return parseResult.data;
    }
}
