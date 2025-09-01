import { sanitizeInput } from '../security/sanitize'


export const sanitizeFields = (fields) => {
    return (req, res, next) => {
        fields.forEach(field => {
            if (req.body[field]) {
                req.body[field] = sanitizeInput(req.body[field]);
            }
        });
        next();
    };
}