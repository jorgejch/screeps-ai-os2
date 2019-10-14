'use strict'

const OSKernel = require("os_kernel")
const generalUtils = require("./utils/general")

/* Enable OS Logger */
const OSLogger = require('os_logger')
global.Logger = new OSLogger()

/* extends */
require('extends_room_structures')

module.exports.loop = function()  {
    Logger.log('\\ Tick begin:',Game.time, ' //')

    if (Game.cpu.bucket < 500) {
        throw "CPU Bucket too low. Halting."
    }
    global.Kernel = new OSKernel()
    Kernel.init()

    // add event manager process if non-existent
    Kernel.run()
    Logger.log('// Tick end:',Game.time, ' \\')
}
