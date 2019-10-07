const { exec } = require('child_process');
const { Nuxt, Builder } = require('nuxt');
const config = require('../nuxt.config');
config.dev = process.env.NODE_ENV !== 'production';

module.exports = async (context) => {
    console.log('start build nuxt');
    const initNuxt = async () => {
        const nuxt = new Nuxt(config)
        if (config.dev) {
            const builder = new Builder(nuxt)
            await builder.build()
        } else {
            await nuxt.ready()
        }
        context.use(nuxt.render);
        console.log('finish build nuxt');
    };

    if (process.env.NODE_ENV === 'production') {
        exec('npm run build', async (error, stdout, stderr) => {
            console.log(error, stdout, stderr);
            await initNuxt();
        });
    } else {
        await initNuxt();
    }
};