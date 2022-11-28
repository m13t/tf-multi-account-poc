// Node modules
const fs = require('fs')

// NPM modules (built-in)
const core = require('@actions/core')

// Mock fs module
jest.mock('fs', () => ({
	promises: {
		access: jest.fn()
	}
}))

// Mock GitHub modules
jest.mock('@actions/core')

// Import run function
const { run } = require('./run.js')

describe('run', () => {
	it('retrieves config for specific partner and environment', async () => {
		// Mock input data
		let mockInput = {
			'partner': 'vaquita',
			'environment': 'qa'
		}

		// Mock mapping data
		let mockMapping = [{
			"partner": "vaquita",
			"environment": "qa",
			"account": "nonprod",
			"role": "arn:aws:iam::329171477349:role/DemoAdmin"
		}, {
			"partner": "vaquita",
			"environment": "live",
			"account": "prod",
			"role": "arn:aws:iam::067224917197:role/DemoAdmin"
		}]

		// Mock the inputs
		core.getInput = jest.fn((name) => mockInput[name])

		// Mock the outputs
		core.setOutput = jest.fn()

		// Mock file
		fs.readFileSync = jest.fn(() => JSON.stringify(mockMapping))

		// Run the action
		await run()

		// Ensure inputs were checked
		expect(core.getInput).toHaveBeenCalledTimes(2)

		// Ensure outputs were set
		expect(core.setOutput).toHaveBeenCalledTimes(4)
		expect(core.setOutput).toHaveBeenNthCalledWith(1, 'partner', 'vaquita')
		expect(core.setOutput).toHaveBeenNthCalledWith(2, 'environment', 'qa')
		expect(core.setOutput).toHaveBeenNthCalledWith(3, 'account', 'nonprod')
		expect(core.setOutput).toHaveBeenNthCalledWith(4, 'role', 'arn:aws:iam::329171477349:role/DemoAdmin')
	})

	it('retrieves matrix for all partners and environments', async () => {
		let mockMapping = [{
			"partner": "vaquita",
			"environment": "qa",
			"account": "nonprod",
			"role": "arn:aws:iam::329171477349:role/DemoAdmin"
		}, {
			"partner": "vaquita",
			"environment": "live",
			"account": "prod",
			"role": "arn:aws:iam::067224917197:role/DemoAdmin"
		}]

		let mockOutput = [{
			"partner": "vaquita",
			"environment": "qa",
		}, {
			"partner": "vaquita",
			"environment": "live",
		}]

		// Mock the inputs
		core.getInput = jest.fn(() => '')

		// Mock the outputs
		core.setOutput = jest.fn()

		// Mock file
		fs.readFileSync = jest.fn(() => JSON.stringify(mockMapping))

		// Run the action
		await run()

		// Ensure outputs were set
		expect(core.setOutput).toHaveBeenCalledTimes(1)
		expect(core.setOutput).toHaveBeenNthCalledWith(1, 'matrix', JSON.stringify(mockOutput))
	})
})
