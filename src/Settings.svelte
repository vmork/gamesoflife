<script>
    import { rules, speed, rows, cols, nStates } from './stores.js'
    
    let expand = {}
    function toggleExpand(key) {
        if (!expand[key]) { expand[key] = true }
        else { expand[key] = !expand[key] }
        console.log(key)
    }
    function parseRuleInput(e, from, to, neighbor) {
        let val = e.target.value
        let newRule = val.split(",").filter((el) => el != "" && !isNaN(Number(el))).map((num) => Number(num))
        $rules[from].to[to][neighbor] = newRule
    }
    function sameOrDefault(prev, def) {
        if (prev === undefined) {
            prev = def
        }
    }
    function randomInt(min, max) {
        return Math.max(Math.floor(Math.random() * max), min)
    }
    function listRange(n) {
        return [...Array(n)].map((_el,i) => i)
    }
    function randomRules() {
        for (let [fromState, fromVal] of Object.entries($rules)) {
            for (let [toState, toVal] of Object.entries(fromVal.to)) {
                for (let [nNeighbors, required] of Object.entries(toVal)) {
                    let allowed = [1,2,3,4,5,6,7,8]
                    let randomRule = []
                    listRange(randomInt(0, 8)).forEach(() => {
                        let num = allowed[randomInt(0, allowed.length)]
                        allowed = allowed.filter((el) => el != num)
                        randomRule.push(num)
                    })
                    $rules[fromState].to[toState][nNeighbors] = randomRule
                }
            }
        }
    }
    function resetRules() {
        // console.log($defaultRules)
        // $rules = $defaultRules
    }

    const getRules = () => {return $rules}
    const setRules = (newRules) => { $rules = newRules }
    $: { // detta suger lite (mycket)
        let oldRules = getRules()
        let newRules = {}
        let decremented = Object.keys(oldRules).length > $nStates
        let range = [...Array($nStates)].map((_el,i) => i)
        range.forEach((from) => {
            newRules[`from${from}`] = oldRules[`from${from}`]  || { default: from, to: {} }
            console.log(from)

            range.forEach((to) => {
                if (from === to) { return }
                console.log(from)
                newRules[`from${from}`].to[`to${to}`] = newRules[`from${from}`].to[`to${to}`] || {}
                range.forEach((neighbors) => {
                    newRules[`from${from}`].to[`to${to}`][neighbors] = newRules[`from${from}`].to[`to${to}`][neighbors] || []
                    if (decremented) {
                        delete newRules[`from${from}`].to[`to${to}`][$nStates]
                    }
                })
            })
            if (decremented) {
                delete newRules[`from${from}`].to[`to${$nStates}`]
            }
        })
        setRules(newRules)
    }

</script>
<main>
    <div class="setting">
        Animation speed: <input type="range" bind:value={$speed} min=0.1 max=50 step=0.05> {$speed}
    </div>
    <div class="setting">
        Rows: <input type="number" bind:value={$rows} max=250>
        Cols: <input type="number" bind:value={$cols} max=250>
    </div>
    <div class="setting">
        Number of states: <input type="number" min=2 max=5 bind:value={$nStates}>
    </div>
    <div class="rules-section">
      <div class="top-row">
        <h1>Rules:</h1>
        <div class="buttons">
            <button on:click={resetRules}>
                Reset
            </button>
            <button on:click={randomRules}>
                Randomize
            </button>
        </div>
      </div>
      
    <ul class="no-pad">
    {#each Object.entries($rules) as [fromState, valFrom]}
        <li>
        <span on:click={() => toggleExpand(fromState)}>
            From {fromState.slice(-1)}: 
        </span> 
        {#if !expand[fromState]}
        <ul>
            <li>Default: <input type="number" bind:value={valFrom.default}></li>
            {#each Object.entries(valFrom.to) as [toState, valTo]}
                <li>
                <span on:click={() => toggleExpand(fromState + toState)}>
                    To {toState.slice(-1)}:
                </span>
                {#if !expand[fromState + toState]}
                <ul>
                    {#each Object.entries(valTo) as [neighborState, required]}
                        <li>
                        <span class="no-pointer">
                        {neighborState}: 
                        <input type="text" 
                            value = {required + (required.length ? "," : "")}
                            on:input={(e) => parseRuleInput(e, fromState,toState,neighborState)}>
                        </span>
                        </li>
                    {/each}
                </ul>
                {/if}
                </li>
            {/each}
        </ul>
        {/if}
        </li>
    {/each}
    </ul>
    </div>
</main>
<style lang="scss">
    @mixin input {
        all: unset;
        border-bottom: 1px solid rgb(18, 53, 18);
        &:focus {
            border-bottom: 2px solid rgb(62, 228, 62);
        }
    }

    .no-pad { padding-left: 7px !important; }
    .rules-section {
        ul {
            list-style-type: none;
            padding: 5px 0 0 30px;
        }
        span:not(.no-pointer) {
            cursor: pointer;
        }
        input[type="number"] {
            @include input;
            width: 30px;
        }
        input[type="text"] {
            @include input;
            width: 80px;
            padding-top: 5px;
        }
    }
    .setting {
        padding: 10px 5px;
        border-bottom: 1px solid black;
        border-collapse: collapse;
        display: flex;
        input[type="number"] {
            @include input;
            width: 50px;
            margin: 0 5px;
        }
        input[type="range"] {
            width: 80px;
            margin: 0 5px;
        }
    }
    h1 {
        padding: 5px;
        margin:0;
        font-size: 1.5em;
    }
    .buttons {
        margin-left: auto;
        margin-right: 0;
        font-size: 0.8em;
    }
    .top-row {
        display: flex;
    }
</style>
