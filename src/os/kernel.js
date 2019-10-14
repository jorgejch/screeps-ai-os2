'use strict'

const OSScheduler = require("os_scheduler")

class OSKernel {
    _loadProcessTableFromMemory() {
        this.rawProcessTable.forEach(rawProcess => {
            let processClass
            try {
                processClass = require(`processes_${rawProcess[2]}`)
                const pid = rawProcess[0]
                const parentPid = rawProcess[1]
                const label = rawProcess[3]
                const priority = rawProcess[4]
                this.processTable[pid] = new processClass(pid, parentPid, label, priority)
            } catch (e) {
                console.log(`Failed to load process ${JSON.stringify(rawProcess)} due to ${e.stack}.`)
            }
        })
    }

    _saveProcessTableToMemory() {
        this.rawProcessTable.length = 0  // reset
        Object.keys(this.processTable).forEach(pid => {
                const process = this.processTable[pid]

                const name = process.name
                const parentPid = process.parentPid
                const label = process.label
                const priority = process.priority
                this.rawProcessTable.push([pid, parentPid, name, label, priority, state])
            }
        )
    }

    getProcessByLabel(label) {
        return _.find(Object.values(this.processTable), proc => proc.label === label)
    }

    init() {
        this.scheduler = new OSScheduler()

        // raw processes table is written at the end of the kernel run and read at the beginning
        if (!Memory.rawProcessTable) {
            Memory.rawProcessTable = []
        }
        this.rawProcessTable = Memory.rawProcessTable

        // where the raw process table is read into
        this.processTable = {}

        this._loadProcessTableFromMemory()

        // able to add jobs after setting process table on scheduler
        this.scheduler.setProcessTable(this.processTable)

        // TODO: uncomment after EmpireRuler process is added.
        // // the empire_ruler process should be the first process to run
        // if (Object.keys(this.processTable).length === 0) {
        //     const EMPIRE_MANAGER_PROCESS_LABEL = "empire_ruler"
        //     if (!this.getProcessByLabel(EMPIRE_MANAGER_PROCESS_LABEL)) {
        //         console.log(`Creating process ${EMPIRE_MANAGER_PROCESS_LABEL}`)
        //         this.scheduler.launchProcess(
        //             this.availableProcessClasses.EmpireRuler,
        //             EMPIRE_MANAGER_PROCESS_LABEL,
        //             null,
        //             1
        //         )
        //     }
        // }
    }

    run() {
        // order processes to run
        this.scheduler.init()

        let proc
        while (proc = this.scheduler.nextProcessToRun()) {
            try {
                proc.run()
            } catch (ex) {
                console.log(`Failed to run process ${proc.label} due to: ${ex.stack}`)
            }
        }

        this._saveProcessTableToMemory()
    }
}

module.exports = OSKernel