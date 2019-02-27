import { Program, AuthMiddleware } from '../lib/index'
import { assert, expect } from 'chai'
import { describe, it } from 'mocha'
import request from 'supertest'
import BaseController from "../lib/BaseController";

describe("PROGRAM", () => {
	it("Can Access from Index", () => {
		assert.isFunction(Program)
	})
	it("Register and Call controller methods with api call", () => {
		let p = new Program({
			name: "TEST",
			controllersPath: __dirname + '/../_sample/Controllers',
			routerMount: "/",
			logRequests: true
		})
		p.configure.AuthService({
			Roles: ["public", "student", "teacher", "admin", "super"],
			UserRolePath: "account.role"
		})
		p.router.use(AuthMiddleware)

		request(p.expressApp)
			.get("/kittens")
			.timeout(1500)
			.expect("Content-Type", /json/)
			.expect(200)
			.end((err, res) => {
				if (err) throw err
			})
	})

	it("controllers fail if no endpoint is specified", () => {
		assert.throws(() => { new BaseController() }, "Failed to create controller you must provide an endpoint")
	})

})
