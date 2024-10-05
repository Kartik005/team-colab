import {atom, useAtom} from "jotai";

const modalState = atom(false);
//** in short, atom is the way of declaring a global state that can be accessed over all modules


// atom is a primitive state management function

// so we have created an atom with a fixed value
// wherever this value is used from this module,
// that component will rerender when the state of this atom changes

export const useCreateWorkspaceModal = ()=>{
    return useAtom(modalState);
}