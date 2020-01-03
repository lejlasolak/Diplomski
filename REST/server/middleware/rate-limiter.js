const {RateLimiterMemory} = require('rate-limiter-flexible');
const rateLimiter = new RateLimiterMemory(
    {
        points: 10,
        duration: 1,
    });

module.exports = {
    rateLimiterMiddleware: (req, res, next) => {
        rateLimiter.consume(req.ip)
            .then(() => {
                next();
            })
            .catch((rejRes) => {
                const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
                res.set('Retry-After', String(secs));
                res.status(429).send('Too Many Requests');
            });
    }
};