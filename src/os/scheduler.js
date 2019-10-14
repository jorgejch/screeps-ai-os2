'use strict'

module.exports = class OSScheduler {
    _getFreePid() {
        let lastPid = 0

        if (Object.keys(this.processTable).length > 0){
            lastPid = Object.keys(this.processTable).sort((a, b) => b - a)[0]
        }
        for (let candidate = 0; candidate <= lastPid + 1; candidate++) {
            if (!this.processTable[candidate]) {
                return candidate
            }
        }
    }

    setProcessTable(table) {
        this.processTable = table
    }

    init() {
        this.orderedPids = Object.keys(this.processTable).sort((a, b) => a.priority - b.priority)
    }

    nextProcessToRun() {
        const procPid = this.orderedPids.shift()

        if (procPid){
            return this.processTable[procPid]
        }
        return undefined
    }

    launchProcess(processClass, label, parentPid = null, priority = 90) {
        const pid = this._getFreePid()
        const process = new processClass(pid, parentPid, label, priority)
        this.processTable[pid] = process
        return process
    }

}