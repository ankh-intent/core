import { AbstractNode } from '@intent/kernel';

import { GenericTemplateNode } from './GenericTemplateNode';

export class GenericTemplatesNode extends AbstractNode {
    public constructor(
        public templates: GenericTemplateNode[] = [],
    ) {
        super();
    }

    isEmpty() {
        return !this.templates.length;
    }

    get children() {
        return this.templates;
    }

    inspect(): any {
        return this.templates;
    }
}
