import { Area } from '../lib/index'
import { assert } from 'chai'
import { describe, it } from 'mocha'
import testArea from '../_sample/server'
import session from 'supertest-session'
import KittensController from '../_sample/Controllers/KittensController'

describe("Area", () => {
	it("Can Access from Index", () => {
		assert.isFunction(Area)
	})
	it("Minimum setup", () => {
		let x = new Area({
			name: "Minimum",
		})
		assert.isTrue(x.channels.length == 0)
	})

	it("Can add controllers manually", (done) => {
		let x = new Area({
			name: "Adding Controllers",
		})
		x.AddControllers({ KittensController })
		session(x.expressApp)
			.request("get", "/kittens")
			.timeout(2000)
			.expect("Content-Type", /json/)
			.expect(200)
			.end(done)
	})

	it("Register and Call controller methods with api call", (done) => {
		session(testArea.expressApp)
			.request("get", "/kittens")
			.timeout(2000)
			.expect("Content-Type", /json/)
			.expect(200)
			.end(done)
	})
})
