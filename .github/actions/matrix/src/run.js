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
	const partnerInput = core.getInput('partner')
	const environmentInput = core.getInput('environment')
	const context = github.context

	core.debug(`Partner Input: ${partnerInput}`)
	core.debug(`Environment Input: ${environmentInput}`)
	core.info(`Context: ${JSON.stringify(context)}`)

	try {
		// Read in mappings file
		const data = fs.readFileSync(mapFile, 'utf-8')
		const mappings = JSON.parse(data)

		if (partnerInput != '' && environmentInput != '') {
			generateConfig(mappings, partnerInput, environmentInput)
		} else {
			generatePlanMatrix(mappings)
		}
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
