// Node modules
const fs = require('fs')
const path = require('path')

// NPM modules (built-in)
const core = require('@actions/core')
const github = require('@actions/github')

// Mapping file to load
const mapFile = path.join(__dirname, 'mappings.json')

// Create our entrypoint
module.exports.run = async () => {
	const partner = core.getInput('partner')
	const environment = core.getInput('environment')
	const context = github.context

	core.debug(`Partner Input: ${partner}`)
	core.debug(`Environment Input: ${environment}`)

	try {
		// Read in mappings file
		const data = fs.readFileSync(mapFile, 'utf-8')
		const mappings = JSON.parse(data)

		// If pull request is closed, generate matrix from deployment labels
		if (context.payload.action == 'closed' && context.payload.pull_request) {
			core.debug('Found Pull Request Context')

			const labels = context.payload.pull_request.labels.map((obj) => {
				return obj.name
			})

			return generateDeployMatrix(mappings, labels)
		}

		// If partner and environment is configured, lookup config
		if (partner !== '' && environment !== '') {
			core.debug('Partner configuration specified')

			return generateConfig(mappings, partner, environment)
		}

		core.debug('No input configuration found')

		// If no inputs specified, generate matrix for all partners and environments
		generatePlanMatrix(mappings)
	} catch (error) {
		core.setFailed(error.message)
	}
}

const generateConfig = (mappings, partnerInput, environmentInput) => {
	core.debug('Generating Partner Config')

	const out = mappings.filter(({ partner, environment }) => {
		return (partner == partnerInput) && (environment == environmentInput)
	})

	if (out.length !== 1) {
		throw new Error("only expected single output")
	}

	const { partner, region, environment, role } = out[0]

	core.setOutput('partner', partner)
	core.setOutput('environment', environment)
	core.setOutput('region', region)
	core.setOutput('role', role)
}

const generatePlanMatrix = (mappings) => {
	core.debug('Generating Plan Matrix')

	const out = mappings.map(({ partner, environment }) => {
		return {
			partner,
			environment,
		}
	})

	core.setOutput('matrix', JSON.stringify(out))
}

const generateDeployMatrix = (mappings, labels) => {
	core.debug('Generating Deploy Matrix')

	const deployLabels = labels.filter((label) => {
		return label.startsWith('deploy/')
	}).map((label) => {
		const [ , partner, environment ] = label.split('/')

		return {
			partner,
			environment,
		}
	}).filter(({ partner, environment }) => {
		if (partner == undefined) {
			return false
		}

		if (environment == undefined) {
			return false
		}

		const matches = mappings.filter((mapping) => {
			return (mapping.partner == partner) && (mapping.environment == environment)
		})

		return matches.length > 0
	})

	core.setOutput('matrix', JSON.stringify(deployLabels))
}
