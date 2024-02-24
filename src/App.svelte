<script>
	import { onMount } from 'svelte'
	import Settings from './Settings.svelte'
	import { rows, cols, speed, nStates, rules } from './stores.js'

	let grid = [...Array($rows)].map(() => [...Array($cols)].map(() => 0)) //2D array
	$: grid = [...Array($rows)].map(() => [...Array($cols)].map(() => 0))

	let timeout
	let dt
	$: {
		clearTimeout(timeout)
		dt = Number(1000 / $speed)
		run()
	}
	let running = false

	let states = [...Array($nStates)].map((el, i) => i)
	$: {
		states = [...Array($nStates)].map((el, i) => i)
		resetGrid()
	}
	let drawingState = 1

	function getNeighborStates(cellState, j, k) {
		// object representing number of neighbors with each state
		let neighborStates = Object.fromEntries(states.map(state => [state, 0]))
		for (let jj = -1; jj <= 1; jj++) {
			if (grid[j+jj] === undefined) { continue }
			for (let kk = -1; kk <= 1; kk++) {
				let neighborState = grid[j+jj][k+kk]
				if (neighborState === undefined || (jj === 0 & kk === 0)) { continue }

				neighborStates[neighborState] += 1
			}
		}
		return neighborStates
	}

	function updateCell(cellState, j, k) {
		let neighborStates = getNeighborStates(cellState, j, k)

		const fromState = $rules[`from${cellState}`]
		if (!fromState) { console.log("no rule for ", cellState); return cellState }
		if (!fromState.to) { return fromState.default }

		for (let [toState, rule] of Object.entries(fromState.to)) {
			let newState = Number(toState[toState.length-1])
			for (let [neighborState, required] of Object.entries(rule)) {
				// if (required.length === 0) { continue }
				let nNeighbors = neighborStates[neighborState]
				if (required.includes(nNeighbors)) { return newState }
			}
		}
		return fromState.default || cellState
	}
	updateCell(1, 0, 0)

	function run() {
		timeout = setTimeout(() => {
			if (!running) { clearTimeout(timeout); return }

			// The temporary grid needs to be a deep copy of the original
			let newGrid = []
			grid.forEach((row) => {
				let newRow = []
				row.forEach((cell) => {
					newRow.push(cell)
				})
				newGrid.push(newRow)
			})

			grid.forEach((row, j) => {
				row.forEach((cellState, k) => {
					newGrid[j][k] = updateCell(cellState, j, k)
				})
			})
			grid = newGrid

			if (running) { run() }
		}, dt)
	}

	function playPause() {
		running = !running
		run()
	}
	function resetGrid() {
		grid = [...Array($rows)].map(() => [...Array($cols)].map(() => 0))
		running = false
	}
	function randomGrid() {
		grid = [...Array($rows)].map(() => [...Array($cols)].map(() => Math.floor(Math.random()*states.length)))
	}
	function hanldeClickOrDrag(e, j, k, click=false) {
		if (!(e.which === 1)) { return  } // left mouse not being pressed
		grid[j][k] = drawingState
	}

	// onMount(() => {
	// 	let cells = document.querySelectorAll(".cell")
	// 	cells.forEach((cell) => {
	// 		cell.style.width = "7px"
	// 		cell.style.hright = "7px"
	// 	})
	// })

</script>

<svelte:window on:keydown={(e) => {if(e.code === 'Space') { playPause() }}}/>

<main>
	<div class="main-area">
		<div class="grid" on:mousedown={(e) => e.preventDefault()}>
			{#each grid as row, j}
				<div class="row">
					{#each row as cell, k}
						<div 
							class={`cell state-${cell}`}
							on:mouseenter={(e) => hanldeClickOrDrag(e, j, k)} 
							on:click={(e) => hanldeClickOrDrag(e, j, k, true)}
						></div>
					{/each}
				</div>
			{/each}
		</div>
		<div class="grid-controls">
			<button on:click={playPause} class={running ? "red" : "green"}>
				{running ? "Pause" : "Play"}
			</button>
			<button on:click={resetGrid}>Reset</button>
			<button on:click={randomGrid}>Random</button>
			<div class="draw-settings">
				{#each states as state}
					<div on:click={() => drawingState = state} class:active={drawingState === state}>
						<div class={`state-${state} color-box`}></div>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<div class="settings-area">
		<Settings/>
	</div>
</main>

<style lang="scss">
	$clr-primary: green;
	$clr-dark: rgb(13, 21, 37);
	main {
		display: flex;
		margin: 0;
	}
	.settings-area {
		padding: 0;
		overflow-y: scroll;
		background-color: rgba(129, 150, 137, 0.281);
		width: 25%;
		min-width: 200px;
		height: 100vh;
		margin: 0;
		border-left: 2px solid $clr-dark
	}
	.draw-settings {
		display: flex;
		align-items: center;
		margin-left: 10px;
		.color-box {
			display: inline-block;
			width: 20px;
			height: 20px;
			margin: 1px;
		}
	}
	.active {
		div {border: 2px solid blue;}
	}

	.main-area {
		display: flex;
		width: 75%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.grid {
		max-width: 90vh;
		max-height: 90vh;
		overflow: scroll;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.green { background-color: rgb(152, 235, 152); }
	.red { background-color: rgb(243, 211, 211); }
	.grid-controls {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.row {
		display: flex;
		flex-direction: row;
	}
	.cell {
		width: 5px;
		height: 5px;
		border: 0.1px solid rgba(173, 173, 173, 0.596);
	}
	$state-colors: (0: $clr-dark, 1: rgb(83, 231, 150), 2: rgb(250, 103, 103),
	                3: steelblue, 4: rgb(189, 192, 35));
	@each $state, $clr in $state-colors {
		.state-#{$state} {
			background-color: $clr;
		}
	}
</style>