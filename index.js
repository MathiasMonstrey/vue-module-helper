const fs = require('fs');
const { camelCase, startCase } = require('lodash');
const args = require('minimist')(process.argv.slice(2));

if (args._[0]) {
    const componentName = args._[0];
    let path = 'src/app/';
    let createRoutes = true;
    if (args.path) {
        path = args.path;
        path.replace(/^(\/\.)/,"");
    }
    if (args.routes) {
        createRoutes = args.routes.toLowerCase() === 'true';
    }

    console.log({ path })

    const vueContent = `
<template src="./${componentName}.html">
</template>

<script lang="ts" src="./${componentName}.ts">
</script>
    `;

    const tsContent = `
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ${startCase(camelCase(componentName)).replace(/ /g, '')} extends Vue {

}
`

    const tsRoute = `
import { RouteConfig } from 'vue-router';

export default [{
    path: '/${componentName}',
    name: '${componentName}',
    component: () => import('./${componentName}'),
}] as RouteConfig[];

`

    const htmlContent = `
<div>
    ${componentName} created!
</div>`

    const testContent = `
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';

describe('${startCase(camelCase(componentName)).replace(/ /g, '')}', () => {
    // Don't forget to write some tests!
});
`
    fs.mkdirSync(`${path}${componentName}`, { recursive: true });
    fs.writeFile(`${path}${componentName}/${componentName}.ts`, tsContent, () => { })
    if (createRoutes) {
        fs.writeFile(`${path}${componentName}/${componentName}-routes.ts`, tsRoute, () => { })
    }
    fs.writeFile(`${path}${componentName}/${componentName}.vue`, vueContent, () => { })
    fs.writeFile(`${path}${componentName}/${componentName}.html`, htmlContent, () => { })
    fs.mkdirSync(`${path}${componentName}/__tests__`);
    fs.writeFile(`${path}${componentName}/__tests__/index.ts`, testContent, () => { })
}