// Node modules
const fs = require('fs')
const path = require('path')

// NPM modules (built-in)
const core = require('@actions/core')

// Mapping file to load
const mapFile = path.join(__dirname, 'mappings.json')

// Create our entrypoint
module.exports.run = async () => {
	const partnerInput = core.getInput('partner')
	const environmentInput = core.getInput('environment')

	core.debug(`Partner Input: ${partnerInput}`)
	core.debug(`Environment Input: ${environmentInput}`)

	try {
		// Read in mappings file
		const data = fs.readFileSync(mapFile, 'utf-8')
		const mappings = JSON.parse(data)

		if (partnerInput !== null && environmentInput !== null) {
			core.debug('Generating Matrix')

			const out = mappings.filter(({ partner, environment }) => {
				return (partner == partnerInput) && (environment == environmentInput)
			})

			if (out.length !== 1) {
				throw new Error("only expected single output")
			}

			const { partner, account, environment, role } = out[0]

			core.setOutput('partner', partner)
			core.setOutput('environment', environment)
			core.setOutput('account', account)
			core.setOutput('role', role)
		} else {
			core.debug('Generating Partner Config')

			const out = mappings.map(({ partner, environment }) => {
				return {
					partner,
					environment,
				}
			})

			core.setOutput('matrix', JSON.stringify(out))
		}
	} catch (error) {
		core.setFailed(error.message)
	}
}