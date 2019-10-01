import Vue from 'vue';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

const requireComponent = require.context(
    '../components',
    // Do not look in subdirectories
    false,
    /\.vue$/
);

requireComponent.keys().forEach((fileName) => {
    // Get the component config
    const componentConfig = requireComponent(fileName);
    // Get the PascalCase version of the component name
    const componentName = upperFirst(
        camelCase(
        fileName
            // Remove the file extension from the end
            .replace(/\.\w+$/, '')
        )
    );
    // Globally register the component
    Vue.component(componentName, componentConfig.default || componentConfig);
});