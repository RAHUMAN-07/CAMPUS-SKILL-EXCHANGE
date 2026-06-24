/**
 * Request validation middleware factory
 * Validates request body, query, or params against a Zod schema
 */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
    const result = schema.safeParse(data);

    if (!result.success) {
      const errors = result.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }

    // Replace with parsed/coerced data
    if (source === 'body') req.body = result.data;
    else if (source === 'query') req.query = result.data;
    else req.params = result.data;

    next();
  };
}

export default validate;
