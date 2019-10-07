const { execSync } = require('child_process');
const { Nuxt, Builder } = require('nuxt');
const config = require('../nuxt.config');
config.dev = process.env.NODE_ENV !== 'production';

module.exports = async (context) => {
    if (process.env.NODE_ENV === 'production') {
        execSync('npm run build');
    }

    const nuxt = new Nuxt(config)
    if (config.dev) {
        const builder = new Builder(nuxt)
        await builder.build()
    } else {
        await nuxt.ready()
    }
    
    context.use(nuxt.render);
    console.log('nuxt build finished');
};