class TaskManager {
	constructor() {
		this._global_tid = 0
		this._tasks = {}
		this._proms = {}
	}

	async _advance(tid) {
		let this_task = this._tasks[tid]
		let this_prom = this._proms[tid]
		var result = await this_task()
		this_prom(result)

		delete this._tasks[tid]
		delete this._proms[tid]

		if (Object.keys(this._tasks).length > 0) {
			var next_tid = String(Number(tid)+1)
			this._advance(next_tid)
		}
	}

	add(task) {
		let tid = String(this._global_tid)
		this._global_tid += 1
		this._tasks[tid] = task

		var prom =  new Promise((resolve, reject) => {
			this._proms[tid] = resolve
		})

		if (Object.keys(this._tasks).length == 1) {
			this._advance(tid)
		}

		return prom
	}
}

module.exports = TaskManager