const {RateLimiterMemory} = require('rate-limiter-flexible');
const rateLimiter = new RateLimiterMemory(
    {
        points: 3,
        duration: 15 * 60,
    });

module.exports = {
    loginMiddleware: (req, res, next) => {
        rateLimiter.get(req.ip).then((rateLimiterRes) => {
            if (rateLimiterRes && rateLimiterRes.consumedPoints >= 3) {
                const secs = Math.round(rateLimiterRes.msBeforeNext / 1000) || 1;
                return res.set('Retry-After', String(secs)).status(429).json({error: 'Neuspješan pokušaj logovanja 3 puta. Pokušajte ponovo nakon ' + secs + " sekundi"});
            } else {
                res.locals.rateLimiter = rateLimiter;
                next();
            }
        });
    }
};