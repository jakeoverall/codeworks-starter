import { describe, it } from 'mocha'
import { expect, assert } from 'chai'
import { TestClass } from '../lib/TestClass';

describe('TestClass', () => {
  it("TestMethod is static", () => {
    assert.isFunction(TestClass.TestMethod)
  })
  it("TestMethod returns a string", () => {
    assert.isString(TestClass.TestMethod(7))
  })
})