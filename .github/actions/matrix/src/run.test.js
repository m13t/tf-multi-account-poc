// Node modules
const fs = require('fs')

// NPM modules (built-in)
const core = require('@actions/core')
const github = require('@actions/github')

// Mock fs module
jest.mock('fs', () => ({
	promises: {
		access: jest.fn()
	}
}))

// Mock GitHub modules
jest.mock('@actions/core')
jest.mock('@actions/github')

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
			"region": "eu-west-2",
			"role": "arn:aws:iam::329171477349:role/DemoAdmin"
		}, {
			"partner": "vaquita",
			"environment": "live",
			"region": "eu-west-2",
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
		expect(core.setOutput).toHaveBeenNthCalledWith(3, 'region', 'eu-west-2')
		expect(core.setOutput).toHaveBeenNthCalledWith(4, 'role', 'arn:aws:iam::329171477349:role/DemoAdmin')
	})

	it('retrieves matrix for all partners and environments', async () => {
		let mockMapping = [{
			"partner": "vaquita",
			"environment": "qa",
			"region": "eu-west-2",
			"role": "arn:aws:iam::329171477349:role/DemoAdmin"
		}, {
			"partner": "vaquita",
			"environment": "live",
			"region": "eu-west-2",
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

	it('retrieves deployment matrix based on deployment labels', async () => {
		let mockMapping = [{
			"partner": "vaquita",
			"environment": "qa",
			"region": "eu-west-2",
			"role": "arn:aws:iam::329171477349:role/DemoAdmin"
		}, {
			"partner": "vaquita",
			"environment": "live",
			"region": "eu-west-2",
			"role": "arn:aws:iam::067224917197:role/DemoAdmin"
		}]

		let mockContext = {
			payload: {
				action: 'closed',
				pull_request: {
					labels: [{
						name: 'feature'
					}, {
						name: 'deploy/vaquita/qa'
					}, {
						name: 'deploy/vaquita/live'
					}, {
						name: 'deploy/vaquita'
					}]
				}
			}
		}

		let mockOutput = [{
			"partner": "vaquita",
			"environment": "qa",
		}, {
			"partner": "vaquita",
			"environment": "live",
		}]

		// Mock the inputs
		core.getInput = jest.fn(() => '')
		github.context = mockContext

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
