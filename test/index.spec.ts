import { Program, AuthMiddleware } from '../lib/index'
import { assert, expect } from 'chai'
import { describe, it } from 'mocha'
import request from 'supertest'

let p = new Program({
	name: "TEST",
	controllersPath: __dirname + '/../_sample/Controllers',
	routerMount: "",
	logRequests: true,
	middleware: [(req, _, next) => {
		req['user'] = { account: "admin" }
		next()
	}]
})
p.configure.AuthService({
	Roles: ["public", "student", "teacher", "admin", "super"],
	UserRolePath: "account.role"
})
p.router.use(AuthMiddleware)

describe("PROGRAM", () => {
	it("Can Access from Index", () => {
		assert.isFunction(Program)
	})
	it("Register and Call controller methods with api call", (done) => {

		request(p.expressApp)
			.get("/kittens")
			.expect("Content-Type", /json/)
			.expect(200)
			.end(done)
	})
})
