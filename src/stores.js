import { writable } from 'svelte/store'

let _rules = {
    from0: {
        default: 0,
        to: {
            to1: {1: [3]} // go from 0 to 1 if (number of neighbors with state==1) == 3
        }
    },
    from1: {
        default: 1,
        to: {
            to0: {1: [0,1,4,5,6,7,8]}
        }
    }
}

export let rows = writable(50)
export let cols = writable(50)
export let speed = writable(1)
export let nStates = writable(2)
export let rules = writable(_rules)
// export let defaultRules = writable(_rules)