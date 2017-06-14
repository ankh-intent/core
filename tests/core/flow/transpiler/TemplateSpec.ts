
import { AbstractTemplate } from '../../../../src/core/flow/transpiler/templates/AbstractTemplate';

class MockTemplate<T> extends AbstractTemplate<T> {
  public code: string;

  public resolve(data: T, property: string) {
    return data[property];
  }

}

describe('Template', () => {

  describe('constructor()', () => {

  });

  describe('code()', () => {

  });

  describe('compile()', () => {

    it('should compile empty template to no-op', () => {
      let template = new MockTemplate(null, null);

    })

    it('plaintext should be left as is', () => {
      let template = new MockTemplate(null, null);
      template.code = "";
      template.com
    })

  });

  describe('apply()', () => {

  });

});
