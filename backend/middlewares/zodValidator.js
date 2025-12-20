export const validate = (schema, source = "body") => {
    return (req, res, next) => {
        try {
            const data = source === "body" ? req.body : req.query;
            schema.parse(data);
            next();
        } catch (error) {

            const formattedErrors = error.issues.map(issue => ({
                "fields": issue.path.join("."),
                "message": issue.message,
            }));

            return res.status(400).json({
                success: false,
                errors: formattedErrors,
            });
        }
    };
};
