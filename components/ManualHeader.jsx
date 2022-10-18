// create a functinal based component
// export default: give other component to use this function

import { useMoralis } from "react-moralis"
import { useEffect } from "react"

export default function ManualHeader() {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3 } = useMoralis()
    // useMoralis() is a react hook; isWeb3Enabled is a viable that checks if our metamask is connected.
    // account checks if there is an account. (Web3 can be connected without account)
    // Hooks are good for rerendering website whenever some value changes.

    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])
    // useEffect() will keep checking the values in the []
    // [] changed, it will call the function on the left and rerender the front end
    // useEffect() will run all the time to listen isWeb3Enabled changed or not.
    // ran twice because React.Strict mode is on
    // useEffect(()=>{console.log(`Hi! ${isWeb3Enabled}`)}, []) -> blank dependency array, run once on load
    // no dependency array -> run anytime something re-renders

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if(account==null){
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null account found!")
            }
        })
    }, [])

    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        if (typeof window !== "undifined!") {
                            window.localStorage.setItem("connected", "injected")
                        }
                        // set new key value in local storage
                    }}
                    disabled={isWeb3Enabled}
                >
                    Connect
                </button>
            )}
        </div>
    )
}

// I'm going to show you the hard way first
// Then the easy way

// learning how to calculate a derivative
// learning the shortcut
