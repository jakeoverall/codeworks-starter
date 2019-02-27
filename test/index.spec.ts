import { Program, AuthMiddleware } from '../lib/index'
import { assert } from 'chai'
import { describe, it } from 'mocha'
import request from 'supertest'

describe("PROGRAM", () => {
	it("Can Access from Index", () => {
		assert.isFunction(Program)
	})
	it("Register and Call controller methods with api call", () => {
		let p = new Program({
			controllersPath: __dirname + '/TestControllers',
			routerMount: "/api/v1/"
		})
		p.configure.AuthService({
			Roles: ["public", "student", "teacher", "admin", "super"],
			UserRolePath: "account.role"
		})
		p.router.use(AuthMiddleware)

		request(p.expressApp)
			.get("/api/v1/kittens")
			.timeout(1500)
			.expect("Content-Type", /json/)
			.expect(200)
			.end((err, res) => {
				if (err) throw err
				console.log(res.body);
			})
	})
})
