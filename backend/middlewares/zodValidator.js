import { ZodError } from "zod";

// middlewares/zodValidator.js
export const validate = (schema, source = "body") => {
    return (req, res, next) => {
        try {
            const data = source === "body" ? req.body : req.query;
            // Validate and get transformed data
            const parsedData = schema.parse(data);

            // Replace original data with validated/transformed data
            // Due to which, controller gets the transformed validated data
            // Otherwise data will be parsed and validated but controller would get the dirty and untransformed data
            if (source === "body") {
                req.body = parsedData;
            } else {
                req.query = parsedData;
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) { // Zod error helps to remove manual validation checks from the controllers
                const formattedErrors = error.issues.map(issue => ({
                    "fields": issue.path.join("."),
                    "message": issue.message,
                }));

                return res.status(400).json({
                    success: false,
                    errors: formattedErrors,
                });
            }
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            })
        }
    };
};
