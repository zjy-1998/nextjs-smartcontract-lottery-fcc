// have a function to entry the lottery

import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
// we can just specify the folder instead of each files; because we have the index.js which represents the whole folder
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { Notification, useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    // const { chainId: chainIdHex } -> put out the chainId object and then rename as chainIdHex
    // header pass up all the info about the matemask to the moralis provider
    // and the moralis provider pass the info down to all the components
    // console.log(parseInt(chainIdHex))
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    // console.log(raffleAddress)

    // let entranceFee = "" // we need UI shows it and re-render as it changes
    const [entranceFee, setEntranceFee] = useState("0")
    // setEntranceFee() update entranceFee
    // entranceFee -> state; initialize as "0"

    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    const { runContractFunction: enterRaffle } = useWeb3Contract(
        {
            abi: abi,
            contractAddress: raffleAddress, // specify the networkId
            functionName: "enterRaffle",
            params: {},
            msgValue: entranceFee,
        } // read the entranceFee by hook
    ) // runContractFunction can send tx and read state

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getNumOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumOfPlayers()).toString()
        const recentWinnerFromCall = (await getRecentWinner()).toString()
        setEntranceFee(entranceFeeFromCall) // pass the value to entranceFee
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
        // console.log(entranceFee)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            // try to read the entranceFee
            updateUI()
        }
    }, [isWeb3Enabled]) // hook; get entranceFee when web3 is enable

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }
    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Completed!",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div>
            Hi from lottery entrance!
            {
                // only call the function so long as there is a raffle address
                raffleAddress ? (
                    <div>
                        <button
                            onClick={async function () {
                                await enterRaffle({
                                    // onComplete
                                    onSuccess: handleSuccess,
                                    onError: (error) => console.log(),
                                })
                            }}
                        >
                            Enter Raffle
                        </button>
                        Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                        NumberOfPlayers: {numPlayers}
                        Recent Winner: {recentWinner}
                    </div>
                ) : (
                    <div>No Raffle Address Detected</div>
                )
            }
        </div>
    )
}
