import { Program } from '../lib/index'
import { assert } from 'chai'
import { describe, it } from 'mocha'
import request from 'supertest'
import p from '../_sample/server'
import session from 'supertest-session'




describe("PROGRAM", () => {
	it("Can Access from Index", () => {
		assert.isFunction(Program)
	})
	it("Register and Call controller methods with api call", (done) => {

		session(p.expressApp)
			.request()
			.get("/kittens")
			.timeout(2000)
			.expect("Content-Type", /json/)
			.expect(200)
			.end(done)
	})
})
